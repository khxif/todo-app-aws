variable "lambdas" {
  type = map(object({
    handler  = string
    filename = string
    function_name = string
  }))
}

variable "lambda_iam_role" {
  type = string
}
