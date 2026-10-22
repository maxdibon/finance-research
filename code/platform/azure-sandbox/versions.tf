# The sandbox on public Azure for the MVP day (FS-929, FS-932).
# OpenTofu, not Terraform: Terraform moved to the Business Source License
# in 2023, the licence we already declined for Vault (technology register).

terraform {
  required_version = ">= 1.8.0" # OpenTofu 1.8 or later

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.20"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # Tonight's set-up keeps its state locally, on the machine that runs it,
  # never in git (.gitignore). It creates the storage account that later
  # modules (the MVP's network and cluster) keep their state in.
}

provider "azurerm" {
  subscription_id = var.subscription_id

  features {
    resource_group {
      # The day's sandboxes are thrown away whole at the end.
      prevent_deletion_if_contains_resources = false
    }
  }
}
