#!/bin/bash

# Default to fetching the latest version if no version is specified
VERSION=$1
REPO="CalebBarnes/nextwp"

if [ -z "$VERSION" ]; then
API_URL="https://api.github.com/repos/$REPO/releases"
  echo "Fetching the latest version from $API_URL..."
  # echo "jq is required for parsing JSON. Install it from https://stedolan.github.io/jq/download/."
  VERSION=$(curl -s $API_URL | jq -r '[.[] | select(.tag_name | startswith("nextwp-cli-"))][0].tag_name')

  if [ -z "$VERSION" ]; then
    echo "Failed to retrieve the latest version."
    exit 1
  fi
fi

echo "Selected version: $VERSION"

OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)
case "$ARCH" in
    x86_64) ARCH="amd64";;
    arm64 | aarch64) ARCH="arm64";;
    *) echo "Unsupported architecture: $ARCH"; exit 1;;
esac

ARCHIVE_NAME="nextwp-cli-${OS}-${ARCH}-${VERSION}.zip"

# Fetch the latest release
RELEASE=$(curl --silent "https://api.github.com/repos/$REPO/releases/tags/$VERSION")
# Get the release asset download URL for the specified archive
DOWNLOAD_URL=$(echo $RELEASE | jq --raw-output ".assets[] | select(.name == \"$ARCHIVE_NAME\") | .browser_download_url")

echo "Downloading $ARCHIVE_NAME from $DOWNLOAD_URL..."

curl -L "$DOWNLOAD_URL" -o "/tmp/${ARCHIVE_NAME}" || { echo "Download failed"; exit 1; }
mkdir -p "/usr/local/lib/nextwp"
tar -xzf "/tmp/${ARCHIVE_NAME}" -C "/usr/local/lib/nextwp" || { echo "Extraction failed"; exit 1; }
rm "/tmp/${ARCHIVE_NAME}" # Clean up the downloaded archive

chmod +x "/usr/local/lib/nextwp/nextwp-cli"
ln -sf "/usr/local/lib/nextwp/nextwp-cli" /usr/local/bin/nextwp

echo "nextwp installed successfully"
