# module "runner" {
#   source              = "./modules/runner"
#   github_repo         = var.github_repo
#   github_runner_token = var.github_runner_token
#   key_name            = var.key_name
# }

# module "secrets_manager" {
#   source   = "./modules/secrets-manager"
#   app_name = "todo-app"
# }

module "vpc" {
  source = "./modules/vpc"
}

resource "aws_security_group" "app_sg" {
  name       = "app-sg"
  vpc_id     = module.vpc.vpc_id
  depends_on = [module.vpc]
}

module "rds" {
  source     = "./modules/rds"
  vpc_id     = module.vpc.vpc_id
  app_sg_id  = aws_security_group.app_sg.id
  depends_on = [module.vpc]
}

module "lambda" {
  source = "./modules/lambda"

  lambdas = {
    hello = {
      function_name = "hello-function"
      handler       = "dist/handlers/hello.hello"
      filename      = "lambda.zip"
    },
    login = {
      function_name = "login-function"
      handler       = "dist/handlers/login.handler"
      filename      = "lambda.zip"
    }
  }
}

module "api_gateway" {
  source           = "./modules/api-gateway"
  api_gateway_name = "todo-api-gateway"

  routes = {
    hello_route = {
      method      = "GET"
      path        = "/api/hello"
      lambda_arn  = module.lambda.lambda_arns["hello"]
      lambda_name = module.lambda.lambda_names["hello"]
    }
    login_route = {
      method      = "GET"
      path        = "/api/login"
      lambda_arn  = module.lambda.lambda_arns["login"]
      lambda_name = module.lambda.lambda_names["login"]
    }
  }

  depends_on = [module.lambda]
}

module "frontend_ecs" {
  source = "./modules/ecs"
  image  = var.frontend_image
}

module "cloudfront" {
  source          = "./modules/cloudfront"
  cloudfront_name = "todo-cloudfront"
  alb_domain      = module.frontend_ecs.alb_dns
  depends_on      = [module.frontend_ecs]
}
