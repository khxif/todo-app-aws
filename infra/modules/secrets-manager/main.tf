resource "aws_secretsmanager_secret" "app_secrets" {
  name        = var.app_name
  description = "Secrets for ${var.app_name}"
}

resource "aws_secretsmanager_secret_version" "app_secrets_version" {
  secret_id = aws_secretsmanager_secret.app_secrets.id
  
  secret_string = jsonencode({
    DB_PASS = "test"
  })
}
