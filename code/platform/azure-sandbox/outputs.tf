output "personal_groups" {
  description = "Each person's own resource group."
  value       = { for handle, rg in azurerm_resource_group.person : handle => rg.name }
}

output "workstream_groups" {
  description = "Each workstream's resource group."
  value       = { for ws, rg in azurerm_resource_group.workstream : ws => rg.name }
}

output "mvp_group" {
  description = "The MVP environment."
  value       = azurerm_resource_group.mvp.name
}

output "state_backend" {
  description = "For the MVP's own modules: their state goes here (backend \"azurerm\", use_azuread_auth = true)."
  value = {
    resource_group_name  = azurerm_resource_group.state.name
    storage_account_name = azurerm_storage_account.state.name
    container_name       = azurerm_storage_container.state.name
  }
}
