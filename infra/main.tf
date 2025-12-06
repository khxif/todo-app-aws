module "rds" {
  source = "./modules/rds"
  vpc_id = aws_vpc.vpc.id
}
