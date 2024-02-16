resource "aws_api_gateway_account" "apigw_account" {
  cloudwatch_role_arn = aws_iam_role.cloudwatch.arn
}

resource "aws_iam_role" "cloudwatch" {
  name = "api_gateway_cloudwatch_global"
  tags = var.tags

  assume_role_policy   = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
  permissions_boundary = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:policy/iamRolePermissionBoundary"
}

resource "aws_iam_role_policy" "cloudwatch" {
  name = "default"
  role = aws_iam_role.cloudwatch.id

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:DescribeLogGroups",
                "logs:DescribeLogStreams",
                "logs:PutLogEvents",
                "logs:GetLogEvents",
                "logs:FilterLogEvents"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

resource "aws_api_gateway_rest_api" "email_api" {
  name = "${var.app_name}-send-email-api"
  tags = var.tags

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "rest_resource" {
  parent_id   = aws_api_gateway_rest_api.email_api.root_resource_id
  path_part   = "rest"
  rest_api_id = aws_api_gateway_rest_api.email_api.id
}

resource "aws_api_gateway_resource" "resource" {
  parent_id   = aws_api_gateway_resource.rest_resource.id
  path_part   = "sendEmail"
  rest_api_id = aws_api_gateway_rest_api.email_api.id
}

resource "aws_api_gateway_method" "method" {
  authorization = "NONE"
  http_method   = "ANY"
  resource_id   = aws_api_gateway_resource.resource.id
  rest_api_id   = aws_api_gateway_rest_api.email_api.id
}

resource "aws_api_gateway_method_settings" "method_settings" {
  method_path = "*/*"
  rest_api_id = aws_api_gateway_rest_api.email_api.id
  stage_name  = aws_api_gateway_deployment.deployment.stage_name

  settings {
    metrics_enabled = true
    logging_level   = "INFO"
  }
}

resource "aws_api_gateway_integration" "integration" {
  http_method             = aws_api_gateway_method.method.http_method
  resource_id             = aws_api_gateway_resource.resource.id
  rest_api_id             = aws_api_gateway_rest_api.email_api.id
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.email_lambda.invoke_arn
}

resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [aws_api_gateway_integration.integration]

  rest_api_id = aws_api_gateway_rest_api.email_api.id
  stage_name  = var.tags["env"]
}

resource "aws_cloudwatch_log_group" "email_api_logs" {
  name              = "API-Gateway-Execution-Logs_${aws_api_gateway_rest_api.email_api.id}/${aws_api_gateway_deployment.deployment.stage_name}"
  retention_in_days = 7
  tags              = var.tags
}
