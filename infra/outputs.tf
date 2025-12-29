# output "lambda_arn" {
#   value = module.lambda.lambda_arns
# }

# output "lambda_names" {
#   value = module.lambda.lambda_names
# }

# output "api_url" {
#   value = module.api_gateway.api_url
# }

# output "lambda_cloudfront_url" {
#   value = module.lambda_cloudfront.cloudfront_url
# }

# output "runner_ip" {
#   value = module.runner.public_ip
# }

# output "secret_manager_arn" {
#   value = module.secrets_manager.secret_arn
# }

output "frontend_url" {
  value = "http://${module.frontend_ecs.alb_dns}"
}
