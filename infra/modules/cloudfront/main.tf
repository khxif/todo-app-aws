resource "aws_cloudfront_origin_request_policy" "api_minimal" {
  name    = "todo-origin-minimal"
  comment = "Forward only essential items for caching"

  headers_config {
    header_behavior = "none" # DO NOT FORWARD HEADERS - improves caching massively
  }

  cookies_config {
    cookie_behavior = "none"
  }

  query_strings_config {
    query_string_behavior = "all" # Needed for API GET endpoints
  }
}


resource "aws_cloudfront_cache_policy" "api_cache_enabled" {
  name    = "todo-cache-enabled"
  comment = "Cache GET responses for API Gateway"

  default_ttl = 60  # Cache for 1 minute
  max_ttl     = 300 # Max cache 5 minutes
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true

    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "all" # Important for GET caching
    }
  }
}



resource "aws_cloudfront_distribution" "api_cf" {
  enabled = true

  origin {
    domain_name = replace(var.api_gateway_api_endpoint, "https://", "")
    origin_id   = "api-gateway-origin"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    target_origin_id       = "api-gateway-origin"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods  = ["GET", "HEAD"]

    cache_policy_id          = aws_cloudfront_cache_policy.api_cache_enabled.id
    origin_request_policy_id = aws_cloudfront_origin_request_policy.api_minimal.id
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
