provider "aws" {
  alias  = "aws_n_va"
  region = "us-east-1"
}

variable "app_name" {
  type = string
}
variable "hosted_zone_id" {
  type = string
}
variable "secondary_zone_id" {
  type    = string
  default = null
}
variable "index_doc" {
  type    = string
  default = "index.html"
}
variable "region" {
  type = string
}
variable "tags" {
  type = map(string)
}
variable "url" {
  type = string
}
variable "secondary_url" {
  type    = string
  default = null
}

data "aws_caller_identity" "current" {}
data "aws_iam_account_alias" "current" {}
data "aws_ssm_parameter" "s3_cloudfront_connection" {
  name = "/${var.app_name}/s3_cloudfront_connection"
}

output "site_bucket" {
  value = aws_s3_bucket.static-website
}

output "cf_distribution" {
  value = aws_cloudfront_distribution.cdn
}

output "redirect_cf_dist" {
  value = aws_cloudfront_distribution.redirect
}
