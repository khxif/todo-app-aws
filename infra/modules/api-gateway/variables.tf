variable "routes" {
  type = map(object({
    method      = string
    path        = string
    lambda_arn  = string
    lambda_name = string
  }))
}
