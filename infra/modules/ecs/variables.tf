variable "cluster_name" {
  type    = string
  default = "todo-app-cluster"
}

variable "image" {
  type = string
}

variable "container_port" {
  type    = number
  default = 3000
}
