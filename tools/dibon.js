#!/usr/bin/env node
// The team's words (FS-847 to FS-849): one small vocabulary for everyone.
// A project manager says them to Claude in the desktop app; a developer
// types them: `dibon <word>`. Underneath, each does the git, the checks
// and the records the same way, so the documents stay in step.
//
//   dibon help [word]      every word, with examples
//
// Rules the words keep: update moves work one way (shared to mine), share
// the other (mine to shared); the checks run before save and share; an
// argument is never guessed at; anything that cannot be undone asks first
// (--yes answers for you, as Claude does once you have said yes in chat).

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');
const { execFileSync, spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const YES = args.includes('--yes');
const flag = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const plain = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && args[i - 1] !== '--yes'));
const today = () => new Date().toISOString().slice(0, 10);
const norm = (s) => s.replace(/\r\n/g, '\n');

// ── words: the one source of the help, the guide's headings and the tests ─
const WORDS = [
  ['update', 'Bring my copy up to date with the shared one (shared to mine).', ['dibon update']],
  ['start', 'Begin a piece of work on its own branch, with its register row.', ['dibon start "Roan Capital meeting, 22 October"', 'dibon start "Fix the agenda" --row FS-826']],
  ['note', 'Write the change note: what changed, for whom.', ['dibon note "Two open answers settled" --for roan-capital', 'dibon note "Checks explain themselves" --for team --kind patch']],
  ['meeting', 'Open a meeting record for a customer, registered as a document.', ['dibon meeting roan-capital 2026-10-22']],
  ['answered', 'Move a customer\'s open answer to Answered, dated, with the answer.', ['dibon answered roan-capital 24 "The accountant and the finance lead receive it"']],
  ['received', 'Keep a document from outside as an original, and register it.', ['dibon received "C:\\Users\\me\\Downloads\\Signed agreement.pdf" --from roan-capital --summary "The services agreement as signed"']],
  ['check', 'Run the checks and say, in plain words, what to fix.', ['dibon check']],
  ['save', 'Save my work on my branch, with its register row; the checks run first.', ['dibon save "Open answer 26: two administrators"', 'dibon save docs/customers/roan-capital.md']],
  ['undo', 'Take back my last save (before share: kept as edits; after: a correcting change).', ['dibon undo']],
  ['discard', 'Throw away unsaved changes to one file, after showing what is lost.', ['dibon discard docs/customers/roan-capital.md']],
  ['share', 'Send my branch for review (mine to shared); the checks run first.', ['dibon share']],
  ['ready', 'Mark my shared work ready for review.', ['dibon ready']],
  ['status', 'Where am I: my branch, what is unsaved, unshared, and waiting.', ['dibon status']],
  ['history', 'What changed in one document, newest first, by release.', ['dibon history docs/customers/roan-capital.md']],
  ['help', 'Every word, or one word, with examples.', ['dibon help', 'dibon help save']],
  ['release', 'The owner only: release the documentation, or a customer\'s delivery.', ['dibon release docs', 'dibon release roan-capital']],
  ['practice', 'A private sandbox to try every word without touching the real documents.', ['dibon practice']],
  ['role', 'Tell the words your role, once (used in notes and records).', ['dibon role "Project manager"']],
];

// ── plumbing ──────────────────────────────────────────────────────────────
function git(a, opts = {}) {
  const r = spawnSync('git', ['-C', ROOT, ...a], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  if (r.status !== 0 && !opts.ok) throw new Error((r.stderr || r.stdout || `git ${a[0]} failed`).trim());
  return opts.full ? r : (r.stdout || '').trim();
}
const say = (s = '') => console.log(s);
class Stop extends Error {}
const stop = (msg) => { throw new Stop(msg); };
async function ask(question) {
  if (YES) return true;
  if (!process.stdin.isTTY) stop(`${question}\n(Answer by running the word again with --yes.)`);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const a = await new Promise((res) => rl.question(`${question} [yes/no] `, res));
  rl.close();
  return /^y(es)?$/i.test(a.trim());
}
const branch = () => git(['rev-parse', '--abbrev-ref', 'HEAD']);
const onMain = () => ['main', 'master'].includes(branch());
const rowOfBranch = () => (branch().match(/FS-\d{3}/) || [])[0];
const hasRemote = () => git(['remote'], { ok: true }).split('\n').includes('origin');
// Not trimmed: porcelain's first column may be a space (" M file").
const unsaved = () => git(['status', '--porcelain'], { full: true }).stdout.split('\n').filter((l) => l.trim()).map((l) => ({ code: l.slice(0, 2), file: l.slice(3).replace(/^"|"$/g, '') }));
function role() {
  const r = git(['config', '--get', 'dibon.role'], { ok: true });
  if (!r) stop('Tell me your role once: dibon role "Project manager" (a role, never a name).');
  return r;
}
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').split('-').slice(0, 6).join('-');
const read = (rel) => norm(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
function write(rel, text) {
  const p = path.join(ROOT, rel);
  const crlf = fs.existsSync(p) && fs.readFileSync(p, 'utf8').includes('\r\n');
  fs.writeFileSync(p, crlf ? text.replace(/\n/g, '\r\n') : text);
}
const customers = () => fs.readdirSync(path.join(ROOT, 'docs', 'customers')).filter((f) => f.endsWith('.md') && !f.startsWith('_')).map((f) => f.slice(0, -3));
function party(id) {
  if (!customers().includes(id)) stop(`"${id}" is not a customer. The customers are: ${customers().join(', ')}.`);
  return (read(`docs/customers/${id}.md`).match(/^name: *(.+?) —/m) || [])[1];
}

// The checks, explained. The protected-names list is never in git, so a
// copy without it (a practice copy, a new clone) skips that one check only.
function checks() {
  const { runAll } = require('./check');
  const names = fs.existsSync(path.join(ROOT, 'sources', 'confidential', 'protected-names.txt'));
  return runAll(ROOT).filter((f) => names || f.check !== 'names');
}
function explain(failures) {
  say(`Not done: ${failures.length} thing${failures.length === 1 ? '' : 's'} to fix first.`);
  for (const f of failures.slice(0, 12)) say(`  ${f.file}${f.line ? `, line ${f.line}` : ''}: ${f.message}`);
  if (failures.length > 12) say(`  …and ${failures.length - 12} more: dibon check lists them all.`);
  say('Fix them, then say the word again. A stop protects your work; nothing was lost.');
}

// ── the register: a new row on start ─────────────────────────────────────
// The next id is the next across REVIEW.md and review/ (FS-866); a new row
// is open, so it goes in REVIEW.md.
function newRow(point) {
  const t = read('REVIEW.md');
  const id = require('./register').nextId(ROOT);
  const who = git(['config', '--get', 'user.name'], { ok: true }).split(' ')[0] || role();
  const row = `| ${id} | ${who} | ${point.replace(/\|/g, '/')} | OPEN | Medium | **${today()}:** started (dibon) |`;
  write('REVIEW.md', `${t.trimEnd()}\n${row}\n`);
  return id;
}

// ── the document register: a new row ─────────────────────────────────────
// By the register's columns (tools/docregister.js, FS-857); the
// customer's own table of documents, on its delivery map, follows.
function registerRow(o, customer) {
  const reg = require('./docregister');
  const t = read('docs/document-register.md');
  const ids = reg.parse(t).rows.map((r) => +r.id.slice(3));
  const id = `DR-${String(Math.max(...ids) + 1).padStart(3, '0')}`;
  write('docs/document-register.md', `${t.trimEnd()}\n${reg.row({ ...o, id })}\n`);
  if (customer && fs.existsSync(path.join(ROOT, 'docs', 'customers', `${customer}.md`))) reg.refresh(ROOT, customer);
  return id;
}

// FS-862: a fuller commit message for save and release: the subject the
// word builds, then a body from --body-file (the why, and any trailer such
// as Co-Authored-By), as the conventions ask (ways-of-working §6).
function message(subject) {
  const f = flag('--body-file');
  if (!f) return ['-m', subject];
  if (!fs.existsSync(f)) stop(`No file at ${f}: --body-file names the message's body.`);
  const body = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n').trim();
  return body ? ['-m', subject, '-m', body] : ['-m', subject];
}

// ── the words ─────────────────────────────────────────────────────────────
const word = {
  async help() {
    const w = plain[1];
    if (w) {
      const d = WORDS.find((x) => x[0] === w);
      if (!d) stop(`No word "${w}". dibon help lists them.`);
      say(`${d[0]}: ${d[1]}`);
      for (const e of d[2]) say(`  ${e}`);
      return;
    }
    say('The team\'s words (docs/service-management/ways-of-working.md, §7 to §10):');
    for (const [w2, what] of WORDS) say(`  ${w2.padEnd(9)} ${what}`);
    say('Three rules: update first; a stop protects you; nothing is guessed, so say what you mean.');
  },

  async role() {
    const r = plain[1];
    if (!r) stop('Say your role: dibon role "Project manager".');
    git(['config', 'dibon.role', r]);
    say(`Your role is "${r}". It goes in your notes and records, never your name.`);
  },

  async update() {
    const dirty = unsaved().filter((u) => u.code !== '??');
    if (dirty.length) stop(`You have unsaved edits (${dirty.map((u) => u.file).join(', ')}). Save them (dibon save) or discard them (dibon discard <file>) first.`);
    if (!hasRemote()) stop('There is no shared copy to update from.');
    git(['fetch', '--quiet', 'origin']);
    const behind = +git(['rev-list', '--count', 'HEAD..origin/main']);
    if (!behind) { say('Your copy is up to date: nothing new from the team.'); return; }
    const files = git(['diff', '--name-only', 'HEAD...origin/main']).split('\n').filter(Boolean);
    const r = git(['rebase', 'origin/main'], { ok: true, full: true });
    if (r.status !== 0) {
      git(['rebase', '--abort'], { ok: true });
      stop('Your work and a teammate\'s change touch the same lines. Nothing is lost: your copy is as it was. Ask for help (Claude, or an engineer) to bring the two together.');
    }
    say(`Your copy is up to date: ${behind} change${behind === 1 ? '' : 's'} from the team, in ${files.length} file${files.length === 1 ? '' : 's'}:`);
    for (const f of files.slice(0, 10)) say(`  ${f}`);
  },

  async start() {
    const topic = plain[1];
    if (!topic) stop('Say what you are starting: dibon start "Roan Capital meeting, 22 October".');
    const dirty = unsaved().filter((u) => u.code !== '??');
    if (dirty.length) stop('You have unsaved edits. Save or discard them first, so this work starts clean.');
    const kind = flag('--kind') || 'docs';
    if (!['docs', 'spec', 'code', 'fix', 'tool'].includes(kind)) stop('--kind is docs, spec, code, fix or tool.');
    let base = 'main';
    if (hasRemote()) { git(['fetch', '--quiet', 'origin']); base = 'origin/main'; }
    const row = flag('--row');
    if (row && !/^FS-\d{3}$/.test(row)) stop('--row is an FS id: --row FS-826.');
    const name = `${kind}/${row || 'FS-NEW'}-${slug(topic)}`;
    if (!await ask(`Start "${topic}" on a new branch from the shared copy${row ? `, for ${row}` : ', with a new register row'}?`)) return say('Not started.');
    git(['switch', '-c', name, base]);
    let id = row;
    if (!id) {
      id = newRow(topic);
      git(['branch', '-m', name.replace('FS-NEW', id)]);
    }
    say(`Started on ${branch()}, for ${id}. Make your changes, then: dibon save, then dibon share.`);
  },

  async note() {
    const text = plain[1];
    if (!text) stop('Say what changed: dibon note "Two open answers settled" --for roan-capital.');
    const forWhom = flag('--for') || 'team';
    if (forWhom !== 'team' && forWhom !== 'everyone') party(forWhom);
    const kind = flag('--kind') || 'minor';
    if (!['major', 'minor', 'patch'].includes(kind)) stop('--kind is major, minor or patch.');
    const rows = flag('--rows') || rowOfBranch();
    if (!rows) stop('Which register row? Start your work with dibon start, or say --rows FS-123.');
    if (forWhom !== 'team' && /\b[A-Z]{2,3}-\d{2,3}\b/.test(text)) stop('This note is read outside Dibon, so it carries no register ids. Say it in plain words; the ids go in --rows.');
    let file = `changes/${today()}-${slug(text)}.md`;
    for (let n = 2; fs.existsSync(path.join(ROOT, file)); n++) file = `changes/${today()}-${slug(text)}-${n}.md`;
    write(file, `---\nkind: ${kind}\nfor: ${forWhom}\nrows: [${rows}]\nby: ${role()}\n---\n${text}\n`);
    say(`Noted for ${forWhom}, ${kind} (${file}). It goes out with the next release; dibon save keeps it with your work.`);
  },

  async meeting() {
    const [, id, date] = plain;
    if (!id || !/^\d{4}-\d{2}-\d{2}$/.test(date || '')) stop('Say the customer and the date: dibon meeting roan-capital 2026-10-22.');
    const who = party(id);
    const dir = `clients/${id}/meeting-${date}`;
    if (fs.existsSync(path.join(ROOT, dir, 'record.md'))) stop(`A record for ${date} already exists: ${dir}/record.md.`);
    const row = rowOfBranch();
    if (!row) stop('Start the work first (dibon start "…"), so the meeting has its register row.');
    fs.mkdirSync(path.join(ROOT, dir), { recursive: true });
    fs.writeFileSync(path.join(ROOT, dir, 'record.md'), `# ${who} · meeting · ${date} · record\n\nInternal (${row}). Not in git: it holds ${who}'s answers. Roles, not names.\n\n| Q | Asked | Where it lands | Answer | Owner | By |\n|---|---|---|---|---|---|\n| 1 | | | | | |\n\n**Afterwards:** each answer with dibon answered; documents with dibon received; a note for ${who} with dibon note.\n`);
    const dr = registerRow({ party: who, title: `Meeting record (${date})`, summary: `What was said and agreed at the meeting of ${date}, kept for us`, kind: 'Working', version: '—', status: 'internal', date, from: 'Dibon', where: `\`${dir}/\``, print: '—', rows: row }, id);
    say(`Meeting record opened: ${dir}/record.md (outside git), registered as ${dr}.`);
  },

  async answered() {
    const [, id, n, answer] = plain;
    if (!id || !/^\d+$/.test(n || '') || !answer) stop('Say the customer, the open answer\'s number and the answer: dibon answered roan-capital 24 "…".');
    party(id);
    const rel = `docs/customers/${id}.md`;
    const t = read(rel);
    const s4 = t.indexOf('\n## 4 · ');
    const s5 = t.indexOf('\n## 5 · ');
    const four = t.slice(s4, s5);
    const lines = four.split('\n');
    const at = lines.findIndex((l) => l.startsWith(`| ${n} |`));
    const answeredAt = lines.findIndex((l) => l === '### Answered');
    if (at < 0) stop(`Open answer ${n} is not in ${rel} §4.`);
    if (at > answeredAt) stop(`Open answer ${n} is already answered.`);
    const cells = lines[at].split(' | ');
    const status = `Answered (${today()}): ${answer.replace(/\|/g, '/')}${rowOfBranch() ? ` (${rowOfBranch()})` : ''}`;
    if (!await ask(`Move open answer ${n} to Answered: "${answer}"?`)) return say('Not moved.');
    const moved = `${cells.slice(0, -1).join(' | ')} | ${status} |`;
    lines.splice(at, 1);
    const tableEnd = (() => { let i = lines.indexOf('### Answered') + 1; while (i < lines.length && !lines[i].startsWith('|')) i++; while (i < lines.length && lines[i].startsWith('|')) i++; return i; })();
    lines.splice(tableEnd, 0, moved);
    let out = t.slice(0, s4) + lines.join('\n') + t.slice(s5);
    out = out.replace(/^last_reviewed: .*$/m, `last_reviewed: ${today()}`);
    write(rel, out);
    say(`Open answer ${n} is answered. Consider a note for the customer: dibon note "…" --for ${id}.`);
  },

  async received() {
    const file = plain[1];
    const from = flag('--from');
    if (!file || !from) stop('Say the file and who sent it: dibon received "<file>" --from roan-capital.');
    if (!fs.existsSync(file)) stop(`No file at ${file}.`);
    const who = party(from);
    const row = rowOfBranch();
    if (!row) stop('Start the work first (dibon start "…"), so the document has its register row.');
    const { sha256, add } = require('./originals');
    const print = sha256(file).slice(0, 12);
    const known = read('docs/document-register.md').split('\n').find((l) => l.includes(`\`${print}\``));
    if (known) stop(`Already kept: ${known.split(' | ')[0].slice(2)} has the same fingerprint. Nothing to do.`);
    const title = flag('--title') || path.basename(file).replace(/\.[^.]+$/, '');
    if (!await ask(`Keep "${path.basename(file)}" from ${who} as an original (moved into clients/${from}/originals/, read-only), and register it?`)) return say('Not kept.');
    const e = add(path.join(ROOT, 'clients', from), file, { from: who, received: flag('--date') || today() });
    const summary = flag('--summary') || 'To confirm: what it is, and why we hold it';
    const dr = registerRow({ party: who, title, summary, kind: 'Original', version: '—', status: 'kept', date: e.received, from: who, where: `\`clients/${from}/originals/\``, print: `\`${e.sha256.slice(0, 12)}\``, rows: row }, from);
    say(`Kept as an original, read-only (fingerprint ${e.sha256.slice(0, 12)}), registered as ${dr}. Nothing from the file goes into git.`);
  },

  async check() {
    const f = checks();
    if (!f.length) return say('All checks pass.');
    explain(f);
    process.exitCode = 1;
  },

  async save() {
    if (onMain()) stop('You are on main, which nobody saves to directly. Start your work first: dibon start "…".');
    let arg = plain[1];
    let only = null;
    if (arg) {
      const abs = path.resolve(arg);
      const inRepo = abs.startsWith(path.resolve(ROOT) + path.sep);
      if (fs.existsSync(abs) && !inRepo) stop(`"${arg}" is a document from outside, not a change to the documentation. Did you mean: dibon received "${arg}" --from <customer>?`);
      if (fs.existsSync(abs) && inRepo) { only = path.relative(ROOT, abs).split(path.sep).join('/'); arg = plain[2]; }
    }
    // FS-866: a row closed or reopened moves to its file first, and the
    // register's files are saved together, so no row is ever left behind.
    const moved = require('./register').tidy(ROOT);
    if (moved.length) say(`The register tidied: ${moved.length} row${moved.length === 1 ? '' : 's'} moved (${moved.join('; ')}).`);
    const reg = (f) => f === 'REVIEW.md' || /^review\//.test(f);
    const changed = unsaved().filter((u) => !only || u.file === only || (reg(only) && reg(u.file)));
    if (!changed.length) stop(only ? `${only} has no unsaved changes.` : 'Nothing to save: no changes since your last save.');
    say('To save:');
    for (const u of changed) say(`  ${u.code.includes('?') || u.code.includes('A') ? 'new     ' : u.code.includes('D') ? 'removed ' : 'changed '} ${u.file}`);
    if (!arg) stop('What did you change? Say it: dibon save "Open answer 26: two administrators".');
    const failures = checks();
    if (failures.length) { explain(failures); process.exitCode = 1; return; }
    const row = rowOfBranch();
    const subject = /^FS-\d{3}/.test(arg) ? arg : `${row || 'FS-???'}: ${arg}`;
    if (!/^FS-\d{3}/.test(subject)) stop('Which register row? Your branch has none: start with dibon start, or begin the description with FS-123.');
    if (!await ask(`Save ${changed.length} file${changed.length === 1 ? '' : 's'} as "${subject}"?`)) return say('Not saved.');
    if (only) git(['add', '--', ...changed.map((u) => u.file)]); else git(['add', '-A']);
    const r = git(['commit', '-q', ...message(subject)], { ok: true, full: true });
    if (r.status !== 0) stop(`Not saved: ${(r.stderr || r.stdout).trim()}`);
    say(`Saved on ${branch()}: "${subject}". When the work is done: dibon share.`);
  },

  async undo() {
    const pushed = hasRemote() && git(['branch', '-r', '--contains', 'HEAD'], { ok: true }) !== '';
    const last = git(['log', '-1', '--format=%s']);
    if (!pushed) {
      if (onMain()) stop('Nothing of yours to undo on main.');
      if (!await ask(`Undo your last save, "${last}"? Your edits stay in the files.`)) return say('Nothing undone.');
      git(['reset', '--soft', 'HEAD~1']);
      say('Your last save is undone; the edits are still in your files.');
    } else {
      if (!await ask(`"${last}" is already shared, so it is not rewritten. Make a correcting change that reverses it?`)) return say('Nothing undone.');
      git(['revert', '--no-edit', 'HEAD']);
      say('A correcting change reverses it. Share it when ready: dibon share.');
    }
  },

  async discard() {
    const file = plain[1];
    if (!file) stop('Say which file: dibon discard docs/customers/roan-capital.md.');
    const rel = path.relative(ROOT, path.resolve(file)).split(path.sep).join('/');
    const u = unsaved().find((x) => x.file === rel);
    if (!u) stop(`${rel} has no unsaved changes.`);
    if (u.code === '??') {
      if (!await ask(`${rel} is new and unsaved. Delete it?`)) return say('Kept.');
      fs.unlinkSync(path.join(ROOT, rel));
      return say(`${rel} deleted.`);
    }
    const diff = git(['diff', '--', rel]).split('\n').filter((l) => /^[-+][^-+]/.test(l));
    say(`These ${diff.length} lines would be lost:`);
    for (const l of diff.slice(0, 15)) say(`  ${l.slice(0, 110)}`);
    if (!await ask(`Discard your unsaved changes to ${rel}?`)) return say('Kept.');
    git(['restore', '--', rel]);
    say(`${rel} is back as it was at your last save.`);
  },

  async share() {
    if (onMain()) stop('You are on main. Start your work on a branch first: dibon start "…".');
    if (unsaved().filter((u) => u.code !== '??').length) stop('You have unsaved edits. Save them first: dibon save "…".');
    const failures = checks();
    if (failures.length) { explain(failures); process.exitCode = 1; return; }
    if (hasRemote()) git(['fetch', '--quiet', 'origin']);
    const base = hasRemote() ? 'origin/main' : 'main';
    const touched = git(['diff', '--name-only', `${base}...HEAD`]).split('\n');
    if (touched.some((f) => /^(tools|code)\//.test(f))) {
      say('tools/ or code/ changed, so the tests run too…');
      const t = spawnSync(process.execPath, ['--test', path.join(ROOT, 'tools', 'check.test.js')], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
      const pass = (t.stdout.match(/^ℹ pass (\d+)/m) || [])[1];
      const failed = +((t.stdout.match(/^ℹ fail (\d+)/m) || [])[1] || 0);
      if (t.status !== 0 || failed) stop(`Not shared: ${failed} test${failed === 1 ? '' : 's'} failing. Run node --test tools/check.test.js to see them.`);
      say(`  ${pass} tests pass.`);
    }
    if (!hasRemote()) stop('There is no shared copy to send to.');
    if (!await ask(`Send ${branch()} for review?`)) return say('Not shared.');
    // Your own branch, so with lease: an update may have rebased it since it
    // was last shared (ways-of-working §6); never main.
    const r = git(['push', '--force-with-lease', '-u', 'origin', branch()], { ok: true, full: true });
    if (r.status !== 0) stop(`Saved on your branch, but not sent: the shared copy refused it (${(r.stderr || '').split('\n')[0]}). Until the move to GitLab, only the owner pushes: tell the owner your branch, ${branch()}, is ready to merge.`);
    const gh = spawnSync('gh', ['pr', 'create', '--draft', '--fill', '--base', 'main'], { cwd: ROOT, encoding: 'utf8' });
    if (gh.status === 0) say(`Sent, as a draft for review: ${gh.stdout.trim()}. When it is finished: dibon ready.`);
    else say(`Sent: ${branch()} is on the shared copy. Open its review there (no review tool here, or one was open already).`);
  },

  async ready() {
    const gh = spawnSync('gh', ['pr', 'ready'], { cwd: ROOT, encoding: 'utf8' });
    if (gh.status === 0) say('Marked ready: the reviewers are asked.');
    else stop('Could not mark it ready here. Open your review on the shared copy and mark it ready there, or tell the owner it is done.');
  },

  async status() {
    const rel = require('./release');
    say(`On ${branch()}${rowOfBranch() ? `, for ${rowOfBranch()}` : ''}. ${rel.line(rel.info(ROOT))}.`);
    const u = unsaved();
    say(u.length ? `Unsaved: ${u.map((x) => x.file).join(', ')}.` : 'Nothing unsaved.');
    if (hasRemote() && !onMain()) {
      const ahead = git(['rev-list', '--count', 'origin/main..HEAD'], { ok: true });
      const shared = git(['branch', '-r', '--list', `origin/${branch()}`], { ok: true });
      say(`${ahead || 0} save${ahead === '1' ? '' : 's'} on this branch; ${shared ? 'shared' : 'not shared yet'}.`);
    }
    const waiting = rel.notes(ROOT).filter((n) => !n.released.includes('docs'));
    say(`${waiting.length} change note${waiting.length === 1 ? '' : 's'} waiting for the next release.`);
  },

  // FS-853: the reader's History section, in a terminal.
  async history() {
    const file = (plain[1] || '').replace(/\\/g, '/').replace(/^\.\//, '');
    if (!file) stop('Say which document: dibon history docs/customers/roan-capital.md.');
    if (!fs.existsSync(path.join(ROOT, file))) stop(`No document at ${file}.`);
    const list = require('./release').histories(ROOT, [file]).get(file) || [];
    if (!list.length) return say(`${file} has no saved changes yet.`);
    let group;
    for (const c of list) {
      const g = c.release ? `Release ${c.release}:` : 'Not yet released:';
      if (g !== group) { say(g); group = g; }
      say(`  ${c.date}  ${c.subject}`);
    }
    if (unsaved().some((u) => u.file === file)) say('And unsaved edits, not in this list until saved.');
  },

  async release() {
    const series = plain[1];
    if (!series) stop('Say what to release: dibon release docs, or dibon release roan-capital.');
    if (!onMain()) stop('Releases are made on main, by the owner.');
    if (!await ask(`Releases are the owner's call (rules, Dibon 12). Release ${series} now?`)) return say('Not released.');
    const { release } = require('./cut');
    const r = release(series, { kind: flag('--kind') });
    say(`Released ${series} ${r.version} (${r.kind}): ${r.done.join(', ')}.`);
    if (!await ask(`Commit "Release ${r.tag}" and tag it?`)) return say(`Not committed: commit, then git tag -a ${r.tag}.`);
    // FS-877: only what git already tracks, which is all a release changes or
    // removes; never a file someone keeps in the folder but out of git.
    git(['add', '-u']);
    git(['commit', '-q', ...message(`Release ${r.tag}`)]);
    git(['tag', '-a', r.tag, '-m', `${series} ${r.version}`]);
    say(`Committed and tagged ${r.tag}. Push the commit and the tag when ready.`);
  },

  async practice() {
    const where = path.join(os.tmpdir(), `dibon-practice-${Date.now()}`);
    fs.mkdirSync(where, { recursive: true });
    const run = (a, cwd) => { const r = spawnSync('git', a, { cwd, encoding: 'utf8' }); if (r.status !== 0) stop(r.stderr.trim()); };
    run(['clone', '--quiet', '--bare', ROOT, path.join(where, 'shared.git')], where);
    run(['clone', '--quiet', path.join(where, 'shared.git'), path.join(where, 'work')], where);
    const me = git(['config', '--get', 'dibon.role'], { ok: true }) || 'Project manager';
    run(['config', 'dibon.role', me], path.join(where, 'work'));
    say(`A practice copy, with its own pretend shared copy: ${path.join(where, 'work')}`);
    say('Nothing you do there reaches the real documents. Go there and try, in order:');
    for (const s of ['dibon status', 'dibon update', 'dibon start "Practice: a meeting"', 'dibon answered roan-capital 25 "No Airtel Money"', 'dibon note "Practice note" --for team', 'dibon save "Practice: answer 25"', 'dibon undo', 'dibon save "Practice: answer 25, again"', 'dibon share', 'dibon help']) say(`  ${s}`);
    say('Delete the folder when you are done.');
  },
};

async function main() {
  const w = plain[0];
  if (!w || !word[w]) {
    if (w) say(`No word "${w}".`);
    return word.help();
  }
  await word[w]();
}

module.exports = { WORDS };

if (require.main === module) {
  main().catch((e) => {
    if (e instanceof Stop) say(e.message);
    else say(`Something went wrong: ${e.message}. Nothing more was done; ask for help.`);
    process.exitCode = 1;
  });
}
