provider "aws" {
  region = "us-west-2"
}

terraform {
  backend "s3" {
    encrypt        = true
    bucket         = "terraform-state-storage-938392054076"
    dynamodb_table = "terraform-state-lock-938392054076"
    key            = "campus-map-ui/prd/setup.tfstate"
    region         = "us-west-2"
  }
  required_providers {
    random = {
      source  = "hashicorp/random"
      version = "~> 2.3.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.67"
    }
  }
  required_version = "1.4.6"
}

locals {
  app_name = "campus-map-ui-prd"
}

module "setup" {
  source = "../../modules/setup"

  env              = "prd"
  app_name         = local.app_name
  custom_domain    = "map.byu.edu"
  secondary_domain = "maps.byu.edu"
  tags = {
    app              = local.app_name
    env              = "prd"
    data-sensitivity = "public"
    team             = "OIT-BYU-APPS-CUSTOM"
    repo             = "https://github.com/byu-oit/campus-map-ui"
  }
}
