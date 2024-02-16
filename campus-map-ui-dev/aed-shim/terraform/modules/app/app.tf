variable "env" {
  type = string
}

//variable "deploy_test_postman_collection" {
//  type = string
//}
//
//variable "deploy_test_postman_environment" {
//  type = string
//}

locals {
  name = "aed-shim"
  tags = {
    env              = var.env
    data-sensitivity = "public"
    repo             = "https://github.com/byu-oit/campus-map-ui" # TODO rename this once we rename the repo too
  }
  ssm_arn_base = "arn:aws:ssm:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:parameter/${local.name}/${var.env}"
}

module "acs" {
  source = "github.com/byu-oit/terraform-aws-acs-info?ref=v3.1.0"
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

module "lambda_api" {
  source                        = "github.com/byu-oit/terraform-aws-lambda-api?ref=v1.1.0"
  app_name                      = local.name
  env                           = var.env
  codedeploy_service_role_arn   = module.acs.power_builder_role.arn
  lambda_zip_file               = "../../../src/lambda.zip"
  handler                       = "index.handler"
  runtime                       = "nodejs18.x"
  hosted_zone                   = module.acs.route53_zone
  https_certificate_arn         = module.acs.certificate.arn
  public_subnet_ids             = module.acs.public_subnet_ids
  vpc_id                        = module.acs.vpc.id
  role_permissions_boundary_arn = module.acs.role_permissions_boundary.arn
  codedeploy_test_listener_port = 4443
  use_codedeploy                = true

  environment_variables = {
    "CLIENT_ID_PARAM_NAME"     = "/${local.name}/${var.env}/client_id"
    "CLIENT_SECRET_PARAM_NAME" = "/${local.name}/${var.env}/client_secret"
  }

  lambda_policies = [
    aws_iam_policy.my_ssm_policy.arn
  ]

  codedeploy_lifecycle_hooks = {
    //    BeforeAllowTraffic = aws_lambda_function.test_lambda.function_name
    BeforeAllowTraffic = null
    AfterAllowTraffic  = null
  }
}

resource "aws_iam_policy" "my_ssm_policy" {
  name        = "${local.name}-ssm-${var.env}"
  path        = "/"
  description = "Access to ssm parameters"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
              "ssm:GetParameters",
              "ssm:GetParameter",
              "ssm:GetParemetersByPath"
            ],
            "Resource": "${local.ssm_arn_base}/*"
        }
    ]
}
EOF
}

// add TODO postman tests?

//module "postman_test_lambda" {
//  source                        = "github.com/byu-oit/terraform-aws-postman-test-lambda?ref=v2.2.0"
//  app_name                      = "${local.name}-deploy-test-${var.env}"
//  postman_collection_file       = var.deploy_test_postman_collection
//  postman_environment_file      = var.deploy_test_postman_environment
//  role_permissions_boundary_arn = module.acs.role_permissions_boundary.arn
//}

output "url" {
  value = module.lambda_api.dns_record.name
}

output "codedeploy_app_name" {
  value = module.lambda_api.codedeploy_deployment_group.app_name
}

output "codedeploy_deployment_group_name" {
  value = module.lambda_api.codedeploy_deployment_group.deployment_group_name
}

output "codedeploy_appspec_json_file" {
  value = module.lambda_api.codedeploy_appspec_json_file
}
