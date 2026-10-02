// Generates portfolio pages 6 and 8–21 in the page-7 template (FS-293).
// build.js inserts the output into pages.html. Every word comes from
// docs/marketing/portfolio.md (FS-352); this file holds the layout, the
// icons, the illustrative screens, and the diagrams from figures.js.
'use strict';

const { inline, pair } = require('./copy.js');

const RULE = '<svg class="rule" viewBox="0 0 42 2.4" aria-hidden="true"><rect x="0" y="0" width="9" height="0.8" fill="#280430"/><rect x="0" y="1.6" width="9" height="0.8" fill="#280430"/><rect x="11.5" y="0" width="30.5" height="0.8" fill="#fbb236"/><rect x="11.5" y="1.6" width="30.5" height="0.8" fill="#fbb236"/></svg>';

const CORNERS = [
  '<path d="M18 0 C 24 18, 48 28, 70 26"/>',
  '<path d="M8 0 L 26 16 L 70 16"/><circle cx="54" cy="30" r="5"/>',
  '<path d="M30 0 C 34 14, 52 20, 70 18"/><path d="M48 0 L 70 0"/>',
  '<path d="M70 6 L 44 6 L 30 20 L 0 20"/><path d="M40 40 a 12 12 0 0 1 24 0"/>',
  '<path d="M22 0 C 26 16, 46 24, 70 22"/><path d="M52 34 L 70 34"/>',
];
const corner = (i) => `<svg class="lineart corner" viewBox="0 0 70 40" aria-hidden="true">${CORNERS[i % CORNERS.length]}</svg>`;
const footer = (n) => `<footer class="footer"><span class="brand"><img alt="Dibon" src="__LOGO__"><span class="wordmark">Dibon<br>Consulting</span></span><span class="draft">__DOCREF__</span><span class="num">${n}</span></footer>`;
const spine = (items) => `<ul class="spine">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const facts = (rows) => `<div class="facts">${rows.map(([k, v]) => `<div><b>${k}</b><span>${v}</span></div>`).join('')}</div>`;

// Icons: one line set, 24-unit grid.
const ICON = {
  collect: '<path d="M4 13v6h16v-6"/><path d="M12 3v11M8 10l4 4 4-4"/>',
  gateway: '<path d="M3 6h6l4 6M3 12h10M3 18h6l4-6M13 12h8M18 9l3 3-3 3"/>',
  escrow: '<rect x="5" y="10" width="14" height="10" rx="1.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2.5"/>',
  mfi: '<circle cx="9" cy="9" r="5"/><path d="M9 6.5v5M7.2 8h3a1.2 1.2 0 0 1 0 2.4H7.6M14 15l3 3 4-5"/>',
  sacco: '<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M13.6 14.7c.8-.2 1.6-.2 2.4-.2 2.7 0 4.9 1.5 5.5 4.5"/>',
  recon: '<rect x="3" y="4" width="7.5" height="16" rx="1.2"/><rect x="13.5" y="4" width="7.5" height="16" rx="1.2"/><path d="M5.5 9h3M16 9h3M5.5 12.5h3M16 12.5h3"/>',
  sme: '<path d="M4 20V8l8-4 8 4v12"/><path d="M9 20v-6h6v6M8 10h.01M12 10h.01M16 10h.01"/>',
  omni: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M10.5 18.5h3M3 9v6M21 9v6"/>',
  suite: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  approvals: '<path d="M5 4h14v16H5z"/><path d="m8 9 1.5 1.5L12 8M8 14l1.5 1.5L12 13M14 9.5h2.5M14 14.5h2.5"/>',
  messaging: '<path d="M4 5h16v10H10l-4 4v-4H4z"/><path d="M8 9h8M8 12h5"/>',
  identity: '<circle cx="9" cy="9" r="4"/><path d="M3 20c.8-3.4 3.2-5 6-5s5.2 1.6 6 5M15 11l2 2 4-4"/>',
  route: '<circle cx="5" cy="18" r="2"/><circle cx="19" cy="6" r="2"/><path d="M7 18h6a3 3 0 0 0 0-6h-2a3 3 0 0 1 0-6h6"/>',
  server: '<rect x="4" y="4" width="16" height="6" rx="1.5"/><rect x="4" y="14" width="16" height="6" rx="1.5"/><path d="M8 7h.01M8 17h.01"/>',
  compass: '<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  evidence: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 20 20M7.8 10.6l1.9 1.9 3.4-3.6"/>',
  chat: '<path d="M4 5h16v11H9l-4 3.5V16H4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  layers: '<path d="M12 3 21 8l-9 5-9-5z"/><path d="M3 12.5l9 5 9-5M3 16.5l9 5 9-5"/>',
  bureau: '<path d="M6 3h9l3 3v15H6z"/><path d="M9 16v-3M12 16v-6M15 16v-4"/>',
  rails: '<path d="M3 7h14M13 3l4 4-4 4M21 17H7M11 13l-4 4 4 4"/>',
  insights: '<path d="M4 20V4M4 20h16"/><path d="m7 15 4-4 3 3 5-6"/>',
  bank: '<path d="M3 9.5 12 4l9 5.5M4.5 9.5h15M6 10v7M10 10v7M14 10v7M18 10v7M3.5 20h17"/>',
  shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  cube: '<path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z"/><path d="M12 12 20 7.5M12 12v9M12 12 4 7.5"/>',
  key: '<circle cx="8" cy="12" r="3.5"/><path d="M11.5 12H21M17 12v3M20 12v2"/>',
  log: '<path d="M6 3h12v18H6z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
  pulse: '<path d="M3 12h4l2.5-6 4 12 2.5-6H21"/>',
  people: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-3.6 3.8-5.5 7-5.5s6 1.9 7 5.5"/>',
  store: '<path d="M4 9h16l-1.5-5h-13zM5 9v11h14V9M9 20v-6h6v6"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M10.5 18.5h3"/>',
  plug: '<path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0zM12 16v5"/>',
};
const ico = (k, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;

// Illustrative screens. Generic: no operator's or vendor's interface is imitated (FS-277).
const T = (x, y, s, w, c, txt, a = '') => `<text x="${x}" y="${y}" font-size="${s}" font-weight="${w}" fill="${c}"${a ? ` text-anchor="${a}"` : ''}>${txt}</text>`;
const C = { au: '#280430', pl: '#460d4d', am: '#fbb236', amt: '#8a5a00', cr: '#fff2eb', pa: '#fffaf6', mu: '#5e4c66', li: '#ead9dc', mn: '#0e7f5a', mnb: '#e2f3ec', wh: '#ffffff' };

function phone(title, inner, aria) {
  return `<svg class="illo" viewBox="0 0 62 112" style="width:100%;height:auto" role="img" aria-label="${aria}">
<rect x="2" y="2" width="58" height="108" rx="7" fill="${C.wh}" stroke="${C.pl}" stroke-width="1.2"/><rect x="24" y="5" width="14" height="2.2" rx="1.1" fill="${C.li}"/>
<rect x="6" y="10" width="50" height="92" rx="2" fill="${C.pa}"/><rect x="6" y="10" width="50" height="12" rx="2" fill="${C.au}"/><rect x="6" y="18" width="50" height="4" fill="${C.au}"/>
${T(10, 17.6, 3.4, 700, C.cr, title)}<circle cx="51" cy="16" r="1.6" fill="${C.am}"/>${inner}</svg>`;
}
function screen(title, inner, aria) {
  return `<svg class="illo" viewBox="0 0 100 70" style="width:100%;height:auto" role="img" aria-label="${aria}">
<rect x="1" y="1" width="98" height="68" rx="3" fill="${C.wh}" stroke="${C.pl}" stroke-width="1"/><rect x="1" y="1" width="98" height="9" rx="3" fill="${C.au}"/><rect x="1" y="6" width="98" height="4" fill="${C.au}"/>
<circle cx="6" cy="5.5" r="1.1" fill="${C.am}"/><circle cx="9.5" cy="5.5" r="1.1" fill="#6e2c79"/>${T(14, 6.7, 3, 700, C.cr, title)}${inner}</svg>`;
}
const tick = (x, y, col = C.am) => `<circle cx="${x}" cy="${y}" r="1.9" fill="none" stroke="${col}" stroke-width="0.6"/><path d="M${x - 0.9} ${y}l.7.7 1.2-1.4" fill="none" stroke="${col === C.am ? C.amt : col}" stroke-width="0.55"/>`;
const pill = (x, y, w, txt, fill, fg) => `<rect x="${x}" y="${y - 2.6}" width="${w}" height="3.6" rx="1.8" fill="${fill}"/>${T(x + w / 2, y - 0.1, 2.2, 700, fg, txt, 'middle')}`;

const MOCK = {
  // The partner app on page 7, the first product page.
  collect: `<svg class="illo" viewBox="0 0 62 112" style="width:100%;height:auto" role="img" aria-label="Illustrative partner app screen: a deposit of KES 2,500 received, confirmed by the rail and posted to the bank, with the bank's reference and the time it was fetched.">
  <rect x="2" y="2" width="58" height="108" rx="7" fill="#ffffff" stroke="#460d4d" stroke-width="1.2"/>
  <rect x="24" y="5" width="14" height="2.2" rx="1.1" fill="#ead9dc"/>
  <rect x="6" y="10" width="50" height="92" rx="2" fill="#fffaf6"/>
  <rect x="6" y="10" width="50" height="12" rx="2" fill="#280430"/>
  <rect x="6" y="18" width="50" height="4" fill="#280430"/>
  <text x="10" y="17.6" font-size="3.4" font-weight="700" fill="#fff2eb">Partner app</text>
  <circle cx="51" cy="16" r="1.6" fill="#fbb236"/>
  <text x="10" y="30" font-size="3.4" font-weight="700" fill="#280430">Deposit received</text>
  <text x="10" y="39" font-size="6.6" font-weight="800" fill="#280430">KES 2,500</text>
  <text x="10" y="44" font-size="2.7" fill="#5e4c66">to account ending 2002</text>
  <g font-size="2.9" font-weight="600" fill="#280430">
    <circle cx="12" cy="51.2" r="2.2" fill="none" stroke="#fbb236" stroke-width="0.7"/><path d="M11 51.2l.8.8 1.4-1.6" fill="none" stroke="#8a5a00" stroke-width="0.6"/><text x="16" y="52.2">Prompt sent</text>
    <circle cx="12" cy="58.2" r="2.2" fill="none" stroke="#fbb236" stroke-width="0.7"/><path d="M11 58.2l.8.8 1.4-1.6" fill="none" stroke="#8a5a00" stroke-width="0.6"/><text x="16" y="59.2">Confirmed by the rail</text>
    <circle cx="12" cy="65.2" r="2.2" fill="none" stroke="#0e7f5a" stroke-width="0.7"/><path d="M11 65.2l.8.8 1.4-1.6" fill="none" stroke="#0e7f5a" stroke-width="0.6"/><text x="16" y="66.2">Posted at the bank</text>
  </g>
  <path d="M12 53.6v2.4M12 60.6v2.4" stroke="#cdb6bf" stroke-width="0.5"/>
  <rect x="9" y="71" width="44" height="12" rx="1.5" fill="#ffffff" stroke="#ead9dc" stroke-width="0.5"/>
  <text x="11" y="75.5" font-size="2.5" fill="#5e4c66">Bank reference</text>
  <text x="11" y="80.2" font-size="3.1" font-weight="700" fill="#280430">KP-2026-004318</text>
  <text x="10" y="89" font-size="2.5" fill="#5e4c66">Balance fetched 10:42 today</text>
  <rect x="10" y="92" width="42" height="7" rx="3.5" fill="#fbb236"/>
  <text x="31" y="96.6" font-size="3" font-weight="700" fill="#280430" text-anchor="middle">View statement</text>
</svg>`,
  core: screen('Member account',
    `${T(5, 16, 2.4, 700, C.mu, 'SAVINGS · ACCOUNT ENDING 2002')}${T(5, 24, 5.6, 800, C.au, 'KES 145,000')}${T(5, 28.5, 2.3, 400, C.mu, 'interest accrued KES 412 · posts month-end')}
${T(60, 16, 2.4, 700, C.mu, 'LOAN 0396')}${T(60, 24, 4.2, 800, C.au, 'KES 61,300')}${T(60, 28.5, 2.3, 400, C.mu, 'next due 05 Nov')}
${[['M-Pesa deposit', '+ 2,500', C.mn], ['Loan repayment: principal', '- 1,850', C.au], ['Loan repayment: interest', '- 600', C.au], ['Fee', '- 50', C.au]].map(([a, b, c], i) => `<line x1="5" y1="${33.5 + i * 8}" x2="95" y2="${33.5 + i * 8}" stroke="${C.li}" stroke-width="0.4"/>${T(5, 38.5 + i * 8, 2.7, 600, C.au, a)}${T(95, 38.5 + i * 8, 2.8, 700, c, b, 'end')}`).join('')}
${T(5, 67, 2.3, 400, C.mu, 'Posted 10:42 today · general ledger balanced')}`,
    'Illustrative member account: savings with interest accrued, a loan with its next due date, and postings split by component.'),
  gateway: screen('Merchant dashboard',
    `${[['Received', '412', C.au], ['Matched', '398', C.mn], ['Pending', '9', C.amt], ['Exceptions', '5', C.pl]].map(([k, v, c], i) => `<rect x="${5 + i * 22.75}" y="14" width="20.25" height="15" rx="1.5" fill="${C.pa}" stroke="${C.li}" stroke-width="0.4"/>${T(7.5 + i * 22.75, 19.5, 2.3, 600, C.mu, k)}${T(7.5 + i * 22.75, 26.5, 5.2, 800, c, v)}`).join('')}
${[['INV-2041', 'M-Pesa', 'matched', C.mnb, C.mn], ['INV-2042', 'M-Pesa', 'matched', C.mnb, C.mn], ['INV-2043', 'Airtel Money', 'pending', '#fff1d1', C.amt], ['INV-2044', 'T-Kash', 'matched', C.mnb, C.mn]].map(([a, b, s, f, g], i) => `<line x1="5" y1="${37 + i * 8}" x2="95" y2="${37 + i * 8}" stroke="${C.li}" stroke-width="0.4"/>${T(6, 42 + i * 8, 2.8, 700, C.au, a)}${T(30, 42 + i * 8, 2.8, 400, C.mu, b)}${pill(76, 42.4 + i * 8, 16, s, f, g)}`).join('')}`,
    'Illustrative merchant dashboard: 412 payments received, 398 matched, 9 pending confirmation and 5 in exception, with invoices matched by rail.'),
  escrow: phone('Kapu Escrow',
    `${T(10, 30, 3.2, 700, C.au, 'Plot sale agreement')}${T(10, 38.5, 6, 800, C.au, 'KES 1.2M')}${T(10, 43.5, 2.6, 400, C.mu, 'held at the partner bank')}
${tick(12, 51.5)}${T(16, 52.5, 2.8, 600, C.au, 'Agreement signed')}${tick(12, 58.5)}${T(16, 59.5, 2.8, 600, C.au, 'Buyer funded escrow')}${tick(12, 65.5)}${T(16, 66.5, 2.8, 600, C.au, 'Title search complete')}
<circle cx="12" cy="72.5" r="1.9" fill="none" stroke="${C.pl}" stroke-width="0.6" stroke-dasharray="1 0.8"/>${T(16, 73.5, 2.8, 600, C.au, 'Transfer registered')}${T(16, 77.3, 2.4, 400, C.mu, 'Approvals 2 of 3')}
<rect x="10" y="92" width="42" height="7" rx="3.5" fill="${C.am}"/>${T(31, 96.6, 3, 700, C.au, 'Approve release', 'middle')}`,
    'Illustrative escrow screen: KES 1.2 million held at the partner bank, three milestones complete, release awaiting the third approval.'),
  mfi: screen('Loan pipeline',
    `${['Application', 'Vetting', 'Approval', 'Disbursed'].map((h, i) => `${T(5 + i * 24, 16, 2.6, 700, C.mu, h.toUpperCase())}<line x1="${5 + i * 24}" y1="18" x2="${26 + i * 24}" y2="18" stroke="${C.am}" stroke-width="0.6"/>`).join('')}
${[[0, 22, 'Loan 0418', 'KES 60,000'], [0, 33, 'Loan 0419', 'KES 120,000'], [1, 22, 'Loan 0415', 'KES 90,000'], [2, 22, 'Loan 0411', 'KES 100,000', 'Override'], [2, 36, 'Loan 0412', 'KES 45,000'], [3, 22, 'Loan 0407', 'KES 75,000']].map(([c, y, a, b, f]) => `<rect x="${5 + c * 24}" y="${y}" width="21" height="${f ? 12 : 9}" rx="1.2" fill="${C.pa}" stroke="${C.li}" stroke-width="0.4"/>${T(7 + c * 24, y + 3.8, 2.4, 700, C.au, a)}${T(7 + c * 24, y + 7, 2.3, 400, C.mu, b)}${f ? pill(7 + c * 24, y + 10.6, 13, f, '#fff1d1', C.amt) : ''}`).join('')}`,
    'Illustrative loan pipeline: applications moving through vetting, approval and disbursement, with an above-limit approval flagged as an override.'),
  sacco: phone('Member statement',
    `${T(10, 30, 3.2, 700, C.au, 'Shares')}${T(52, 30, 3.2, 700, C.au, 'KES 20,000', 'end')}<line x1="10" y1="32.5" x2="52" y2="32.5" stroke="${C.li}" stroke-width="0.4"/>
${T(10, 38, 3.2, 700, C.au, 'Deposits')}${T(52, 38, 3.2, 700, C.au, 'KES 145,000', 'end')}<line x1="10" y1="40.5" x2="52" y2="40.5" stroke="${C.li}" stroke-width="0.4"/>
<rect x="9" y="44" width="44" height="13" rx="1.5" fill="${C.wh}" stroke="${C.am}" stroke-width="0.5"/>${T(11, 48.6, 2.5, 600, C.amt, 'LOAN LIMIT · 3× DEPOSITS')}${T(11, 54.6, 5, 800, C.au, 'KES 435,000')}
${T(10, 63, 3, 700, C.au, 'Guarantees you have given')}${T(10, 68, 2.7, 400, C.mu, 'Member 1042 · KES 40,000')}${T(10, 72.5, 2.7, 400, C.mu, 'Member 2217 · KES 20,000')}
${T(10, 80, 2.5, 400, C.mu, 'Contribution received by check-off')}${T(10, 84, 2.5, 400, C.mu, 'Balances fetched 07:30 today')}
<rect x="10" y="92" width="42" height="7" rx="3.5" fill="${C.am}"/>${T(31, 96.6, 3, 700, C.au, 'Apply for a loan', 'middle')}`,
    'Illustrative member statement: shares, deposits, a loan limit of three times deposits, and the guarantees the member has given.'),
  recon: screen('Exception queue',
    `${T(5, 16, 2.4, 700, C.mu, 'BREAK')}${T(30, 16, 2.4, 700, C.mu, 'RAIL')}${T(55, 16, 2.4, 700, C.mu, 'KES')}${T(76, 16, 2.4, 700, C.mu, 'SLA')}
${[['EXC-4471', 'B2C payout', '850,000', 'breached', C.am, C.au], ['EXC-4483', 'Till cash', '142,000', '35 min', '#fff1d1', C.amt], ['EXC-4490', 'Bank EFT', '62,500', '1 h 50', '#f3e6f4', C.pl], ['EXC-4492', 'Card', '4,120', '4 h 10', '#f3e6f4', C.pl], ['EXC-4495', 'Airtel', '1,950', '5 h 30', '#f3e6f4', C.pl]].map(([a, b, c, s, f, g], i) => `<line x1="5" y1="${18.5 + i * 9}" x2="95" y2="${18.5 + i * 9}" stroke="${C.li}" stroke-width="0.4"/>${T(5, 24 + i * 9, 2.8, 700, C.au, a)}${T(30, 24 + i * 9, 2.7, 400, C.mu, b)}${T(55, 24 + i * 9, 2.8, 700, C.au, c)}${pill(76, 24.3 + i * 9, 17, s, f, g)}`).join('')}
${T(5, 66, 2.4, 600, C.mn, 'Open breaks = suspense balance')}`,
    'Illustrative exception queue: five open breaks ordered by time left on their SLA, the first already breached.'),
  sme: screen('Bank reconciliation',
    `${T(5, 16, 2.4, 700, C.mu, 'STATEMENT')}${T(54, 16, 2.4, 700, C.mu, 'IN YOUR ERP')}
<rect x="5" y="19" width="40" height="13" rx="1.2" fill="${C.pa}" stroke="${C.li}" stroke-width="0.4"/>${T(7, 23.5, 2.6, 700, C.au, 'M-Pesa · 07xx xxx 123')}${T(7, 28.5, 3.4, 800, C.au, 'KES 25,000')}
<rect x="54" y="19" width="41" height="13" rx="1.2" fill="${C.mnb}" stroke="${C.mn}" stroke-width="0.5"/>${T(56, 23.5, 2.6, 700, C.au, 'INV/2026/0412')}${T(56, 28.5, 3.4, 800, C.au, 'KES 25,000')}
<path d="M45 25.5 H 54" stroke="${C.mn}" stroke-width="1"/>${T(49.5, 23.6, 2, 700, C.mn, 'matched', 'middle')}
<rect x="5" y="36" width="40" height="13" rx="1.2" fill="${C.pa}" stroke="${C.li}" stroke-width="0.4"/>${T(7, 40.5, 2.6, 700, C.au, 'Bank charge')}${T(7, 45.5, 3.4, 800, C.au, 'KES 120')}
<rect x="54" y="36" width="41" height="13" rx="1.2" fill="${C.pa}" stroke="${C.li}" stroke-width="0.4"/>${T(56, 40.5, 2.6, 700, C.au, 'Expense: bank charges')}${T(56, 45.5, 2.6, 400, C.mu, 'posted automatically')}<path d="M45 42.5 H 54" stroke="${C.mu}" stroke-width="0.6" stroke-dasharray="1 0.8"/>
<rect x="5" y="53" width="40" height="13" rx="1.2" fill="#fff1d1" stroke="${C.am}" stroke-width="0.5"/>${T(7, 57.5, 2.6, 700, C.au, 'Airtel · no reference')}${T(7, 62.5, 3.4, 800, C.au, 'KES 3,200')}
${T(54, 59.5, 2.7, 700, C.amt, 'Unapplied, and visible')}${T(54, 63.5, 2.4, 400, C.mu, 'waiting for the accountant')}`,
    'Illustrative bank reconciliation: an M-Pesa payment matched to an invoice, a bank charge posted as an expense, and an unreferenced payment left unapplied and visible.'),
  omni: `<svg class="illo" viewBox="0 0 100 70" style="width:100%;height:auto" role="img" aria-label="Illustrative app and USSD screens: the same balance on a smartphone app and on a feature phone's USSD menu.">
<rect x="4" y="1" width="36" height="68" rx="5" fill="${C.wh}" stroke="${C.pl}" stroke-width="1"/><rect x="7" y="6" width="30" height="58" rx="1.5" fill="${C.pa}"/><rect x="7" y="6" width="30" height="8" rx="1.5" fill="${C.au}"/><rect x="7" y="11" width="30" height="3" fill="${C.au}"/>${T(9.5, 11.3, 2.4, 700, C.cr, 'Your Sacco')}
${T(9.5, 20, 2.2, 600, C.mu, 'DEPOSITS')}${T(9.5, 25.5, 4.4, 800, C.au, 'KES 145,000')}${T(9.5, 29.5, 1.9, 400, C.mu, 'fetched 07:30 today')}
<rect x="9.5" y="33" width="25" height="5" rx="2.5" fill="${C.am}"/>${T(22, 36.3, 2.1, 700, C.au, 'Contribute', 'middle')}<rect x="9.5" y="40.5" width="25" height="5" rx="2.5" fill="none" stroke="${C.pl}" stroke-width="0.4"/>${T(22, 43.8, 2.1, 700, C.pl, 'Loan status', 'middle')}
<rect x="56" y="6" width="34" height="60" rx="6" fill="${C.wh}" stroke="${C.pl}" stroke-width="1"/><rect x="60" y="11" width="26" height="26" rx="1" fill="#e9e4d4"/>
${T(62, 16, 2.3, 700, C.au, 'Your Sacco')}${T(62, 20.5, 2.2, 400, C.au, '1. Balance')}${T(62, 24.3, 2.2, 400, C.au, '2. Mini-statement')}${T(62, 28.1, 2.2, 400, C.au, '3. Contribute')}${T(62, 31.9, 2.2, 400, C.au, '4. Loan status')}
${[0, 1, 2].map((r) => [0, 1, 2].map((c) => `<rect x="${61 + c * 8.5}" y="${41 + r * 7}" width="6.5" height="4.6" rx="1.2" fill="none" stroke="${C.pl}" stroke-width="0.4"/>`).join('')).join('')}
${T(48, 36, 2.2, 700, C.amt, 'same', 'middle')}${T(48, 39, 2.2, 700, C.amt, 'answer', 'middle')}<path d="M41 33 H 55" stroke="${C.am}" stroke-width="0.6" stroke-dasharray="1.2 1"/></svg>`,
};

// Reconciliation: the day as a chevron band (deck p. 11 pattern).
const reconBand = (steps) => `<ol class="chev">${steps.map((s) => `<li>${inline(s)}</li>`).join('')}</ol>`;

// MFI: an illustrative portfolio dashboard, full width under the columns.
const MFI_DASH = `<figure style="margin:4mm auto 0;width:86%">
<svg class="illo" viewBox="0 0 184 40" style="width:100%;height:auto" role="img" aria-label="Illustrative portfolio dashboard: PAR30, arrears by age bucket, the override cohort shown separately, and income split by component.">
<rect x="0.5" y="0.5" width="183" height="39" rx="2" fill="${C.wh}" stroke="${C.li}" stroke-width="0.5"/>
${T(5, 8, 2.6, 700, C.mu, 'PAR30')}${T(5, 18, 8, 800, C.au, '4.8%')}${T(5, 23, 2.4, 400, C.mu, 'portfolio at risk, 30+ days')}
${T(48, 8, 2.6, 700, C.mu, 'ARREARS BY AGE')}${[['1–30', 16], ['31–60', 9], ['61–90', 5], ['90+', 3]].map(([k, v], i) => `<rect x="${48 + i * 11}" y="${30 - v}" width="7" height="${v}" fill="${i === 3 ? C.am : C.pl}"/>${T(51.5 + i * 11, 34, 2.1, 400, C.mu, k, 'middle')}`).join('')}
${T(100, 8, 2.6, 700, C.mu, 'OVERRIDE COHORT')}${T(100, 17, 5.5, 800, C.amt, '12 loans')}${T(100, 22, 2.4, 400, C.mu, 'approved above their limit')}
${T(140, 8, 2.6, 700, C.mu, 'INCOME BY COMPONENT')}<rect x="140" y="13" width="30" height="5" fill="${C.pl}"/><rect x="161" y="13" width="5" height="5" fill="${C.am}"/><rect x="166" y="13" width="4" height="5" fill="${C.mn}"/>
${T(140, 23, 2.2, 400, C.mu, 'interest · fees · insurance')}${T(5, 35, 2.2, 400, C.mu, 'Illustrative figures')}
</svg><figcaption class="mock-cap">Illustrative screen: the portfolio dashboard</figcaption></figure>`;

// Which product uses which platform service, read from each module's
// declared dependencies (docs/modules/*.md), not typed.
function serviceMatrix(builtOn, caption, short) {
  const fs = require('fs');
  const path = require('path');
  const dir = path.join(__dirname, '..', '..', 'docs', 'modules');
  const deps = {};
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md') && !x.startsWith('_'))) {
    const t = fs.readFileSync(path.join(dir, f), 'utf8');
    const m = t.match(/^depends_on:\s*\[([^\]]*)\]/m);
    deps[f.replace('.md', '')] = m ? m[1].split(',').map((s) => s.trim()).filter(Boolean) : [];
  }
  // Ids are the modules; names are the copy's keys, shown by their short names.
  const products = [['collect', 'Kapu Collect'], ['gateway', 'Kapu Pay Gateway'], ['escrow', 'Kapu Escrow'], ['core', 'Kapu Core'], ['mfi', 'Kapu MFI'], ['sacco', 'Kapu Sacco'], ['recon-observability', 'Reconciliation & Observability'], ['sme-recon', 'SME Reconciliation'], ['omni-channel', 'Omni-channel banking'], ['business-suite', 'Business suite']];
  const services = [['mandates', 'Approvals and mandates'], ['messaging', 'Messaging'], [['access', 'identity'], 'Identity and access'], ['crb', 'Credit bureaus'], ['rails', 'Payment rails'], ['insights', 'Insights']];
  // A tick when the product depends on the service, or, for insights alone,
  // when insights reads from the product (FS-301). Other services that
  // depend on a product (CRB on recon) do not make the product use them.
  const uses = (p, s) => (Array.isArray(s) ? s : [s]).some((x) => (deps[p] || []).includes(x) || (x === 'insights' && (deps.insights || []).includes(p)));
  const rows = products.map(([id, n]) => `<div class="bo"><b>${short(n)}</b><em>${builtOn}</em><span>${services.filter(([s]) => uses(id, s)).map(([, sn]) => `<i>${short(sn)}</i>`).join('')}</span></div>`).join('');
  return `<div class="builton">${rows}</div><p class="mx-cap">${caption}</p>`;
}

// Business suite: how Odoo sits among the products (diagram language FS-253).
const BS_FLOW = `<figure class="dg-fig" style="margin-top:6mm"><svg class="dg" viewBox="0 0 640 170" role="img" aria-label="Statements feed SME Recon, which writes matches into Odoo; the core posts daily totals into Odoo's ledger; Odoo signs in through Dibon's access service and sends campaigns through Dibon's messaging.">
<defs><marker id="bs-c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" class="mk-ctl"/></marker></defs>
<rect class="box" x="16" y="16" width="150" height="48" rx="6"/><text x="91" y="37" text-anchor="middle">Statements</text><text class="s" x="91" y="52" text-anchor="middle">bank · M-Pesa · card</text>
<rect class="dibon" x="245" y="16" width="150" height="48" rx="6"/><text class="on" x="320" y="44" text-anchor="middle">SME Recon</text>
<rect class="box" x="16" y="106" width="150" height="48" rx="6"/><text x="91" y="127" text-anchor="middle">Your core</text><text class="s" x="91" y="142" text-anchor="middle">customer accounts stay here</text>
<rect class="box" x="474" y="56" width="150" height="58" rx="6"/><text x="549" y="80" text-anchor="middle">Odoo</text><text class="s" x="549" y="96" text-anchor="middle">hosted on OLP, in Kenya</text>
<rect class="dibon" x="245" y="116" width="150" height="38" rx="6"/><text class="on" x="320" y="139" text-anchor="middle">Access · Messaging</text>
<line class="ctl" x1="166" y1="40" x2="243" y2="40" marker-end="url(#bs-c)"/>
<line class="ctl" x1="395" y1="40" x2="472" y2="72" marker-end="url(#bs-c)"/><text x="440" y="46" text-anchor="middle">matches</text>
<line class="ctl" x1="166" y1="124" x2="472" y2="92" marker-end="url(#bs-c)"/><text class="s" x="205" y="104" text-anchor="middle">daily totals to the general ledger</text>
<line class="ctl" x1="395" y1="135" x2="472" y2="106" marker-end="url(#bs-c)" marker-start="url(#bs-c)"/><text class="s" x="430" y="140" text-anchor="start">sign-on, campaigns</text>
</svg><figcaption>Odoo is the back office around your core, never a second core.</figcaption></figure>`;

// Integrations: the hub. Everything connects through the platform once.
const HUB = `<figure class="dg-fig" style="margin-top:12mm"><svg class="dg" viewBox="0 0 640 200" role="img" aria-label="Mobile money, banks and cards connect once to Dibon's platform, which connects to your core, your ERP, the credit bureaus and identity registers.">
<defs><marker id="hb-c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" class="mk-ctl"/></marker></defs>
${[['Mobile money', 20, ''], ['Banks', 80, 'coming soon'], ['Cards', 140, 'coming soon']].map(([n, y, s]) => `<rect class="box" x="16" y="${y}" width="140" height="40" rx="6"${s ? ' stroke-dasharray="5 4"' : ''}/><text x="86" y="${y + (s ? 20 : 24)}" text-anchor="middle">${n}</text>${s ? `<text class="s" x="86" y="${y + 33}" text-anchor="middle">${s}</text>` : ''}<line class="ctl" x1="156" y1="${y + 20}" x2="278" y2="100" marker-end="url(#hb-c)"/>`).join('')}
<polygon points="320,56 358.5,78 358.5,122 320,144 281.5,122 281.5,78" fill="#460d4d" stroke="#fbb236" stroke-width="2.5"/><svg x="298" y="76.9" width="44" height="46.2" viewBox="0 0 416 436"><image href="__LOGO__" width="1000" height="436"/></svg><text class="s" x="320" y="164" text-anchor="middle">one connection each</text>
${[['Your core', 10, ''], ['Your ERP', 60, ''], ['Credit bureaus', 110, 'coming soon'], ['Identity registers', 160, '']].map(([n, y, s]) => `<rect class="box" x="484" y="${y}" width="140" height="34" rx="6"${s ? ' stroke-dasharray="5 4"' : ''}/><text x="554" y="${y + (s ? 16 : 21)}" text-anchor="middle">${n}</text>${s ? `<text class="s" x="554" y="${y + 28}" text-anchor="middle">${s}</text>` : ''}<line class="ctl" x1="362" y1="100" x2="482" y2="${y + 17}" marker-end="url(#hb-c)" marker-start="url(#hb-c)"/>`).join('')}
</svg><figcaption>Each rail and each system is integrated once, in the platform, and every product uses it.</figcaption></figure>`;

const WORD = { 8: 'Eight', 9: 'Nine', 10: 'Ten', 11: 'Eleven' };
let N_PRODUCTS = 0; // set in rest(): page 7 (Collect) plus the generated product pages

// Kapu Core: the money stays in the institution's accounts; the core is the ledger.
const CORE_FIG = `<figure class="dg-fig"><svg class="dg" viewBox="0 0 640 196" role="img" aria-label="Members pay over mobile money or bank into the institution's own accounts. Kapu Core records the ledger and the Kapu products run on top of it; recon ties the ledger to the rails every day.">
<defs><marker id="kc-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" class="mk-money"/></marker><marker id="kc-c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" class="mk-ctl"/></marker></defs>
<rect class="box" x="16" y="20" width="150" height="48" rx="6"/><text x="91" y="41" text-anchor="middle">Members pay</text><text class="s" x="91" y="56" text-anchor="middle">M-Pesa · Airtel · T-Kash</text>
<rect class="funds" x="245" y="20" width="150" height="48" rx="6"/><text x="320" y="41" text-anchor="middle">Your own accounts</text><text class="s" x="320" y="56" text-anchor="middle">paybills · bank accounts</text>
<line class="money" x1="166" y1="44" x2="243" y2="44" marker-end="url(#kc-m)"/><text x="204" y="36" text-anchor="middle">pays</text>
<rect class="dibon" x="245" y="128" width="150" height="48" rx="6"/><text class="on" x="320" y="149" text-anchor="middle">Kapu Core</text><text class="s on" x="320" y="164" text-anchor="middle">the ledger</text>
<line class="ctl" x1="320" y1="68" x2="320" y2="126" marker-end="url(#kc-c)"/><text x="328" y="101" text-anchor="start">posts, in real time</text>
<rect class="box" x="474" y="104" width="150" height="34" rx="6"/><text x="549" y="125" text-anchor="middle">Kapu MFI · Sacco</text>
<rect class="box" x="474" y="148" width="150" height="34" rx="6"/><text x="549" y="169" text-anchor="middle">Apps · USSD</text>
<line class="ctl" x1="395" y1="146" x2="472" y2="121" marker-end="url(#kc-c)" marker-start="url(#kc-c)"/><line class="ctl" x1="395" y1="160" x2="472" y2="165" marker-end="url(#kc-c)" marker-start="url(#kc-c)"/>
<rect class="box" x="16" y="128" width="150" height="48" rx="6"/><text x="91" y="149" text-anchor="middle">Recon</text><text class="s" x="91" y="164" text-anchor="middle">ledger against the rails, daily</text>
<line class="ctl" x1="243" y1="152" x2="168" y2="152" marker-end="url(#kc-c)"/>
</svg><figcaption>The green line never touches the core: the money stays in your accounts, and Kapu Core is the ledger that records it.</figcaption></figure>`;

// A diagram's caption is copy: it comes from the Markdown (FS-352).
const withCaption = (fig, text) => fig.replace(/<figcaption>[\s\S]*?<\/figcaption>/, () => `<figcaption>${inline(text)}</figcaption>`);

function productPage(p) {
  const fig = p.fig;
  const mock = `<figure style="margin:0">${p.mock}<figcaption class="mock-cap">${p.screenLabel}</figcaption></figure>`;
  const cols = p.flip
    ? `<div class="prod-cols" style="grid-template-columns: ${p.mockW || '44mm'} 1fr">${mock}${spine(p.spine)}</div>`
    : `<div class="prod-cols" style="grid-template-columns: 1fr ${p.mockW || '44mm'}">${spine(p.spine)}${mock}</div>`;
  return `
<section class="page" id="p${p.n}">
  ${corner(p.corner === undefined ? +p.n : p.corner)}
  <div class="content">
    <p class="eyebrow">${p.eyebrow}</p>
    ${RULE}
    <h2>${p.name}</h2>
    <p class="prod-tag">${p.tag}</p>
    <p class="lede" style="font-size:11pt;margin-bottom:5mm">${p.lede}</p>
    ${p.before || ''}<div style="width:${p.figW || '100%'};margin:0 auto">${fig}</div>${p.after || ''}
    ${cols}
    ${p.extra || ''}
    ${facts(p.facts)}
  </div>
  ${footer(p.n)}
</section>`;
}

function rest({ F, copy }) {
  // Every word comes from docs/marketing/portfolio.md (FS-352). This file
  // holds only the layout: which diagram, screen and icon goes where.
  const L = copy.section('Labels');
  const products = copy.section('Products');
  const prods = products.items(9);
  const LAYOUT = {
    'Kapu Collect': { fig: F['Kapu Collect'], mock: MOCK.collect, figW: '88%', corner: 4 },
    'Kapu Pay Gateway': { fig: F['Kapu Pay Gateway'], mock: MOCK.gateway, mockW: '90mm', flip: true },
    'Kapu Escrow': { fig: F['Kapu Escrow'], mock: MOCK.escrow, figW: '86%' },
    'Kapu Core': { fig: CORE_FIG, mock: MOCK.core, mockW: '88mm', flip: true },
    'Kapu MFI': { fig: F['Kapu MFI'], mock: MOCK.mfi, mockW: '66mm', flip: true, dash: true, figW: '84%' },
    'Kapu Sacco': { fig: F['Kapu Sacco'], mock: MOCK.sacco, figW: '88%' },
    'Reconciliation & Observability': { fig: F['Reconciliation &amp; Observability'], mock: MOCK.recon, mockW: '80mm', flip: true, steps: true },
    'SME Reconciliation': { fig: F['SME Reconciliation'], mock: MOCK.sme, mockW: '92mm' },
    'Omni-channel banking': { fig: F['Omni-channel banking'], mock: MOCK.omni, mockW: '100mm', flip: true },
  };
  N_PRODUCTS = prods.length;
  const eyebrow = (i) => inline(products.get('Eyebrow').replace('{n}', i).replace('{total}', N_PRODUCTS));
  const P = prods.map((it, i) => {
    const lay = LAYOUT[it.title];
    if (!lay) throw new Error(`portfolio copy: product "${it.title}" has no layout; add its diagram and screen to pages-rest.js`);
    return {
      n: String(7 + i).padStart(2, '0'), eyebrow: eyebrow(i + 1), corner: lay.corner, screenLabel: inline(L.get('Illustrative screen')),
      name: inline(it.title), tag: inline(it.get('Tagline')), lede: inline(it.get('Intro')),
      fig: withCaption(lay.fig, it.get('Diagram caption')), mock: lay.mock, mockW: lay.mockW, flip: lay.flip, figW: lay.figW,
      before: lay.steps ? reconBand(it.get('Steps')) : undefined,
      extra: lay.dash ? MFI_DASH.replace('Illustrative screen: the portfolio dashboard', () => inline(it.get('Dashboard caption'))) : undefined,
      spine: it.get('Features').map((s) => inline(s)),
      facts: it.get('Facts').map(pair).map(([a, b]) => [inline(a), inline(b)]),
    };
  });

  const tile = (k, name, line) => `<div class="gtile">${ico(k)}<b>${name}</b><span>${line}</span></div>`;
  const TILE_ICON = { 'Kapu Collect': 'collect', 'Kapu Pay Gateway': 'gateway', 'Kapu Escrow': 'escrow', 'Kapu Core': 'cube', 'Kapu MFI': 'mfi',
    'Kapu Sacco': 'sacco', 'Reconciliation & Observability': 'recon', 'SME Reconciliation': 'sme', 'Omni-channel banking': 'omni' };
  const G = copy.section('The portfolio at a glance');
  const page06 = `
<section class="page glance-page" id="p06">
  <svg class="art" viewBox="0 0 210 297" preserveAspectRatio="none" aria-hidden="true"><path d="M150 0 C 160 40, 190 55, 210 56"/><path class="faint" d="M0 262 C 50 248, 90 270, 140 256"/></svg>
  <div class="content">
    <p class="eyebrow" style="color:#fbb236">${inline(G.get('Eyebrow'))}</p>
    ${RULE.replace(/#280430/g, '#fff2eb')}
    <h2 style="color:#fff2eb">${inline(G.get('Heading').replace('{Products}', WORD[N_PRODUCTS]))}</h2>
    <div class="gtiles">
${prods.map((it) => `      ${tile(TILE_ICON[it.title], inline(it.title), inline(it.get('Tagline')))}`).join('\n')}
    </div>
    <div class="gsuite">${ico('suite')}<div><b>${inline(G.get('Suite title'))}</b><span>${inline(G.get('Suite text'))}</span></div></div>
    <div class="gbase"><b>${ico('layers', 'bi')}${inline(G.get('Platform title'))}</b><span>${inline(G.get('Platform'))}</span></div>
  </div>
  ${footer('06')}
</section>`;

  // One icon per card, in page order; the count is a layout decision.
  const byOrder = (icons, rows, what) => {
    if (rows.length !== icons.length) throw new Error(`portfolio copy: ${what} has ${rows.length} entries; the layout has room for ${icons.length}. Change the design first, then the copy`);
    return rows.map((r, i) => [icons[i], ...r]);
  };
  const PS = copy.section('Platform services');
  const SHORT = new Map([...PS.get('Short product names'), ...PS.get('Short service names')].map(pair));
  const shortName = (full) => { if (!SHORT.has(full)) throw new Error(`portfolio copy: no short name for "${full}" under Platform services`); return inline(SHORT.get(full)); };
  const svc = byOrder(['approvals', 'messaging', 'identity', 'bureau', 'rails', 'insights'],
    PS.get('Services').map(pair).map(([a, b]) => [inline(a), inline(b)]), 'Platform services › Services');

  const BS = copy.section('Business suite');
  const apps = byOrder(['insights', 'messaging', 'log', 'people', 'approvals', 'store', 'pulse', 'rails'],
    BS.get('Apps').map(pair).map(([a, b]) => [inline(a), inline(b)]), 'Business suite › Apps');
  const page15 = `
<section class="page" id="p16">
  ${corner(2)}
  <div class="content">
    <p class="eyebrow">${inline(BS.get('Eyebrow'))}</p>
    ${RULE}
    <h2>${inline(BS.get('Heading'))}</h2>
    <p class="prod-tag">${inline(BS.get('Tagline'))}</p>
    <p class="lede" style="font-size:11pt">${inline(BS.get('Intro'))}</p>
    <div class="mods">
      ${apps.map(([k, a, b]) => `<div class="mod">${ico(k)}<b>${a}</b><span>${b}</span></div>`).join('')}
    </div>
    ${withCaption(BS_FLOW, BS.get('Diagram caption'))}
    <div class="band" style="margin-top:5mm"><p>${ico('server', 'bi')}${inline(BS.get('Band'))}</p><small>${inline(BS.get('Band text'))}</small></div>
  </div>
  ${footer('16')}
</section>`;

  const page16 = `
<section class="page" id="p17">
  ${corner(3)}
  <div class="content">
    <p class="eyebrow">${inline(PS.get('Eyebrow'))}</p>
    ${RULE}
    <h2>${inline(PS.get('Heading'))}</h2>
    <p class="lede">${inline(PS.get('Intro'))}</p>
    <div class="stiles">${svc.map(([k, a, b]) => `<div class="stile">${ico(k)}<b>${a}</b><span>${b}</span></div>`).join('')}</div>
    ${serviceMatrix(inline(L.get('Built on')), inline(PS.get('Built-on caption')), shortName)}
  </div>
  ${footer('17')}
</section>`;

  const WHO = copy.section('Who it is for');
  const WHO_END = copy.section('Who it is for, closing');
  const seg = byOrder(['bank', 'bank', 'sacco', 'people', 'mfi', 'mfi', 'cube', 'rails', 'gateway', 'store'],
    WHO.items().map((it) => [inline(it.title), inline(it.get('Start with')), inline(it.get('Add'))]), 'Who it is for');
  const page17 = `
<section class="page" id="p18">
  ${corner(4)}
  <div class="content">
    <p class="eyebrow">${inline(WHO.get('Eyebrow'))}</p>
    ${RULE}
    <h2>${inline(WHO.get('Heading'))}</h2>
    <div class="segs">${seg.map(([k, a, b, c]) => `<div class="seg"><span class="disc">${ico(k)}</span><div><b>${a}</b><p><em>${inline(L.get('Start with'))}</em> ${b}</p><p><em>${inline(L.get('Add'))}</em> ${c}</p></div></div>`).join('')}</div>
    <div class="band" style="margin-top:8mm"><p>${ico('compass', 'bi')}${inline(WHO_END.get('Band'))}</p><small>${inline(WHO_END.get('Band text'))}</small></div>
  </div>
  ${footer('18')}
</section>`;

  // Integrated chips first, then coming-soon chips, which are marked "~".
  const INT = copy.section('Integrations');
  const list = (it, key) => (it.has(key) ? it.get(key).split('; ').map((s) => s.trim()) : []);
  const integ = byOrder(['phone', 'bank', 'key', 'suite', 'identity', 'bureau', 'cube'],
    INT.items().map((it) => [inline(it.title), [...list(it, 'Integrated').map((s) => inline(s)), ...list(it, 'Coming soon').map((s) => `~${inline(s)}`)], inline(it.get('Note'))]), 'Integrations');
  const page18 = `
<section class="page" id="p19">
  ${corner(0)}
  <div class="content">
    <p class="eyebrow">${inline(INT.get('Eyebrow'))}</p>
    ${RULE}
    <h2>${inline(INT.get('Heading'))}</h2>
    <p class="chip-key"><span class="k-on">${inline(L.get('Integrated'))}</span><span class="k-next">${inline(L.get('Coming soon'))}</span></p>
    <div class="integ">${integ.map(([k, a, chips, note]) => `<div class="int"><span class="disc">${ico(k)}</span><div><b>${a}</b><div class="chips">${chips.map((c) => (c.startsWith('~') ? `<span class="next">${c.slice(1)}</span>` : `<span>${c}</span>`)).join('')}</div><small>${note}</small></div></div>`).join('')}</div>
    ${withCaption(HUB, copy.section('Integrations, closing').get('Diagram caption'))}
  </div>
  ${footer('19')}
</section>`;

  // Deployment options: where it runs, by who runs it (FS-359), and the
  // three levels of Dibon-managed service (FS-360).
  const DO = copy.section('Deployment options');
  const DL = copy.section('Deployment options, managed levels');
  const cells = DO.items(4);
  const cols = DO.get('Columns');
  const rowsDo = byOrder(['store', 'server'], DO.get('Rows').map((r) => [inline(r)]), 'Deployment options › Rows');
  if (cols.length !== 2) throw new Error('portfolio copy: Deployment options › Columns needs two entries');
  const cell = (it, dibon) => `<div class="dc${dibon ? ' dib' : ''}"><b>${inline(it.title)}</b><span>${inline(it.get('Text'))}</span></div>`;
  const pageDeploy = `
<section class="page" id="p20a">
  ${corner(1)}
  <div class="content">
    <p class="eyebrow">${inline(DO.get('Eyebrow'))}</p>
    ${RULE}
    <h2>${inline(DO.get('Heading'))}</h2>
    <p class="lede">${inline(DO.get('Intro'))}</p>
    <div class="dgrid"><div></div>${cols.map((c) => `<div class="dh">${inline(c)}</div>`).join('')}${rowsDo.map(([k, r], i) => `<div class="dr">${ico(k)}<span>${r}</span></div>${cell(cells[i * 2], false)}${cell(cells[i * 2 + 1], true)}`).join('')}</div>
    <p class="sub-h">${inline(DL.get('Heading'))}</p>
    <div class="levels">${DL.items(3).map((it) => `<div class="lvl"><b>${inline(it.title)}</b><em>${inline(DL.get('Takes on label'))}</em><span>${inline(it.get('Takes on'))}</span><em>${inline(DL.get('Keeps label'))}</em><span>${inline(it.get('Keeps'))}</span></div>`).join('')}</div>
    <div class="band" style="margin-top:8mm"><p>${ico('route', 'bi')}${inline(copy.section('Deployment options, closing').get('Band'))}</p><small>${inline(copy.section('Deployment options, closing').get('Band text'))}</small></div>
  </div>
  ${footer('20')}
</section>`;

  // Support tiers and severities (FS-360). Times are agreed per contract.
  const SV = copy.section('Support and service levels');
  const SS = copy.section('Support and service levels, severities');
  const SC = copy.section('Support and service levels, changes');
  const pageService = `
<section class="page svc" id="p20b">
  ${corner(3)}
  <div class="content">
    <p class="eyebrow">${inline(SV.get('Eyebrow'))}</p>
    ${RULE}
    <h2>${inline(SV.get('Heading'))}</h2>
    <p class="lede">${inline(SV.get('Intro'))}</p>
    <div class="levels">${SV.items(3).map((it) => `<div class="lvl"><b>${inline(it.title)}</b>${['Hours', 'How', 'Reviews'].map((k) => `<em>${k}</em><span>${inline(it.get(k))}</span>`).join('')}</div>`).join('')}</div>
    <div class="svc-two">
      <div><p class="sub-h">${inline(SS.get('Heading'))}</p><ul class="sevs">${SS.get('Severities').map(pair).map(([s, d]) => `<li><b>${inline(s)}</b><span>${inline(d)}</span></li>`).join('')}</ul></div>
      <div><p class="sub-h">Every tier includes</p>${spine(SS.get('Every tier includes').map((s) => inline(s)))}</div>
    </div>
    <p class="sub-h">${inline(SC.get('Heading'))}</p>
    <ul class="spine chg">${SC.get('Changes').map((s) => `<li>${inline(s)}</li>`).join('')}</ul>
    <p class="runs">${inline(SC.get('Basis'))}</p>
  </div>
  ${footer('20')}
</section>`;

  // Security and standards (FS-361): standards are "designed in line with",
  // never certified; only what Dibon holds is listed as held.
  const SE = copy.section('Security and standards');
  const sec = byOrder(['key', 'log', 'shield', 'cube', 'evidence', 'server', 'pulse', 'identity'],
    SE.get('Rows').map(pair).map(([x, y]) => [inline(x), inline(y)]), 'Security and standards › Rows');
  const chipRow = (label, list) => `<div class="strip"><em>${inline(label)}</em><div class="chips">${list.split('; ').map((s) => `<span>${inline(s.trim())}</span>`).join('')}</div></div>`;
  const pageSecurity = `
<section class="page" id="p20c">
  ${corner(1)}
  <div class="content">
    <p class="eyebrow">${inline(SE.get('Eyebrow'))}</p>
    ${RULE}
    <h2>${inline(SE.get('Heading'))}</h2>
    <ul class="secg">${sec.map(([k, x, y]) => `<li><span class="disc">${ico(k)}</span><div><b>${x}</b><span>${y}</span></div></li>`).join('')}</ul>
    ${chipRow(SE.get('Standards label'), SE.get('Standards'))}
    ${chipRow(SE.get('Registered label'), SE.get('Registered'))}
    <p class="runs">${inline(SE.get('How it runs'))}</p>
    <div class="band" style="margin-top:5mm"><p>${ico('evidence', 'bi')}${inline(SE.get('Band'))}</p><small>${inline(SE.get('Band text'))}</small></div>
  </div>
  ${footer('20')}
</section>`;

  const WW = copy.section('Working with us');
  const CT = copy.section('Working with us, contact');
  const steps = WW.items(4).map((it) => [inline(it.title), inline(it.get('What happens')), inline(it.get('You get'))]);
  const page20 = `
<section class="page" id="p21">
  ${corner(2)}
  <div class="content">
    <p class="eyebrow">${inline(WW.get('Eyebrow'))}</p>
    ${RULE}
    <h2>${inline(WW.get('Heading'))}</h2>
    <ol class="tline">${steps.map(([a, b, c], i) => `<li><span class="dot">${i + 1}</span><div><b>${a}</b><p>${b}</p><p class="get"><em>${inline(L.get('You get'))}</em> ${c}</p></div></li>`).join('')}</ol>
    <div class="contact-card">
      <div><b>${ico('chat', 'bi')}${inline(CT.get('Title'))}</b><p>${inline(CT.get('Text'))}</p></div>
      <dl><dt>Email</dt><dd>${inline(CT.get('Email'))}</dd><dt>Phone</dt><dd>${inline(CT.get('Phone'))}</dd></dl>
    </div>
  </div>
  ${footer('21')}
</section>`;

  // N_PRODUCTS is set above, before page 6 is assembled.
  return { counts: { products: N_PRODUCTS, services: svc.length }, word: WORD[N_PRODUCTS], page06: page06.split('${N_PRODUCTS}').join(String(N_PRODUCTS)), pages0721: P.map(productPage).join('\n') + page15 + page16 + page17 + page18 + pageDeploy + pageService + pageSecurity + page20 };
}

const CSS = `
/* Chevron band */
.chev { list-style: none; padding: 0; margin: 0 0 5mm; display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 0.6mm; }
.chev li { background: var(--aubergine); color: var(--cream); font: 700 7.5pt/1 var(--display); letter-spacing: 0.08em; text-transform: uppercase; text-align: center; padding: 3.2mm 3mm 3.2mm 4.5mm; clip-path: polygon(0 0, calc(100% - 3mm) 0, 100% 50%, calc(100% - 3mm) 100%, 0 100%, 3mm 50%); }
.chev li:first-child { clip-path: polygon(0 0, calc(100% - 3mm) 0, 100% 50%, calc(100% - 3mm) 100%, 0 100%); padding-left: 3mm; }
.chev li:nth-child(even) { background: var(--plum); }
.chev li:last-child { background: var(--amber); color: var(--aubergine); }
/* Built on: one row per product (FS-332) */
.builton { margin-top: 4mm; }
.bo { display: grid; grid-template-columns: 30mm 15mm 1fr; align-items: center; padding: 0.9mm 0; border-bottom: 0.3mm solid var(--line); }
.bo b { font: 700 9pt/1.2 var(--display); color: var(--aubergine); }
.bo em { font: 400 8.5pt/1 var(--body); font-style: normal; color: var(--muted); }
.bo span { display: flex; flex-wrap: wrap; gap: 1.2mm; }
.bo i { font: 600 7.4pt/1 var(--display); font-style: normal; color: var(--aubergine); background: var(--cream); border: 0.3mm solid #f1d9a6; border-radius: 3mm; padding: 1.1mm 2.3mm; }
.mx-cap { font-size: 8.5pt; color: var(--muted); margin-top: 2mm; }
.tline .get { margin-top: 2mm; background: #fff4dc; border-left: 0.9mm solid var(--amber); border-radius: 1mm; padding: 2mm 3mm; color: var(--aubergine); font: 600 9.5pt/1.4 var(--display); max-width: 130mm; }
.tline .get em { font-style: normal; font: 700 6.8pt/1 var(--display); letter-spacing: 0.12em; text-transform: uppercase; color: var(--aubergine); background: #fff; border: 0.3mm solid var(--amber); border-radius: 3mm; padding: 1.1mm 2.2mm; margin-right: 2mm; display: inline-block; }
/* Page 6 · at a glance */
.glance-page { background: var(--aubergine); color: var(--cream); }
.glance-page .art { position: absolute; inset: 0; width: 100%; height: 100%; }
.glance-page .art path { fill: none; stroke: var(--amber); stroke-width: 1.3; }
.glance-page .art .faint { stroke: #6b2a75; }
.gtiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3.5mm; margin-top: 3mm; }
.gtile { display: grid; grid-template-columns: 1fr; row-gap: 1.6mm; align-content: start; background: #3a0d44; border-radius: 1.5mm; padding: 5.5mm 4.5mm; }
.gtile .ico { width: 8mm; height: 8mm; stroke: var(--amber); margin-bottom: 1mm; }
.gtile b { font: 700 11pt/1.2 var(--display); color: var(--cream); }
.gtile span { font-size: 9.5pt; color: #e7d3df; }
.gsuite { margin-top: 4mm; display: grid; grid-template-columns: 9mm 1fr; gap: 3.5mm; align-items: center; border: 0.4mm solid var(--amber); border-radius: 1.5mm; padding: 4mm; }
.gsuite .ico { width: 8mm; height: 8mm; stroke: var(--amber); }
.gsuite b { display: block; font: 700 11pt/1.2 var(--display); color: var(--amber); margin-bottom: 1mm; }
.gsuite span { font-size: 9.5pt; color: #e7d3df; }
.gbase { margin-top: 4mm; background: var(--amber); color: var(--aubergine); border-radius: 1.5mm; padding: 3.5mm 4mm; }
.bi { width: 6mm; height: 6mm; vertical-align: -1.3mm; margin-right: 2.6mm; fill: none; stroke: var(--amber); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.bi.money { stroke: #3fc495; }
.gbase b .bi { width: 4.4mm; height: 4.4mm; vertical-align: -1mm; margin-right: 1.8mm; stroke: var(--aubergine); }
.gbase b { display: block; font: 800 7.5pt/1 var(--display); letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 1.5mm; }
.gbase span { font: 600 10pt/1.4 var(--display); }
/* Page 15 · business suite */
.mods { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; margin-top: 2mm; }
.mod { background: #fff; border: 0.3mm solid var(--line); border-top: 1mm solid var(--amber); border-radius: 1mm; padding: 3mm; display: grid; gap: 1.1mm; align-content: start; }
.mod .ico { width: 8mm; height: 8mm; }
.mod b { font: 700 10pt/1.2 var(--display); color: var(--aubergine); }
.mod span { font-size: 8.8pt; line-height: 1.35; color: var(--muted); }
/* Page 16 · platform services */
.stiles { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4mm; }
.stile { background: var(--aubergine); color: var(--cream); border-radius: 1.5mm; padding: 3mm 3.6mm; display: grid; grid-template-columns: 9mm 1fr; column-gap: 3.5mm; row-gap: 1mm; }
.stile .ico { grid-row: span 2; width: 8mm; height: 8mm; stroke: var(--amber); }
.stile b { font: 700 11pt/1.2 var(--display); }
.stile span { font-size: 9.5pt; color: #e7d3df; }
/* Page 17 · segments */
.segs { display: grid; grid-template-columns: 1fr 1fr; column-gap: 8mm; row-gap: 2.2mm; margin-top: 1mm; }
.seg { display: grid; grid-template-columns: 11mm 1fr; gap: 3.5mm; align-items: start; padding: 2mm 0 4mm; border-bottom: 0.3mm solid var(--line); }
.seg:nth-last-child(-n+2) { border-bottom: 0; }
.seg .disc, .int .disc { width: 12mm; height: 12mm; border-radius: 50%; border: 0.6mm solid var(--amber); display: grid; place-items: center; }
.seg .disc svg, .int .disc svg { width: 6.5mm; height: 6.5mm; }
.seg .disc { width: 10.5mm; height: 10.5mm; }
.seg b { display: block; font: 700 11pt/1.25 var(--display); color: var(--aubergine); margin-bottom: 1mm; }
.seg p { margin: 0; font-size: 10pt; }
.seg em { font-style: normal; font: 700 7pt/1 var(--display); letter-spacing: 0.14em; text-transform: uppercase; color: var(--amber-text); margin-right: 1.5mm; }
/* Page 18 · integrations */
.integ { display: grid; grid-template-columns: repeat(2, 1fr); gap: 9mm 7mm; margin-top: 4mm; }
.int { display: grid; grid-template-columns: 13mm 1fr; gap: 4mm; align-items: start; }
.int b { display: block; font: 700 11pt/1.25 var(--display); color: var(--aubergine); margin-bottom: 1.5mm; }
.chips { display: flex; flex-wrap: wrap; gap: 1.5mm; margin-bottom: 1.5mm; }
.chips span { font: 600 8.5pt/1 var(--display); color: var(--aubergine); background: #fff; border: 0.3mm solid var(--amber); border-radius: 3mm; padding: 1.3mm 2.4mm; }
.int small { font-size: 9pt; color: var(--muted); }
.chips span.next { border-style: dashed; border-color: #cdb6bf; color: var(--muted); background: transparent; }
.chip-key { display: flex; gap: 3mm; margin: -2mm 0 4mm; }
.chip-key span { font: 600 8pt/1 var(--display); border-radius: 3mm; padding: 1.3mm 2.4mm; }
.chip-key .k-on { border: 0.3mm solid var(--amber); background: #fff; color: var(--aubergine); }
.chip-key .k-next { border: 0.3mm dashed #cdb6bf; color: var(--muted); }
/* Page 19 · rows */
/* Deployment options, support tiers, security (FS-359 to FS-361) */
.dgrid { display: grid; grid-template-columns: 30mm 1fr 1fr; gap: 3mm; margin-top: 1mm; }
.dgrid .dh { font: 700 7.5pt/1 var(--display); letter-spacing: 0.16em; text-transform: uppercase; color: var(--amber-text); align-self: end; padding-bottom: 1.5mm; border-bottom: 0.8mm solid var(--amber); }
.dgrid .dr { font: 700 10.5pt/1.25 var(--display); color: var(--aubergine); display: flex; align-items: center; gap: 2.2mm; }
.dgrid .dr .ico { width: 7mm; height: 7mm; flex: none; }
.dc { background: #fff; border: 0.3mm solid var(--line); border-radius: 1.2mm; padding: 3.2mm 3.6mm; display: grid; gap: 1.2mm; align-content: start; }
.dc b { font: 700 10pt/1.2 var(--display); color: var(--aubergine); }
.dc span { font-size: 9.3pt; line-height: 1.4; }
.dc.dib { background: var(--aubergine); border-color: var(--aubergine); }
.dc.dib b { color: var(--amber); }
.dc.dib span { color: #f0dfe6; }
.sub-h { font: 700 12pt/1.2 var(--display); color: var(--aubergine); margin: 7mm 0 3mm; }
.levels { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; }
.lvl { background: #fff; border: 0.3mm solid var(--line); border-top: 1mm solid var(--amber); border-radius: 1mm; padding: 3mm 3.4mm; display: grid; gap: 1.2mm; align-content: start; }
.lvl b { font: 700 11pt/1.2 var(--display); color: var(--aubergine); }
.lvl em { font-style: normal; font: 700 6.8pt/1 var(--display); letter-spacing: 0.14em; text-transform: uppercase; color: var(--amber-text); margin-top: 1.2mm; }
.lvl span { font-size: 9.2pt; line-height: 1.4; }
.svc .lvl { padding: 4mm 4mm 4.5mm; gap: 1.6mm; }
.svc .lvl span { font-size: 9.8pt; }
.svc .sevs li { padding: 3.2mm 0; font-size: 10pt; }
.svc .sub-h { margin-top: 10mm; }
.chg { grid-template-columns: 1fr 1fr; column-gap: 8mm; row-gap: 2.6mm; }
.chg::before { display: none; }
.svc-two { display: grid; grid-template-columns: 1.25fr 1fr; gap: 8mm; }
.sevs { list-style: none; margin: 0; padding: 0; display: grid; }
.sevs li { display: grid; grid-template-columns: 25mm 1fr; gap: 3mm; align-items: center; padding: 2mm 0; border-bottom: 0.3mm solid var(--line); font-size: 9.5pt; }
.sevs b { justify-self: start; font: 700 7.4pt/1 var(--display); color: var(--aubergine); background: var(--cream); border: 0.3mm solid #f1d9a6; border-radius: 3mm; padding: 1.3mm 2.3mm; }
.secg { list-style: none; margin: 1mm 0 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; column-gap: 7mm; }
.secg li { display: grid; grid-template-columns: 10mm 1fr; gap: 3mm; align-items: start; padding: 2.6mm 0; border-bottom: 0.3mm solid var(--line); }
.secg .disc { width: 10mm; height: 10mm; border-radius: 50%; border: 0.5mm solid var(--amber); display: grid; place-items: center; }
.secg .disc svg { width: 5.5mm; height: 5.5mm; }
.secg b { display: block; font: 700 9.8pt/1.25 var(--display); color: var(--amber-text); margin-bottom: 0.8mm; }
.secg span { font-size: 9pt; line-height: 1.4; }
.strip { display: grid; grid-template-columns: 30mm 1fr; gap: 3mm; align-items: start; margin-top: 4mm; }
.strip em { font-style: normal; font: 700 7pt/1.3 var(--display); letter-spacing: 0.14em; text-transform: uppercase; color: var(--amber-text); padding-top: 1.4mm; }
.runs { font-size: 8.5pt; color: var(--muted); margin: 4mm 0 0; }
.rows { list-style: none; padding: 0; margin: 2mm 0 0; display: grid; }
.rows li { display: grid; grid-template-columns: 15mm 1fr; gap: 5mm; align-items: center; padding: 6mm 0; position: relative; }
.rows li::after { content: ""; position: absolute; bottom: 0; left: 0; width: 72%; border-bottom: 0.6mm solid var(--aubergine); }
.rows li:nth-child(even) { grid-template-columns: 1fr 15mm; }
.rows li:nth-child(even) .disc { order: 2; }
.rows li:nth-child(even)::after { left: auto; right: 0; }
.rows li:last-child::after { display: none; }
.rows .disc { width: 14mm; height: 14mm; border-radius: 50%; border: 0.6mm solid var(--amber); display: grid; place-items: center; }
.rows .disc svg { width: 7.5mm; height: 7.5mm; }
.rows b { display: block; font: 700 11pt/1.25 var(--display); color: var(--amber-text); margin-bottom: 1mm; }
.rows span { font-size: 10pt; }
/* Page 20 · timeline and contact */
.tline { list-style: none; padding: 0; margin: 4mm 0 0; display: grid; gap: 0; position: relative; }
.tline::before { content: ""; position: absolute; left: 5.5mm; top: 4mm; bottom: 26mm; border-left: 0.6mm dashed var(--amber); }
.tline li { display: grid; grid-template-columns: 11mm 1fr; gap: 5mm; padding-bottom: 13mm; position: relative; }
.tline .dot { width: 11mm; height: 11mm; border-radius: 50%; background: var(--aubergine); color: var(--cream); display: grid; place-items: center; font: 800 11pt/1 var(--display); position: relative; z-index: 1; }
.tline li:last-child .dot { background: var(--amber); color: var(--aubergine); }
.tline b { display: block; font: 700 12pt/1.25 var(--display); color: var(--aubergine); margin: 1.5mm 0 1mm; }
.tline p { margin: 0; color: var(--muted); max-width: 120mm; }
.contact-card { margin-top: 8mm; background: var(--aubergine); color: var(--cream); border-radius: 1.5mm; padding: 6mm 7mm; display: grid; grid-template-columns: 1fr auto; gap: 8mm; align-items: center; position: relative; overflow: hidden; }
.contact-card::after { content: ""; position: absolute; right: 0; top: 0; bottom: 0; width: 14mm; background: var(--amber); clip-path: polygon(55% 0, 100% 0, 100% 100%, 0 100%); }
.contact-card b { font: 800 16pt/1.1 var(--display); color: var(--cream); }
.contact-card p { margin: 2mm 0 0; color: #f0dfe6; font-size: 10pt; }
.contact-card dl { display: grid; grid-template-columns: auto auto; gap: 1.5mm 4mm; margin: 0 14mm 0 0; font: 600 10.5pt/1.3 var(--display); }
.contact-card dt { color: var(--amber); font-size: 7pt; letter-spacing: 0.14em; text-transform: uppercase; align-self: center; }
.contact-card dd { margin: 0; }
`;

module.exports = { rest, CSS };
