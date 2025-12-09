output "lambda_arn" {
  value = module.lambda.lambda_arns
}

output "lambda_names" {
  value = module.lambda.lambda_names
}

output "api_url" {
  value = module.api_gateway.api_url
}
