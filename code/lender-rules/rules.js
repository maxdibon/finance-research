// Rules across a product's terms (FS-825): what the schema cannot say.
// Each is named, cites its source, and has worked examples in
// rules.examples.json that any implementation must pass, ours (the docs'
// check) and the code's. A rule whose terms are missing, or still blank,
// is not applied: it waits for them.
//
// `product` maps each term's key to its value (the settled value, or
// what is proposed until then).

'use strict';

const has = (v) => v !== undefined && v !== null;
const DAYS = { day: 1, week: 7, month: 30 };

const RULES = [
  {
    id: 'amount-limits-in-order',
    source: 'lender-rules §2.4, Amount limits',
    check: ({ amount_limits: a }) => (a && has(a.min) && has(a.max) && a.min > a.max
      ? `the minimum (${a.min}) is above the maximum (${a.max})` : null),
  },
  {
    id: 'term-lengths-in-order',
    source: 'lender-rules §2.4, Term',
    check: ({ term: t }) => {
      if (!t) return null;
      if (has(t.min) && has(t.max) && t.min > t.max) return `the shortest term (${t.min}) is above the longest (${t.max})`;
      if (!has(t.allowed) && !(has(t.min) && has(t.max))) return 'neither a list of allowed terms nor a minimum and a maximum';
      return null;
    },
  },
  {
    id: 'instalments-fit-the-term',
    source: 'lender-rules §2.4, Repayment frequency',
    check: ({ term: t, repayment_frequency: r }) => {
      if (!t || !r || !DAYS[r.every] || !DAYS[t.unit]) return null;
      const shortest = has(t.allowed) ? Math.min(...t.allowed) : t.min;
      if (!has(shortest)) return null;
      return shortest * DAYS[t.unit] < DAYS[r.every]
        ? `an instalment every ${r.every} does not fit a term of ${shortest} ${t.unit}(s)` : null;
    },
  },
  {
    id: 'one-price-per-fee',
    source: 'lender-rules §2.4, Fees',
    check: ({ fees }) => {
      if (!Array.isArray(fees)) return null;
      const bad = fees.filter((f) => ['amount', 'percent', 'tiers'].filter((k) => has(f[k])).length !== 1);
      return bad.length ? `${bad.map((f) => f.name).join(', ')}: each fee needs exactly one of an amount, a percent or tiers` : null;
    },
  },
  {
    id: 'fee-tiers-within-limits',
    source: 'lender-rules §2.4, Fees and Amount limits',
    check: ({ fees, amount_limits: a }) => {
      if (!Array.isArray(fees)) return null;
      const out = [];
      for (const f of fees.filter((x) => Array.isArray(x.tiers))) {
        const tiers = [...f.tiers].sort((x, y) => x.from - y.from);
        tiers.forEach((t, i) => {
          if (t.from > t.to) out.push(`${f.name}: a tier from ${t.from} to ${t.to}`);
          if (i && t.from <= tiers[i - 1].to) out.push(`${f.name}: tiers overlap at ${t.from}`);
          if (a && has(a.min) && has(a.max) && (t.from < a.min || t.to > a.max)) out.push(`${f.name}: a tier (${t.from} to ${t.to}) outside the amount limits (${a.min} to ${a.max})`);
        });
      }
      return out.length ? out.join('; ') : null;
    },
  },
  {
    id: 'no-early-repayment-charge',
    source: 'CBK lender regulations reg 56(3), (4); LQ-13',
    check: ({ fees }) => {
      if (!Array.isArray(fees)) return null;
      const bad = fees.filter((f) => /early|prepay|pre_pay|minimum_interest|settlement/.test(f.name || ''));
      return bad.length ? `${bad.map((f) => f.name).join(', ')}: a charge on early repayment is never a term` : null;
    },
  },
  {
    id: 'default-period-within-reg-57',
    source: 'CBK lender regulations reg 57',
    check: ({ default_period: d }) => (d && has(d.days_past_due) && d.days_past_due > 30
      ? `${d.days_past_due} days past due: reg 57 makes a loan non-performing at 30 at the latest` : null),
  },
  {
    id: 'default-interest-after-grace',
    source: 'lender-rules §2.4, Grace and Default interest',
    check: ({ grace: g, default_interest: d }) => (g && d && has(g.days) && has(d.from_day_past_due) && d.from_day_past_due <= g.days
      ? `default interest from day ${d.from_day_past_due} falls inside ${g.days} days' grace` : null),
  },
  {
    id: 'excise-duty-on-fees',
    source: 'Excise Duty Act, First Schedule, Part II; LQ-14',
    check: ({ tax_on_fees: t, fees }) => {
      if (Array.isArray(fees) && fees.length && !t) return 'fees with no tax on fees: excise duty is due on them';
      if (t && has(t.excise_duty_percent) && t.excise_duty_percent !== 20) return `excise duty of ${t.excise_duty_percent}%; the Act sets 20%`;
      return null;
    },
  },
  {
    id: 'risk-class-range',
    source: 'lender-rules §2.4, Rate by risk class; reg 59(2)(c)',
    check: ({ rate_by_risk_class: r }) => {
      if (!r || r.by_risk_class !== true) return null;
      if (r.range === undefined) return 'a rate by risk class with no range to publish';
      if (has(r.range) && has(r.range.min) && has(r.range.max) && r.range.min > r.range.max) return `the range runs from ${r.range.min} down to ${r.range.max}`;
      return null;
    },
  },
  {
    id: 'collection-ladder-in-order',
    source: 'lender-rules §2.4, Collection ladder',
    check: ({ collection_ladder: c }) => {
      if (!c || !Array.isArray(c.stages)) return null;
      const out = [];
      c.stages.forEach((s, i) => {
        if (has(s.from) && has(s.to) && s.from > s.to) out.push(`${s.stage} runs from day ${s.from} to day ${s.to}`);
        if (i && has(s.from) && has(c.stages[i - 1].from) && s.from < c.stages[i - 1].from) out.push(`${s.stage} starts before ${c.stages[i - 1].stage}`);
      });
      return out.length ? out.join('; ') : null;
    },
  },
  {
    id: 'cut-off-is-a-window',
    source: 'lender-rules §2.4, Cut-off',
    check: ({ cut_off: c }) => (c && has(c.no_payout_from) && c.no_payout_from === c.to ? 'the cut-off starts and ends at the same time' : null),
  },
];

// Every rule's finding for a product, as { id, source, message }.
function apply(product) {
  return RULES.map((r) => ({ id: r.id, source: r.source, message: r.check(product) })).filter((x) => x.message);
}

module.exports = { RULES, apply };
