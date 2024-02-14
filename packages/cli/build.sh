VERSION=$(git describe --tags --match "nextwp-cli-*" --always --dirty="-dev")
go build -ldflags "-X main.version=$VERSION" -o nextwp-cli ./cmd/app
