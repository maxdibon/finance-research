// One mechanism diagram per product. Run directly, it inserts each after its
// product's opening paragraph in the preview page; required, it exports the
// figures so the PDF build draws the same diagrams.
const fs = require('fs');

const defs = (id) => `<defs><marker id="${id}-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" class="mk-money"/></marker><marker id="${id}-c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" class="mk-ctl"/></marker></defs>`;

// A box with a title and an optional second line. kind: box | dibon | funds.
function box(kind, x, y, w, h, title, sub) {
  const cx = x + w / 2;
  const cls = kind === 'dibon' ? ' class="on"' : '';
  const t = sub
    ? `<text x="${cx}" y="${y + h / 2 - 3}" text-anchor="middle"${cls}>${title}</text><text class="s${kind === 'dibon' ? ' on' : ''}" x="${cx}" y="${y + h / 2 + 12}" text-anchor="middle">${sub}</text>`
    : `<text x="${cx}" y="${y + h / 2 + 4}" text-anchor="middle"${cls}>${title}</text>`;
  return `<rect class="${kind}" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>${t}`;
}
const money = (id, x1, y1, x2, y2) => `<line class="money" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#${id}-m)"/>`;
const ctl = (id, x1, y1, x2, y2, both) => `<line class="ctl" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#${id}-c)"${both ? ` marker-start="url(#${id}-c)"` : ''}/>`;
const step = (id, x1, y1, x2, y2) => `<line class="step" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#${id}-c)"/>`;
const label = (x, y, text, anchor = 'middle', small = false) => `<text${small ? ' class="s"' : ''} x="${x}" y="${y}" text-anchor="${anchor}">${text}</text>`;

function figure(id, w, h, aria, body, caption) {
  return `
            <figure class="dg-fig">
              <div class="dg-scroll">
                <svg class="dg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${aria}">${defs(id)}${body}</svg>
              </div>
              <figcaption>${caption}</figcaption>
            </figure>`;
}

const F = {};

F['Kapu Collect'] = figure('co', 640, 214,
  'Money moves from the payer to the bank’s own paybill and into the customer’s account at the bank. Kapu Collect sends the prompt, receives the confirmation and posts the credit, but never holds the funds.',
  box('box', 16, 24, 150, 48, 'Payer', 'mobile wallet') +
  box('box', 245, 24, 150, 48, 'Bank’s paybill', 'the bank’s own shortcode') +
  box('funds', 474, 24, 150, 48, 'Customer account', 'at your bank') +
  box('box', 16, 150, 150, 48, 'Partner app', 'collector · SME · fintech') +
  box('dibon', 245, 150, 150, 48, 'Kapu Collect') +
  money('co', 166, 48, 243, 48) + label(204, 40, 'pays') +
  money('co', 395, 48, 472, 48) + label(433, 40, 'settles') +
  ctl('co', 166, 166, 243, 166) + label(204, 160, 'request') +
  ctl('co', 245, 184, 168, 184) + label(204, 200, 'callback', 'middle', true) +
  ctl('co', 300, 150, 300, 74) + label(294, 116, 'prompt', 'end') +
  ctl('co', 340, 74, 340, 148) + label(346, 116, 'confirms', 'start') +
  ctl('co', 395, 160, 538, 74) + label(470, 136, 'posts credit', 'start'),
  'The deposit goes from the payer to the bank’s own paybill and into the customer’s account. Kapu prompts, confirms and posts; it never holds the money.');

F['Kapu Pay Gateway'] = figure('gw', 640, 214,
  'Payments move from the payer over the rail into the merchant’s own account. The Gateway prompts the payer, receives the confirmation and reconciles each payment for the merchant’s dashboard and ERP.',
  box('box', 16, 24, 150, 48, 'Payer', 'any rail') +
  box('box', 245, 24, 150, 48, 'Rail', 'M-Pesa · Airtel · card') +
  box('funds', 474, 24, 150, 48, 'Merchant’s account', 'its own shortcode') +
  box('box', 16, 150, 150, 48, 'Merchant system', 'app · shop · ERP') +
  box('dibon', 245, 150, 150, 48, 'Kapu Gateway') +
  box('box', 474, 150, 150, 48, 'Dashboard', 'matched · exceptions') +
  money('gw', 166, 48, 243, 48) + label(204, 40, 'pays') +
  money('gw', 395, 48, 472, 48) + label(433, 40, 'settles') +
  ctl('gw', 166, 166, 243, 166) + label(204, 160, 'collect') +
  ctl('gw', 245, 184, 168, 184) + label(204, 200, 'callback', 'middle', true) +
  ctl('gw', 300, 150, 300, 74) + label(294, 116, 'prompt', 'end') +
  ctl('gw', 340, 74, 340, 148) + label(346, 116, 'confirms', 'start') +
  ctl('gw', 395, 174, 472, 174) + label(433, 166, 'reconciled'),
  'One API for every rail. The money settles straight into the merchant’s own account; the Gateway handles the prompt, the confirmation and the reconciliation.');

F['Kapu Escrow'] = figure('es', 640, 224,
  'The buyer pays into an escrow account at the partner bank. Approvers approve through Kapu Escrow, which sends a release instruction that the bank checks against the account’s own mandate before paying the seller.',
  box('box', 16, 24, 150, 48, 'Buyer') +
  box('funds', 245, 24, 150, 48, 'Escrow account', 'at the partner bank') +
  box('box', 474, 24, 150, 48, 'Seller') +
  box('box', 16, 160, 150, 48, 'Approvers', 'buyer · seller · arbiter') +
  box('dibon', 245, 160, 150, 48, 'Kapu Escrow') +
  money('es', 166, 48, 243, 48) + label(204, 40, 'pays in') +
  money('es', 395, 48, 472, 48) + label(433, 40, 'on release') +
  ctl('es', 166, 184, 243, 184) + label(204, 176, 'approve') +
  ctl('es', 320, 160, 320, 74) + label(328, 114, 'release instruction', 'start') +
  label(328, 129, 'checked by the bank against the account’s mandate', 'start', true),
  'The money waits in its own account at the bank. Release needs the agreed approvals, and the bank checks the instruction against the account’s own mandate.');

F['Kapu MFI'] = figure('mf', 640, 166,
  'A loan moves through application, KYC, collateral verification and vetting, then the approval chain, disbursement, repayments split by component, and closure or a linked restructure. KYC and collateral are gates that cannot be skipped.',
  box('box', 15, 20, 130, 44, 'Application', 'digital, attributed') +
  box('box', 175, 20, 130, 44, 'KYC complete', 'gate') +
  box('box', 335, 20, 130, 44, 'Collateral', 'verified · gate') +
  box('box', 495, 20, 130, 44, 'Vetting', 'limit · override flag') +
  box('box', 495, 110, 130, 44, 'Approval chain', 'by product, amount') +
  box('box', 335, 110, 130, 44, 'Disbursed', 'maker-checker') +
  box('box', 175, 110, 130, 44, 'Repayments', 'split by component') +
  box('box', 15, 110, 130, 44, 'Closed', 'or restructured, linked') +
  step('mf', 145, 42, 173, 42) + step('mf', 305, 42, 333, 42) + step('mf', 465, 42, 493, 42) +
  step('mf', 560, 64, 560, 108) +
  step('mf', 495, 132, 467, 132) + step('mf', 335, 132, 307, 132) + step('mf', 175, 132, 147, 132),
  'The loan’s path, with gates that cannot be skipped. Every step is timestamped and attributed; a restructure stays linked to the loan it replaced.');

F['Kapu Sacco'] = figure('sc', 640, 230,
  'The employer remits the check-off total to the Sacco’s account. Kapu Sacco matches the employer’s file against each member’s expected deduction, posts matches to members’ accounts and keeps differences open until explained.',
  box('box', 16, 16, 150, 48, 'Employer', 'payroll deduction') +
  box('funds', 474, 16, 150, 48, 'Sacco’s account', 'at its bank') +
  box('box', 16, 106, 150, 48, 'Employer’s file', 'per employee') +
  box('box', 16, 170, 150, 48, 'Expected', 'per member, this month') +
  box('dibon', 245, 138, 150, 48, 'Check-off match') +
  box('box', 474, 106, 150, 48, 'Members’ accounts', 'posted per member') +
  box('box', 474, 170, 150, 48, 'Differences', 'open until explained') +
  money('sc', 166, 40, 472, 40) + label(319, 32, 'remits the total') +
  ctl('sc', 166, 130, 243, 152) + ctl('sc', 166, 194, 243, 172) +
  ctl('sc', 395, 152, 472, 130) + label(426, 128, 'matched') +
  ctl('sc', 395, 172, 472, 194) + label(426, 206, 'unmatched'),
  'Check-off, reconciled. The employer’s file is matched against what each member should have paid; anything short, extra or unknown stays open until someone explains it.');

F['Reconciliation &amp; Observability'] = figure('rc', 640, 226,
  'Rail and bank events and your ledger feed the match engine. Matches are traced on both sides; breaks go to an exception queue ordered by SLA, and the total of open breaks always equals the suspense balance in your ledger.',
  box('box', 16, 30, 150, 48, 'Rail and bank', 'callbacks · statements') +
  box('box', 16, 150, 150, 48, 'Your ledger', 'core or Fineract') +
  box('dibon', 245, 90, 150, 48, 'Match engine') +
  box('box', 474, 10, 150, 48, 'Matched', 'traced on both sides') +
  box('box', 474, 92, 150, 48, 'Exception queue', 'ordered by SLA') +
  box('box', 474, 172, 150, 48, 'Suspense', 'in your ledger') +
  ctl('rc', 166, 54, 243, 104) + ctl('rc', 166, 174, 243, 124) +
  ctl('rc', 395, 100, 472, 36) +
  ctl('rc', 395, 112, 472, 112) + label(433, 106, 'break') +
  ctl('rc', 474, 130, 397, 130) + label(433, 146, 're-query', 'middle', true) +
  '<line class="step" x1="538" y1="153" x2="560" y2="153"/><line class="step" x1="538" y1="159" x2="560" y2="159"/>' +
  label(566, 160, 'always equal', 'start', true),
  'Both sides feed one engine. Every open break sits in the queue, so the queue and the suspense account always agree: when the queue is empty, the day is closed.');

F['SME Reconciliation'] = figure('sm', 640, 224,
  'Bank, M-Pesa and card statements feed SME Recon, which writes matches into the ERP. An approved bill comes back from the ERP; after the approver re-authenticates, SME Recon instructs the business’s own bank account to pay the supplier.',
  box('box', 16, 24, 150, 48, 'Statements', 'bank · M-Pesa · card') +
  box('dibon', 245, 24, 150, 48, 'SME Recon') +
  box('box', 474, 24, 150, 48, 'Your ERP', 'invoices · bills') +
  box('funds', 245, 160, 150, 48, 'Your bank account', 'or M-Pesa') +
  box('box', 474, 160, 150, 48, 'Supplier') +
  ctl('sm', 166, 48, 243, 48) + label(204, 40, 'feeds') +
  ctl('sm', 395, 40, 472, 40) + label(433, 32, 'matches') +
  ctl('sm', 474, 60, 397, 60) + label(433, 80, 'approved bill', 'middle', true) +
  ctl('sm', 320, 72, 320, 158) + label(328, 112, 'instructs', 'start') +
  label(328, 127, 'after the approver re-authenticates', 'start', true) +
  money('sm', 395, 184, 472, 184) + label(433, 176, 'pays'),
  'Statements in, matches into the ERP. Payments approved in the ERP leave the business’s own account; Dibon only instructs.');

F['Omni-channel banking'] = figure('oc', 640, 210,
  'The mobile app, internet banking and USSD all call one channel API. Before money moves, it runs step-up authentication and a SIM-swap check. It calls the products, which post to and read from your core; balances come back with the time they were fetched.',
  box('box', 16, 12, 130, 44, 'Mobile app') +
  box('box', 16, 82, 130, 44, 'Internet banking') +
  box('box', 16, 152, 130, 44, 'USSD', 'any phone') +
  box('dibon', 220, 82, 160, 44, 'Channel API') +
  box('box', 220, 156, 160, 44, 'Step-up · SIM swap', 'before money moves') +
  box('box', 460, 12, 164, 44, 'Products', 'Collect · MFI · Sacco') +
  box('funds', 460, 152, 164, 44, 'Your core', 'the balances') +
  ctl('oc', 146, 34, 218, 96) + ctl('oc', 146, 104, 218, 104) + ctl('oc', 146, 174, 218, 112) +
  ctl('oc', 300, 126, 300, 154, true) +
  ctl('oc', 380, 96, 458, 40) + label(410, 60, 'calls', 'end') +
  ctl('oc', 542, 56, 542, 150) + label(550, 106, 'posts · reads', 'start') +
  ctl('oc', 460, 172, 382, 118) + label(432, 128, 'fetched-at time', 'middle', true),
  'Three channels, one API, one answer. Anything that moves money passes step-up and a SIM-swap check first.');

module.exports = { F };

if (require.main === module) {
  const file = process.argv[2];
  let html = fs.readFileSync(file, 'utf8');
  let count = 0;
  for (const [title, fig] of Object.entries(F)) {
    const at = html.indexOf(`<h3>${title}</h3>`);
    if (at < 0) throw new Error(`product not found: ${title}`);
    const p = html.indexOf('</p>', at);
    html = html.slice(0, p + 4) + fig + html.slice(p + 4);
    count++;
  }
  fs.writeFileSync(file, html);
  console.log(`inserted ${count} figures`);
}
