resource "aws_s3_bucket" "static-website" {
  bucket        = "${var.app_name}-s3staticsite"
  tags          = var.tags
  force_destroy = true

  website {
    index_document = var.index_doc
  }

  lifecycle_rule {
    enabled                                = true
    abort_incomplete_multipart_upload_days = 10
    id                                     = "AutoAbortFailedMultipartUpload"

    expiration {
      days                         = 0
      expired_object_delete_marker = false
    }
  }
}

data "aws_iam_policy_document" "static_website_read_with_secret" {
  statement {
    sid       = "1"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.static-website.arn}/*"]

    principals {
      identifiers = ["*"]
      type        = "AWS"
    }

    condition {
      test     = "StringEquals"
      values   = [data.aws_ssm_parameter.s3_cloudfront_connection.value]
      variable = "aws:UserAgent"
    }
  }
}

resource "aws_s3_bucket_policy" "static_website_read_with_secret" {
  bucket = aws_s3_bucket.static-website.id
  policy = data.aws_iam_policy_document.static_website_read_with_secret.json
}

resource "aws_s3_bucket" "secondary_site" {
  bucket        = var.secondary_url
  tags          = var.tags
  force_destroy = true

  website {
    redirect_all_requests_to = var.url
  }

  lifecycle_rule {
    enabled                                = true
    abort_incomplete_multipart_upload_days = 10
    id                                     = "AutoAbortFailedMultipartUpload"

    expiration {
      days                         = 0
      expired_object_delete_marker = false
    }
  }
}
