output "cloudfront_url" {
  value = aws_cloudfront_distribution.ecs_cf.domain_name
}
