output "cloudfront_url" {
  value = aws_cloudfront_distribution.api_cf.domain_name
}
