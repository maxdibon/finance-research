---
id: training-key-holder
name: Training — the recovery key holder's manual
kind: manual
version: 0.1.0
owner: Chief Technology and Innovation Officer
classification: Internal
review_ids: [FS-656, FS-657, FS-658, FS-659, FS-660]
last_reviewed: 2026-10-08
---

# The recovery key holder's manual

**For:** the five people who together can open Dibon's backups. Any
three of you can; no one or two of you can. How it works and why is in
docs/architecture/deployment.md §4.

## What you hold

- **Two hardware security keys:** one you carry, one kept apart as your
  backup. Each has a PIN only you know.
- **Your share,** in two forms: a file in the share register, and a QR
  code in a sealed, numbered envelope in the safe. Both are encrypted to
  your keys: without one of them and its PIN, they are useless to anyone,
  you included.

**Never:** tell anyone your PIN; photograph or copy your share once
decrypted; enter your share anywhere but the recovery vault; take part
in an unlock you started.

## The setup ceremony (once, and when holders change)

1. Bring both hardware keys. The CTIO and two witnesses are present.
2. Set a PIN on each key; the setup confirms both work.
3. Your share is created encrypted to your keys; you never see it in
   clear.
4. Check your envelope's number against the custody log, and sign it.
5. Practise one decrypt on the offline laptop, so the first time is not
   an emergency.

## Unlocking: what you will be asked to do

**Before:** you receive a request naming the institution, the backup, the
reason and the two approvals. Check that both approvers are named and
neither is you. If anything looks wrong, refuse and call the CTIO.

1. **Join:** at the clean station in person (tests and drills), or through
   the bastion on the recorded call (an incident).
2. **Decrypt your share on your own machine:** insert your key, enter
   your PIN, touch it when it blinks. Your share appears on your screen.
3. **Enter it into the vault** when the operator asks. You see "1 of 3",
   "2 of 3", "unsealed".
4. **Close the window.** The share is not saved anywhere.
5. **Sign the record:** your name, the time, where you were.

You are done. The operator restores, checks, then seals the vault.

## If something goes wrong

| What | Do |
|---|---|
| You lost your key | Use your backup key, and report the loss the same day so it is revoked |
| You forgot your PIN | Three wrong PINs lock the key. Use your backup key; the lost one is reset at the next ceremony |
| You are asked to unlock without a request and two approvals | Refuse. Report it as a security incident (docs/service-management/incident-management.md) |
| Our systems are down | Take your envelope from the safe, your hardware key, and the offline laptop. The steps are the same |
| You are leaving Dibon, or leaving the role | Tell the CTIO: the vault is re-keyed before you go, and your share stops working |

## The drill

Every quarter, the restore test is a drill: a real request, real
approvals, three of you in person, a restore into a clean environment,
destroyed afterwards. We time it, from the request to "unsealed", and
note what was slow or confusing. The manual changes after each drill.
