#!/bin/bash

# ! Warning: This script will create and push a tag to the remote repository.
# ! This will trigger a new release on GitHub via the GitHub Actions workflow "release-wp-plugins-and-themes.yml"

TAG_NAME=$1
if [ -z "$TAG_NAME" ]; then
    echo "Tag name required."
    exit 1
fi
git tag $TAG_NAME
git push origin $TAG_NAME
