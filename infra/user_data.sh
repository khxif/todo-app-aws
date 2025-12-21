#!/bin/bash
set -e

LOG_FILE=/var/log/github-runner-bootstrap.log
exec > >(tee -a $LOG_FILE) 2>&1

echo "=== GitHub Runner bootstrap started ==="

# -----------------------------
# BASIC SETUP
# -----------------------------
apt update -y
apt install -y curl git unzip snapd ca-certificates

# -----------------------------
# ENSURE SSM AGENT
# -----------------------------
snap install amazon-ssm-agent --classic || true
systemctl enable snap.amazon-ssm-agent.amazon-ssm-agent
systemctl start snap.amazon-ssm-agent.amazon-ssm-agent

# -----------------------------
# CREATE GITHUB USER
# -----------------------------
if ! id github &>/dev/null; then
  echo "Creating github user"
  useradd -m github
  usermod -aG sudo github
else
  echo "github user already exists"
fi

cd /home/github || exit 1

# -----------------------------
# DOWNLOAD GITHUB RUNNER
# -----------------------------
if [ ! -f "./config.sh" ]; then
  echo "Downloading GitHub runner ${RUNNER_VERSION}"

  curl -L -o actions-runner.tar.gz \
    https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz

  tar xzf actions-runner.tar.gz
  chown -R github:github /home/github
else
  echo "GitHub runner already installed"
fi

# -----------------------------
# INSTALL RUNNER DEPENDENCIES
# -----------------------------
if [ -f "./bin/installdependencies.sh" ]; then
  ./bin/installdependencies.sh || true
fi

# -----------------------------
# REGISTER RUNNER WITH GITHUB
# -----------------------------
echo "Registering GitHub runner"

sudo -u github bash <<EOF
cd /home/github

./config.sh \
  --url https://github.com/${GITHUB_REPO} \
  --token ${GITHUB_RUNNER_TOKEN} \
  --name aws-ec2-runner-$(hostname) \
  --labels aws,ec2,self-hosted \
  --unattended \
  --replace
EOF

# -----------------------------
# INSTALL & START RUNNER SERVICE
# -----------------------------
cd /home/github
./svc.sh install github
./svc.sh start

# -----------------------------
# FINAL STATUS
# -----------------------------
echo "=== GitHub Runner bootstrap completed successfully ==="
