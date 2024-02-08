#!/bin/bash
export VERSION=$(git describe --tags --match "nextwp-cli-*" --always --dirty="-dev")
mkdir -p tmp/js
cp js/format.js tmp/js/format.js
go build -ldflags "-X main.version=$VERSION" -o ./tmp/main ./cmd/app