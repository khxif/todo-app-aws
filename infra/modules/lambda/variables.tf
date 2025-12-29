variable "lambdas" {
  type = map(object({
    handler  = string
    filename = string
    function_name = string
  }))
}

