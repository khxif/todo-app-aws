# module "rds" {
#   source = "./modules/rds"
#   vpc_id = aws_vpc.vpc.id
# }

# resource "aws_iam_role" "lambda_exec" {
#   name = "lambda-exec-role"

#   assume_role_policy = jsonencode({
#     Version = "2012-10-17",
#     Statement : [{
#       Effect : "Allow",
#       Action : "sts:AssumeRole",
#       Principal : {
#         Service : "lambda.amazonaws.com"
#       }
#     }]
#   })
# }

# resource "aws_iam_role_policy_attachment" "lambda_basic" {
#   role       = aws_iam_role.lambda_exec.name
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
# }

# module "lambda" {
#   source          = "./modules/lambda"
#   lambda_iam_role = aws_iam_role.lambda_exec.arn

#   lambdas = {
#     hello = {
#       function_name = "hello-function"
#       handler       = "dist/handlers/hello.hello"
#       filename      = "lambda.zip"
#     },
#     login = {
#       function_name = "login-function"
#       handler       = "dist/handlers/login.handler"
#       filename      = "lambda.zip"
#     }
#   }

#   depends_on = [aws_iam_role.lambda_exec]
# }

# module "api_gateway" {
#   source = "./modules/api-gateway"

#   routes = {
#     hello_route = {
#       method      = "GET"
#       path        = "/api/hello"
#       lambda_arn  = module.lambda.lambda_arns["hello"]
#       lambda_name = module.lambda.lambda_names["hello"]
#     }
#     login_route = {
#       method      = "GET"
#       path        = "/api/login"
#       lambda_arn  = module.lambda.lambda_arns["login"]
#       lambda_name = module.lambda.lambda_names["login"]
#     }
#   }

#   depends_on = [module.lambda]
# }

# module "lambda_cloudfront" {
#   source                   = "./modules/cloudfront"
#   api_gateway_api_endpoint = module.api_gateway.api_url
#   depends_on               = [module.api_gateway]
# }

# module "runner" {
#   source              = "./modules/runner"
#   github_repo         = var.github_repo
#   github_runner_token = var.github_runner_token
#   key_name            = var.key_name
# }

module "secrets_manager" {
  source   = "./modules/secrets-manager"
  app_name = "todo-app"
}
