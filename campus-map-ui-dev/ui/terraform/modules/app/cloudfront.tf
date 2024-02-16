resource "aws_cloudfront_distribution" "cdn" {
  price_class = "PriceClass_100"
  origin {
    domain_name = aws_s3_bucket.static-website.website_endpoint
    origin_id   = aws_s3_bucket.static-website.bucket

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2", "TLSv1.1", "TLSv1"]
    }

    custom_header {
      name  = "User-Agent"
      value = data.aws_ssm_parameter.s3_cloudfront_connection.value
    }
  }

  origin {
    domain_name = "${aws_api_gateway_rest_api.email_api.id}.execute-api.${var.region}.amazonaws.com"
    origin_id   = "${var.app_name}-api-deployment-${aws_api_gateway_deployment.deployment.id}"
    origin_path = "/${var.tags["env"]}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  comment             = "CDN for ${var.app_name} S3 Bucket and API"
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = var.index_doc
  aliases             = [var.url]
  tags                = var.tags

  default_cache_behavior {
    target_origin_id = aws_s3_bucket.static-website.bucket
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }
    viewer_protocol_policy = "redirect-to-https"
  }

  ordered_cache_behavior {
    allowed_methods        = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods         = ["GET", "HEAD"]
    path_pattern           = "/rest/*"
    target_origin_id       = "${var.app_name}-api-deployment-${aws_api_gateway_deployment.deployment.id}"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.cert.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.1_2016"
  }
}

resource "aws_cloudfront_distribution" "redirect" {
  price_class = "PriceClass_100"
  origin {
    domain_name = aws_s3_bucket.secondary_site.website_endpoint
    origin_id   = aws_s3_bucket.secondary_site.bucket

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2", "TLSv1.1", "TLSv1"]
    }
  }

  comment         = "${var.secondary_url} HTTPS redirect"
  enabled         = true
  is_ipv6_enabled = true
  aliases         = [var.secondary_url]
  tags            = var.tags

  default_cache_behavior {
    target_origin_id = aws_s3_bucket.secondary_site.bucket
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }
    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.cert.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.1_2016"
  }
}
