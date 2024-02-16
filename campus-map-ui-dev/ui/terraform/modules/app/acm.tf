resource "aws_acm_certificate" "url_cert" {
  provider                  = aws.aws_n_va
  domain_name               = var.url
  subject_alternative_names = [var.secondary_url]
  validation_method         = "DNS"
  tags                      = var.tags
}

resource "aws_acm_certificate_validation" "cert" {
  provider                = aws.aws_n_va
  certificate_arn         = aws_acm_certificate.url_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}
