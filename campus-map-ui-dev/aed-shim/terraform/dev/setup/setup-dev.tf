provider "aws" {
  region = "us-west-2"
}

terraform {
  backend "s3" {
    encrypt        = true
    bucket         = "terraform-state-storage-110877218140"
    dynamodb_table = "terraform-state-lock-110877218140"
    key            = "campus-map-aed-shim/dev/setup.tfstate"
    region         = "us-west-2"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.67"
    }
  }
  required_version = "1.4.6"
}

variable "client_id" {
  type        = string
  description = "WSO2 client_id to make calls to AED API"
}
variable "client_secret" {
  type        = string
  description = "WSO2 client_secret to make calls to AED API"
}

module "setup" {
  source        = "../../modules/setup/"
  env           = "dev"
  client_id     = var.client_id
  client_secret = var.client_secret
}
