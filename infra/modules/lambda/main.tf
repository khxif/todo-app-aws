resource "aws_iam_role" "lambda_exec" {
  name = "lambda-exec-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement : [{
      Effect : "Allow",
      Action : "sts:AssumeRole",
      Principal : {
        Service : "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "lambda" {
  for_each = var.lambdas

  function_name = each.value.function_name
  handler       = each.value.handler
  runtime       = "nodejs24.x"

  role             = aws_iam_role.lambda_exec.arn
  filename         = "${path.root}/${each.value.filename}"
  source_code_hash = filebase64sha256("${path.root}/${each.value.filename}")
}
