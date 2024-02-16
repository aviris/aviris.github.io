variable "env" {
  type = string
}
variable "app_name" {
  type = string
}
variable "custom_domain" {
  type    = string
  default = null
}
variable "secondary_domain" {
  type    = string
  default = null
}
variable "tags" {
  type = map(string)
}

locals {
  name    = "campus-map-ui"
  gh_org  = "byu-oit"
  gh_repo = "campus-map-ui"
}

resource "random_string" "cloudfront_connection" {
  length  = 16
  special = false
  keepers = {
    create_once = true
  }
}

resource "aws_ssm_parameter" "cloudfront_connection" {
  name  = "/${var.app_name}/s3_cloudfront_connection"
  type  = "String"
  value = random_string.cloudfront_connection.result
  tags  = var.tags
}

resource "aws_route53_zone" "custom_zone" {
  name = var.custom_domain
  tags = var.tags
}

resource "aws_route53_zone" "secondary_zone" {
  name = var.secondary_domain
  tags = var.tags
}

resource "aws_ses_email_identity" "email" {
  email = "map-feedback@byu.edu"
}

resource "aws_resourcegroups_group" "group" {
  name        = var.app_name
  description = "Resources used for ${var.app_name}."
  tags        = var.tags
  resource_query {
    query = <<JSON
{
  "ResourceTypeFilters": [
    "AWS::AllSupported"
  ],
  "TagFilters": [
    {
      "Key": "repo",
      "Values": ["${var.tags["repo"]}"]
    }
  ]
}
JSON
  }
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