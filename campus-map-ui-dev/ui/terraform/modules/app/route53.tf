resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.url_cert.domain_validation_options : dvo.domain_name => {
      name    = dvo.resource_record_name
      record  = dvo.resource_record_value
      type    = dvo.resource_record_type
      zone_id = dvo.domain_name == var.url ? var.hosted_zone_id : var.secondary_zone_id
    }
  }

  allow_overwrite = true
  provider        = aws.aws_n_va
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = each.value.zone_id
}

resource "aws_route53_record" "custom-url-a" {
  name    = var.url
  type    = "A"
  zone_id = var.hosted_zone_id

  alias {
    evaluate_target_health = false
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
  }
}

resource "aws_route53_record" "custom-url-4a" {
  name    = var.url
  type    = "AAAA"
  zone_id = var.hosted_zone_id

  alias {
    evaluate_target_health = false
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
  }
}

resource "aws_route53_record" "secondary_url_a" {
  count = var.secondary_url != null ? 1 : 0

  name    = var.secondary_url
  type    = "A"
  zone_id = var.secondary_zone_id

  alias {
    evaluate_target_health = false
    name                   = aws_cloudfront_distribution.redirect.domain_name
    zone_id                = aws_cloudfront_distribution.redirect.hosted_zone_id
  }
}

resource "aws_route53_record" "secondary_url_4a" {
  count = var.secondary_url != null ? 1 : 0

  name    = var.secondary_url
  type    = "AAAA"
  zone_id = var.secondary_zone_id

  alias {
    evaluate_target_health = false
    name                   = aws_cloudfront_distribution.redirect.domain_name
    zone_id                = aws_cloudfront_distribution.redirect.hosted_zone_id
  }
}
