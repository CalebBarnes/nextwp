#!/bin/bash

# This bash script creates a symlink from the nextwp-toolkit plugin 
# to the plugins folder of your local development WordPress site. 
# The user should provide the path to their WordPress plugins directory as an argument.

# Check if argument is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 /path/to/wordpress/wp-content/plugins"
    exit 1
fi

# User provided WordPress plugins directory path
WP_PLUGIN_DIR=$1

# Full path for the nextwp-toolkit symlink
NEXTWP_TOOLKIT_PATH="$WP_PLUGIN_DIR/nextwp-toolkit"

# Create symlink
ln -s /wordpress/plugins/nextwp-toolkit "$NEXTWP_TOOLKIT_PATH"

echo "Symlink created at $NEXTWP_TOOLKIT_PATH"
