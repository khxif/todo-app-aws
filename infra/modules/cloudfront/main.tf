resource "aws_cloudfront_origin_request_policy" "ecs_minimal" {
  name    = var.cloudfront_name
  comment = "Minimal headers for ALB-backed ECS service"

  headers_config {
    header_behavior = "whitelist"
    headers {
      items = [
        "Host",
        "CloudFront-Viewer-Country"
      ]
    }
  }

  cookies_config {
    cookie_behavior = "all" # change to "none" if purely public site
  }

  query_strings_config {
    query_string_behavior = "all"
  }
}

resource "aws_cloudfront_cache_policy" "ecs_cache" {
  name    = "${var.cloudfront_name}-cache"
  comment = "Cache policy for ECS frontend"

  default_ttl = 300  # 5 minutes
  max_ttl     = 3600 # 1 hour
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true

    cookies_config {
      cookie_behavior = "all"
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "all"
    }
  }
}

resource "aws_cloudfront_distribution" "ecs_cf" {
  enabled = true

  origin {
    domain_name = var.alb_domain
    origin_id   = "ecs-alb-origin"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only" # ALB usually terminates TLS
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    target_origin_id       = "ecs-alb-origin"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD"]

    cache_policy_id          = aws_cloudfront_cache_policy.ecs_cache.id
    origin_request_policy_id = aws_cloudfront_origin_request_policy.ecs_minimal.id
    compress                 = true
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
