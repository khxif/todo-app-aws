resource "aws_lambda_function" "lambda" {
  for_each = var.lambdas

  function_name = each.value.function_name
  handler       = each.value.handler
  runtime       = "nodejs24.x"

  role             = var.lambda_iam_role
  filename         = "${path.root}/${each.value.filename}"
  source_code_hash = filebase64sha256("${path.root}/${each.value.filename}")

}
