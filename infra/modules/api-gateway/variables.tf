variable "routes" {
  type = map(object({
    method      = string
    path        = string
    lambda_arn  = string
    lambda_name = string
  }))
}

variable "api_gateway_name" {
  type = string
}
