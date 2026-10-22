# What the sandbox holds (FS-929):
#   rg-sbx-<handle>     each person's own, for deploying a component alone
#   rg-ws-<workstream>  each workstream's, shared by its members
#   rg-mvp              the MVP environment, where everything is stitched
#   rg-tfstate          the state of the modules that build the MVP
# Each person may change their own group and their workstream's, and read
# every group; everything is tagged with its owner, so the cost view says
# who runs what; one region only; a budget on every group.

locals {
  tags = {
    purpose    = "mvp-sandbox"
    managed_by = "opentofu"
    data       = "synthetic-only"
    ticket     = "FS-929"
  }
  # Filtered, not chosen by a conditional, so both sides keep one type.
  people      = { for handle, p in var.people : handle => p if var.sandboxes }
  workstreams = toset([for ws in var.workstreams : ws if var.sandboxes])
  members = {
    for pair in flatten([
      for handle, p in var.people : { key = "${p.workstream}-${handle}", workstream = p.workstream, object_id = p.object_id }
    ]) : pair.key => pair if var.sandboxes
  }
}

# ── each person's own ─────────────────────────────────────────────────────

resource "azurerm_resource_group" "person" {
  for_each = local.people
  name     = "rg-sbx-${each.key}"
  location = var.location
  tags     = merge(local.tags, { owner = each.key, workstream = each.value.workstream })
}

resource "azurerm_role_assignment" "person_own" {
  for_each             = local.people
  scope                = azurerm_resource_group.person[each.key].id
  role_definition_name = "Contributor"
  principal_id         = each.value.object_id
}

# ── each workstream's ─────────────────────────────────────────────────────

resource "azurerm_resource_group" "workstream" {
  for_each = local.workstreams
  name     = "rg-ws-${each.key}"
  location = var.location
  tags     = merge(local.tags, { owner = "workstream", workstream = each.key })
}

resource "azurerm_role_assignment" "workstream_member" {
  for_each             = local.members
  scope                = azurerm_resource_group.workstream[each.value.workstream].id
  role_definition_name = "Contributor"
  principal_id         = each.value.object_id
}

# ── the MVP environment, kept when the sandboxes go ───────────────────────

resource "azurerm_resource_group" "mvp" {
  name     = "rg-mvp"
  location = var.location
  tags     = merge(local.tags, { owner = "platform", workstream = "platform" })
}

# The platform workstream builds it; everyone else deploys into it through
# Flux, so they read it only.
resource "azurerm_role_assignment" "mvp_platform" {
  for_each             = { for handle, p in var.people : handle => p if p.workstream == "platform" }
  scope                = azurerm_resource_group.mvp.id
  role_definition_name = "Contributor"
  principal_id         = each.value.object_id
}

# ── everyone reads everything ─────────────────────────────────────────────

resource "azurerm_role_assignment" "reader" {
  for_each             = var.people
  scope                = "/subscriptions/${var.subscription_id}"
  role_definition_name = "Reader"
  principal_id         = each.value.object_id
}

# ── one region only: Azure's built-in "Allowed locations" policy ──────────

resource "azurerm_subscription_policy_assignment" "one_region" {
  name                 = "sandbox-one-region"
  subscription_id      = "/subscriptions/${var.subscription_id}"
  policy_definition_id = "/providers/Microsoft.Authorization/policyDefinitions/e56962a6-4747-49cd-b67b-bf8b01975c4c"
  description          = "The sandbox keeps to one region (FS-929)."
  parameters = jsonencode({
    listOfAllowedLocations = { value = [var.location] }
  })
}

# ── budgets ───────────────────────────────────────────────────────────────

locals {
  budgets = merge(
    { for handle, rg in azurerm_resource_group.person : "sbx-${handle}" => { id = rg.id, amount = var.budget_per_group, emails = [var.people[handle].email, var.owner_email] } },
    { for ws, rg in azurerm_resource_group.workstream : "ws-${ws}" => { id = rg.id, amount = var.budget_per_group, emails = [var.owner_email] } },
    { "mvp" = { id = azurerm_resource_group.mvp.id, amount = var.budget_mvp, emails = [var.owner_email] } },
  )
}

resource "azurerm_consumption_budget_resource_group" "group" {
  for_each          = local.budgets
  name              = "budget-${each.key}"
  resource_group_id = each.value.id
  amount            = each.value.amount
  time_grain        = "Monthly"

  time_period {
    start_date = var.budget_start
  }

  dynamic "notification" {
    for_each = [50, 80, 100]
    content {
      enabled        = true
      threshold      = notification.value
      operator       = "GreaterThanOrEqualTo"
      threshold_type = "Actual"
      contact_emails = each.value.emails
    }
  }
}

# ── the state of the modules that build the MVP ───────────────────────────

resource "azurerm_resource_group" "state" {
  name     = "rg-tfstate"
  location = var.location
  tags     = merge(local.tags, { owner = "platform", workstream = "platform" })
}

resource "random_string" "state" {
  length  = 6
  upper   = false
  special = false
}

resource "azurerm_storage_account" "state" {
  name                            = "dibontfstate${random_string.state.result}"
  resource_group_name             = azurerm_resource_group.state.name
  location                        = var.location
  account_tier                    = "Standard"
  account_replication_type        = "LRS"
  min_tls_version                 = "TLS1_2"
  allow_nested_items_to_be_public = false
  shared_access_key_enabled       = false # sign in with Entra; no keys to leak
  tags                            = local.tags

  blob_properties {
    versioning_enabled = true # a state overwritten by mistake comes back
  }
}

resource "azurerm_storage_container" "state" {
  name                  = "tfstate"
  storage_account_id    = azurerm_storage_account.state.id
  container_access_type = "private"
}

resource "azurerm_role_assignment" "state_platform" {
  for_each             = { for handle, p in var.people : handle => p if p.workstream == "platform" }
  scope                = azurerm_storage_account.state.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = each.value.object_id
}
