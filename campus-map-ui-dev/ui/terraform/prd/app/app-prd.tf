provider "aws" {
  region  = "us-west-2"
  version = "~> 3.0"
}

terraform {
  backend "s3" {
    encrypt        = true
    bucket         = "terraform-state-storage-938392054076"
    dynamodb_table = "terraform-state-lock-938392054076"
    key            = "campus-map-ui/prd/app.tfstate"
    region         = "us-west-2"
  }
  required_providers {
    archive = {
      source  = "hashicorp/archive"
      version = "~> 1.3.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
  required_version = "0.13.5"
}

variable "url" {
  type    = string
  default = "map.byu.edu"
}
variable "secondary_url" {
  type    = string
  default = "maps.byu.edu"
}

data "aws_route53_zone" "custom_hosted_zone" {
  name = var.url
}
data "aws_route53_zone" "secondary_hosted_zone" {
  name = var.secondary_url
}

locals {
  app_name = "campus-map-ui-prd"
}

module "app" {
  source            = "../../modules/app"
  app_name          = local.app_name
  hosted_zone_id    = data.aws_route53_zone.custom_hosted_zone.id
  secondary_zone_id = data.aws_route53_zone.secondary_hosted_zone.id
  region            = "us-west-2"
  tags = {
    env              = "prd"
    data-sensitivity = "public"
    team             = "OIT-BYU-APPS-CUSTOM"
    repo             = "https://github.com/byu-oit/campus-map-ui"
    app              = local.app_name
  }
  url           = var.url
  secondary_url = var.secondary_url
}

output "s3_bucket" {
  value = module.app.site_bucket.bucket
}

output "cf_distribution_id" {
  value = module.app.cf_distribution.id
}

output "redirect_cf_dist_id" {
  value = module.app.redirect_cf_dist.id
}
