// Rules across a transaction's fields, and across linked transactions
// (FS-1131): what the schema cannot say. Each is named, cites its place in
// docs/specs/transactions.md, and has worked examples in examples.json that
// any implementation must pass, ours (the docs' check) and the code's.
//
// `apply(transactions)` takes a set of transactions, each in the shape of
// transaction.schema.json, and returns every break as
// { id, source, txid, message }. A set is read as complete: a link whose
// target is not in it is a break, as it would be in the store.

'use strict';

const crypto = require('crypto');

// The body's hash: SHA-256 over its canonical JSON (RFC 8785: keys
// sorted, no whitespace; our values are integers, strings, booleans and
// arrays, so key order is all the canonical form changes).
function canonical(v) {
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  if (v && typeof v === 'object') return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}`;
  return JSON.stringify(v);
}
const bodyHash = (body) => `sha256:${crypto.createHash('sha256').update(canonical(body)).digest('hex')}`;

// The short reference: nine of Crockford's base-32 symbols and two check
// digits by ISO 7064 MOD 97-10, as IBANs (ISO 13616) and LEIs (ISO 17442)
// carry them (FS-1143): each letter read as its number (A is 10, Z 35),
// the whole taken modulo 97; a valid reference leaves 1.
const SYMBOLS = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const mod97 = (chars) => [...chars].reduce((r, c) => {
  const n = String(parseInt(c, 36));
  return [...n].reduce((x, d) => (x * 10 + Number(d)) % 97, r);
}, 0);
const checkDigits = (data) => String(98 - mod97(`${data}00`)).padStart(2, '0');
const referenceValid = (ref) => typeof ref === 'string' && /^[0-9A-HJKMNP-TV-Z]{9}[0-9]{2}$/.test(ref) && mod97(ref) === 1;

// Each link's forward fact, appended to the target's footer.
const INVERSE = { reverses: 'reversed_by', refunds: 'refunded_by', corrects: 'corrected_by', part_of: 'has_part', replaces: 'replaced_by', fee_for: 'has_fee' };
// What each kind must link to (spec §4, the kinds).
const MUST_LINK = { reversal: 'reverses', refund: 'refunds', adjustment: 'corrects' };
// Money leaving, or a ledger entry changed by hand: approved before it moves.
const NEEDS_APPROVAL = (t) => t.body.direction === 'out' || ['reversal', 'refund', 'write_off', 'adjustment'].includes(t.header.kind);
const MOVED = ['sent', 'settled'];

const sum = (lines) => lines.reduce((n, l) => n + l.amount.minor, 0);
const firstAt = (t, statuses) => (t.footer.status_history.find((s) => statuses.includes(s.status)) || {}).at;

const RULES = [
  {
    id: 'approved-body-unchanged',
    source: 'transactions rule 2',
    each: (t) => (t.footer.approval && t.footer.approval.body_hash !== bodyHash(t.body)
      ? 'the body differs from what was approved: its hash is not the approval\'s' : null),
  },
  {
    id: 'reference-checks',
    source: 'transactions rule 7',
    each: (t) => (referenceValid(t.header.reference) ? null : `reference ${t.header.reference} fails its check digits`),
  },
  {
    id: 'one-txid-per-request',
    source: 'transactions rule 7',
    all: (ts) => {
      const seen = new Map();
      const out = [];
      for (const t of ts) {
        const k = `${t.header.institution}|${t.header.idempotency_key}`;
        if (seen.has(k) && seen.get(k) !== t.header.txid) out.push([t, `idempotency key ${t.header.idempotency_key} already belongs to ${seen.get(k)}: a retry is the same transaction`]);
        else seen.set(k, t.header.txid);
      }
      return out;
    },
  },
  {
    id: 'links-resolve',
    source: 'transactions rule 5',
    all: (ts, by) => {
      const out = [];
      for (const t of ts) {
        for (const l of t.header.links) {
          if (l.rel === 'in_batch') continue; // a batch is a container, not a transaction
          const o = by.get(l.txid);
          if (!o) { out.push([t, `${l.rel} ${l.txid}, which does not exist`]); continue; }
          if (o.header.institution !== t.header.institution) out.push([t, `${l.rel} a transaction of another institution`]);
          if (o.body.amount.currency !== t.body.amount.currency) out.push([t, `${l.rel} a transaction in ${o.body.amount.currency}`]);
          if (o.header.created_at > t.header.created_at) out.push([t, `${l.rel} a later transaction: links point back only`]);
        }
      }
      return out;
    },
  },
  {
    id: 'kind-links',
    source: 'transactions §4, the kinds',
    each: (t) => {
      const need = MUST_LINK[t.header.kind];
      const rels = t.header.links.map((l) => l.rel);
      if (need && rels.filter((r) => r === need).length !== 1) return `a ${t.header.kind} ${need} exactly one transaction`;
      for (const [kind, rel] of Object.entries(MUST_LINK)) if (kind !== t.header.kind && rels.includes(rel)) return `only a ${kind} ${rel} another transaction`;
      if (t.header.kind === 'write_off' && t.header.rail !== 'none') return 'a write-off moves no money: its rail is none';
      return null;
    },
  },
  {
    id: 'reversal-opposite',
    source: 'transactions rule 5',
    all: (ts, by) => ts.filter((t) => t.header.kind === 'reversal').flatMap((t) => {
      const o = by.get((t.header.links.find((l) => l.rel === 'reverses') || {}).txid);
      const flip = { out: 'in', in: 'out', internal: 'internal' };
      return o && t.body.direction !== flip[o.body.direction] ? [[t, `a reversal runs opposite to the original (${o.body.direction})`]] : [];
    }),
  },
  {
    id: 'reversals-within-original',
    source: 'transactions rule 5',
    all: (ts, by) => {
      const back = new Map();
      for (const t of ts) for (const l of t.header.links) if (l.rel === 'reverses' || l.rel === 'refunds') back.set(l.txid, (back.get(l.txid) || 0) + t.body.amount.minor);
      return [...back].filter(([id, n]) => by.has(id) && n > by.get(id).body.amount.minor)
        .map(([id, n]) => [by.get(id), `reversed and refunded ${n} minor units, more than its ${by.get(id).body.amount.minor}`]);
    },
  },
  {
    id: 'parts-sum-to-parent',
    source: 'transactions rule 5',
    all: (ts, by) => {
      const parts = new Map();
      for (const t of ts) for (const l of t.header.links) if (l.rel === 'part_of') parts.set(l.txid, (parts.get(l.txid) || 0) + t.body.amount.minor);
      return [...parts].filter(([id, n]) => by.has(id) && n !== by.get(id).body.amount.minor)
        .map(([id, n]) => [by.get(id), `its parts sum to ${n} minor units, not its ${by.get(id).body.amount.minor}`]);
    },
  },
  {
    id: 'forward-links-recorded',
    source: 'transactions rule 5',
    all: (ts, by) => {
      const out = [];
      for (const t of ts) {
        for (const l of t.header.links) {
          const o = by.get(l.txid);
          if (!o || !INVERSE[l.rel]) continue;
          const f = o.footer.linked_by.find((x) => x.rel === INVERSE[l.rel] && x.txid === t.header.txid);
          if (!f) out.push([o, `its footer lacks ${INVERSE[l.rel]} ${t.header.txid}`]);
          else if (f.at < t.header.created_at) out.push([o, `${INVERSE[l.rel]} ${t.header.txid} is dated before that transaction was created`]);
        }
        for (const f of t.footer.linked_by) {
          const o = by.get(f.txid);
          const rel = Object.keys(INVERSE).find((k) => INVERSE[k] === f.rel);
          if (!o || !o.header.links.some((l) => l.rel === rel && l.txid === t.header.txid)) out.push([t, `${f.rel} ${f.txid}, which does not link to it`]);
        }
      }
      return out;
    },
  },
  {
    id: 'charges-in-order',
    source: 'transactions rule 8',
    each: (t) => {
      const cur = t.body.amount.currency;
      const all = [...t.body.charges, ...(t.footer.rail_charges || [])];
      if (all.some((c) => c.amount.currency !== cur)) return `a charge is not in ${cur}`;
      const lines = t.body.charges.map((c) => c.line);
      if (new Set(lines).size !== lines.length) return 'two charges share a line number';
      for (const c of t.body.charges) {
        if (c.on !== undefined && c.kind !== 'tax') return `line ${c.line}: only a tax is charged on another line`;
        if (c.on !== undefined && !t.body.charges.some((x) => x.line === c.on && x.kind === 'fee')) return `line ${c.line}: a tax on line ${c.on}, which is not a fee`;
      }
      return null;
    },
  },
  {
    id: 'settled-as-approved',
    source: 'transactions rule 3',
    each: (t) => {
      const s = t.footer.settled;
      if (!s) return null;
      if (s.currency !== t.body.amount.currency) return `settled in ${s.currency}, instructed in ${t.body.amount.currency}`;
      const want = t.body.amount_type === 'receive' ? t.body.amount.minor : t.body.amount.minor - sum(t.body.charges.filter((c) => c.deducted));
      return s.minor !== want ? `settled ${s.minor} minor units; a ${t.body.amount_type} amount with these charges settles ${want}` : null;
    },
  },
  {
    id: 'allocation-sums',
    source: 'transactions rule 8',
    each: (t) => {
      const a = t.footer.allocation;
      if (!a || !a.length) return null;
      const total = (t.footer.settled || t.body.amount).minor;
      return sum(a) !== total ? `its allocation sums to ${sum(a)} minor units, not ${total}` : null;
    },
  },
  {
    id: 'statuses-in-order',
    source: 'transactions §5, the states',
    each: (t) => {
      const h = t.footer.status_history;
      if (h[0].status !== 'created') return 'its first status is not created';
      for (let i = 1; i < h.length; i++) if (h[i].at < h[i - 1].at) return `${h[i].status} is dated before ${h[i - 1].status}`;
      if (h.some((s) => s.status === 'settled') && !t.footer.settled) return 'settled, with no settled amount';
      return null;
    },
  },
  {
    id: 'approved-before-it-moves',
    source: 'transactions rule 2',
    each: (t) => {
      if (!NEEDS_APPROVAL(t)) return null;
      const moved = firstAt(t, MOVED);
      if (!moved) return null;
      if (!t.footer.approval) return 'money moved with no approval';
      return t.footer.approval.at > moved ? 'money moved before its approval' : null;
    },
  },
  {
    id: 'checked-before-sending',
    source: 'transactions rule 4',
    each: (t) => {
      const d = t.body.destination;
      const sent = firstAt(t, MOVED);
      if (!d || !sent || t.body.direction !== 'out') return null;
      const passed = (c) => (t.footer.checks || []).some((x) => x.check === c && x.result === 'pass' && x.at <= sent);
      if (d.alias && !passed('resolved_again')) return 'sent to an alias not resolved again before sending';
      if (d.address.kind === 'wallet') for (const c of ['operator', 'number_binding', 'sim_swap']) if (!passed(c)) return `sent to a wallet without a passed ${c} check`;
      return null;
    },
  },
];

// A transaction's position (spec §5): its own status, or, once settled or
// returned, what its reversals and refunds leave of it. Computed from the
// forward facts on its footer, never stored.
function position(t, by) {
  const status = t.footer.status_history[t.footer.status_history.length - 1].status;
  if (!['settled', 'returned'].includes(status)) return status;
  const total = (rel) => t.footer.linked_by.filter((f) => f.rel === rel && by.has(f.txid))
    .reduce((n, f) => n + by.get(f.txid).body.amount.minor, 0);
  const reversed = total('reversed_by');
  const refunded = total('refunded_by');
  if (!reversed && !refunded) return status;
  const whole = reversed + refunded >= t.body.amount.minor;
  const word = reversed ? 'reversed' : 'refunded';
  return whole ? word : `partly_${word}`;
}

function apply(transactions) {
  const by = new Map(transactions.map((t) => [t.header.txid, t]));
  const out = [];
  const push = (r, t, message) => out.push({ id: r.id, source: r.source, txid: t.header.txid, message });
  for (const r of RULES) {
    if (r.each) for (const t of transactions) { const m = r.each(t); if (m) push(r, t, m); }
    if (r.all) for (const [t, m] of r.all(transactions, by)) push(r, t, m);
  }
  return out;
}

module.exports = { RULES, apply, position, bodyHash, canonical, checkDigits, referenceValid, INVERSE };
