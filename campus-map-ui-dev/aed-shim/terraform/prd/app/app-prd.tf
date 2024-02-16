provider "aws" {
  region = "us-west-2"
}

terraform {
  backend "s3" {
    encrypt        = true
    bucket         = "terraform-state-storage-938392054076"
    dynamodb_table = "terraform-state-lock-938392054076"
    key            = "campus-map-aed-shim/prd/app.tfstate"
    region         = "us-west-2"
  }
  required_providers {
    archive = {
      source  = "hashicorp/archive"
      version = "~> 1.3.0"
    }
    aws = {
      version = "~> 3.0"
    }
  }
  required_version = "0.13.5"
}

module "app" {
  source = "../../modules/app"
  env    = "prd"
}

output "codedeploy_app_name" {
  value = module.app.codedeploy_app_name
}

output "codedeploy_deployment_group_name" {
  value = module.app.codedeploy_deployment_group_name
}

output "codedeploy_appspec_json_file" {
  value = module.app.codedeploy_appspec_json_file
}
