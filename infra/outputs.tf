output "rds_endpoint" {
  value = module.rds.rds_endpoint
}

output "lambda_arn" {
  value = module.lambda.lambda_arn
}

output "api_url" {
  value = module.lambda.api_url
}
