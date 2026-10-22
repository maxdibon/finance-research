# The Azure sandbox for the MVP day

OpenTofu that sets up the sandbox on public Azure for building the MVP
(FS-929, FS-932). It moves to the `platform` repository once that exists
(the GitHub spec, §6).

**Made-up data only.** Public Azure has no region in Kenya, so nothing
real goes here: no customer, borrower or staff data (rules, 1; privacy,
"In Kenya"). Production stays in Kenya, on Liquid's Azure Stack.

## What it makes

| Resource group | For | Who may change it |
|---|---|---|
| `rg-sbx-` and a handle, one each | Deploying a component alone: Fineract, Keycloak, Odoo, a Daraja test, a configuration check | Its owner |
| `rg-ws-` and a workstream: platform, core, money, back-office, delivery | Trying components together within a workstream | The workstream's members |
| `rg-mvp` | The MVP environment, where everything is stitched together through Flux | The platform workstream |
| `rg-tfstate` | The state of the modules that build the MVP, in a storage account signed into with Entra, versioned | The platform workstream |

Everyone reads every group. Every resource is tagged with its owner and
workstream, so the cost view says who runs what. A policy keeps all of it
in one region (South Africa North by default). Every group has a budget,
alerting at 50%, 80% and 100%.

## Before running it

- An Azure subscription for the sandbox, and each person in its Entra
  directory (a guest invitation is enough).
- OpenTofu 1.8 or later (opentofu.org) and the Azure CLI, on the machine
  that runs it.
- `az login`, as someone who may assign roles on the subscription (an
  Owner, or User Access Administrator with Contributor). Claude never
  signs in for anyone.
- A file `sandbox.auto.tfvars`, from the example beside this README:
  the subscription, the team lead's email, and each person's handle,
  Entra object id, workstream and email. Git ignores it.

## Running it

```
tofu init
tofu plan     # read it: what will be made, and who may change what
tofu apply
```

The output names each group, and where the MVP's own modules keep their
state.

## At the end of the day

Set `sandboxes = false` in `sandbox.auto.tfvars`, then `tofu apply`:
every personal and workstream group goes, with whatever is in it; the MVP
environment and the state stay. `tofu destroy` removes everything.

## Adding a person

Add their line to `people`, then `tofu apply`.

## Not yet done

- Not run against Azure, nor checked with `tofu validate`: OpenTofu is not
  installed where it was written. Run `tofu validate` and `tofu plan`
  first, and read the plan.
- Its own state is kept on the machine that runs it. Moving it into
  `rg-tfstate` once that exists is one `tofu init -migrate-state` with a
  backend block.
