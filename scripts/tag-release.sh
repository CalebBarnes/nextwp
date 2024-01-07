#!/bin/bash
TAG_NAME=$1
if [ -z "$TAG_NAME" ]; then
    echo "Tag name required."
    exit 1
fi
git tag $TAG_NAME
git push origin $TAG_NAME
