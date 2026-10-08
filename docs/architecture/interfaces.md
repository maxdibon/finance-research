---
id: architecture-interfaces
name: Architecture — the rules every interface follows
kind: architecture
version: 0.1.0
owner: Solution architect
classification: Internal
review_ids: [FS-584, FS-649]
last_reviewed: 2026-10-08
---

# The rules every interface follows

How every service's contract behaves, so a builder does not decide it
again for each one (FS-649). Each rule is already in force somewhere;
this page puts them in one place.

**Contracts**

- **Versioned and written down:** OpenAPI for each service's endpoints,
  AsyncAPI for its events; the version in the path (`/v1`). A breaking
  change is a new version, run beside the old until every consumer has
  moved ([README](README.md) §6, FS-584).
- **One error shape:** problem details (RFC 9457): a type, a title, the
  status, and what a caller can do about it.
- **The transaction's id travels end to end:** every request, event and
  log line about a transaction carries it (recon RO-23).

**Writes and events**

- **Every write is idempotent:** it carries an idempotency key, and a
  repeat returns the first result, never a second effect (rails RL-14).
- **Events through an outbox:** a service saves its change and the event
  in one database transaction, then publishes; an event is never lost
  between the two, and never sent for a change that did not happen.
- **Consumers tolerate repeats and order:** delivery is at least once;
  each consumer records what it has applied.
- **Events are CloudEvents, signed** with the service's identity (RO-23);
  names follow the event bus spec, still to write.

**When something does not answer**

- **Unknown is a state** (rails RL-10): a timeout is neither success nor
  failure until a status query or a statement settles it.
- **Timeouts and retries** with backoff and a limit; a dependency that
  keeps failing is paused, not hammered (RL-15).
- **Money is never retried blind:** a payout is retried only after its
  status is known.

**Who may call**

- **Services by their own identity:** a signed client assertion for
  tokens (access-keycloak §7), mutual TLS between services (SE-05).
- **People's acts at the act:** anything that moves money, approves or
  reveals a person asks for step-up (README §7).
- **No credential in an app, a browser or a USSD gateway** (README §3).
