variable "subscription_id" {
  description = "The Azure subscription for the sandbox, dibon-sandbox."
  type        = string
}

variable "location" {
  description = "The one region the sandbox may use. Public Azure has no region in Kenya, so the data is made up, always."
  type        = string
  default     = "southafricanorth"
}

variable "people" {
  description = <<-EOT
    Each person by their handle (the team table, ways-of-working §1): their
    Entra object id (az ad user show --id their-sign-in --query id -o tsv),
    the workstream they work in for the day, and the email their budget
    alerts go to.
  EOT
  type = map(object({
    object_id  = string
    workstream = string
    email      = string
  }))
}

variable "workstreams" {
  description = "The day's workstreams, each with a resource group its members share."
  type        = list(string)
  default     = ["platform", "core", "money", "back-office", "delivery"]
}

variable "sandboxes" {
  description = "true while the day runs; false tears down every personal and workstream resource group, keeping the MVP and the state."
  type        = bool
  default     = true
}

variable "budget_per_group" {
  description = "A monthly budget for each resource group, in the subscription's currency; an alert at 50%, 80% and 100%."
  type        = number
  default     = 50
}

variable "budget_mvp" {
  description = "The monthly budget for the MVP environment."
  type        = number
  default     = 200
}

variable "budget_start" {
  description = "The first day of the budgets' month, as Azure wants it."
  type        = string
  default     = "2026-10-01T00:00:00Z"
}

variable "owner_email" {
  description = "Who hears about every budget, besides each group's owner: the team lead."
  type        = string
}
