output "lambda_arn" {
  value = aws_lambda_function.my_lambda.arn
}

output "api_url" {
  value = aws_apigatewayv2_api.http_api.api_endpoint
}
