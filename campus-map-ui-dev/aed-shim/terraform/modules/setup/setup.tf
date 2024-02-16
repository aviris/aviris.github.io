variable "env" {
  type = string
}

variable "client_id" {
  type = string
}
variable "client_secret" {
  type = string
}

locals {
  name    = "aed-shim"
  gh_org  = "byu-oit"
  gh_repo = "campus-map-ui"
}

resource "aws_ssm_parameter" "client_id" {
  name  = "/${local.name}/${var.env}/client_id"
  type  = "String"
  value = var.client_id
}

resource "aws_ssm_parameter" "client_secret" {
  name  = "/${local.name}/${var.env}/client_secret"
  type  = "SecureString"
  value = var.client_secret
}

module "acs" {
  source = "github.com/byu-oit/terraform-aws-acs-info?ref=v4.0.0"
}

module "gha_role" {
  source                         = "terraform-aws-modules/iam/aws//modules/iam-assumable-role-with-oidc"
  version                        = "5.17.0"
  create_role                    = true
  role_name                      = "${local.name}-${var.env}-gha"
  provider_url                   = module.acs.github_oidc_provider.url
  role_permissions_boundary_arn  = module.acs.role_permissions_boundary.arn
  role_policy_arns               = module.acs.power_builder_policies[*].arn
  oidc_fully_qualified_audiences = ["sts.amazonaws.com"]
  oidc_subjects_with_wildcards   = ["repo:${local.gh_org}/${local.gh_repo}:*"]
}