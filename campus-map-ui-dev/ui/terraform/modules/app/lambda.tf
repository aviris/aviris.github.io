resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"
  tags = var.tags

  assume_role_policy   = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
  permissions_boundary = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:policy/iamRolePermissionBoundary"
}

resource "aws_iam_policy" "send_email_lambda" {
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

resource "aws_iam_policy" "lambda_logging" {
  name        = "lambda_logging"
  path        = "/"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:CreateLogGroup"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

resource "aws_iam_role_policy_attachment" "email_policy_attachment" {
  policy_arn = aws_iam_policy.send_email_lambda.arn
  role       = aws_iam_role.iam_for_lambda.name
}

data "archive_file" "lambda" {
  type        = "zip"
  source_file = "${path.module}/sendEmail.js"
  output_path = "${path.module}/sendEmail.zip"
}

resource "aws_lambda_function" "email_lambda" {
  depends_on = [aws_iam_role_policy_attachment.lambda_logs]

  filename         = "${path.module}/sendEmail.zip"
  source_code_hash = data.archive_file.lambda.output_base64sha256
  function_name    = "${var.app_name}-email-lambda"
  role             = aws_iam_role.iam_for_lambda.arn
  handler          = "sendEmail.handler"
  runtime          = "nodejs14.x"
  tags             = var.tags
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.email_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.email_api.execution_arn}/*/*/*"
}
