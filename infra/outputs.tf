output "api_url" {
  value = module.api_gateway.api_url
}

# output "cloudfront_url" {
#   value = module.cloudfront.cloudfront_url
# }

# output "frontend_url" {
#   value = "http://${module.frontend_ecs.alb_dns}"
# }

# output "runner_ip" {
#   value = module.runner.public_ip
# }

# output "secret_manager_arn" {
#   value = module.secrets_manager.secret_arn
# }