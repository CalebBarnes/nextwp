#!/bin/bash
# * This script is used for local development of the NextWP Toolkit plugin.

# This bash script creates or removes a symlink between the monorepo's 
# wordpress/plugins/nextwp-toolkit directory and the plugins directory of your local WordPress installation.
# The user should provide the action (create/remove) and the path to their WordPress plugins directory as arguments.

# Example usage: ./scripts/symlink-nextwp-toolkit-plugin.sh create /path/to/wordpress/wp-content/plugins

# Check if correct number of arguments is provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 [create|remove] /path/to/wordpress/wp-content/plugins"
    exit 1
fi

ACTION=$1
WP_PLUGIN_DIR=$2

# Resolve the absolute path to the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
echo "Script directory: $SCRIPT_DIR"

# Full path for the nextwp-toolkit directory in the monorepo
MONOREPO_NEXTWP_TOOLKIT_PATH="$SCRIPT_DIR/../wordpress/plugins/nextwp-toolkit"
echo "Monorepo nextwp-toolkit directory: $MONOREPO_NEXTWP_TOOLKIT_PATH"

# Full path for the nextwp-toolkit symlink in the WordPress plugins directory
NEXTWP_TOOLKIT_PATH="$WP_PLUGIN_DIR/nextwp-toolkit"
echo "Symlink path: $NEXTWP_TOOLKIT_PATH"

if [ "$ACTION" = "create" ]; then
    # Check if the symlink already exists
    if [ -L "$NEXTWP_TOOLKIT_PATH" ]; then
        echo "Symlink already exists at $NEXTWP_TOOLKIT_PATH"
        exit 1
    else
        # Create symlink
        ln -s "$MONOREPO_NEXTWP_TOOLKIT_PATH" "$NEXTWP_TOOLKIT_PATH"
        echo "Symlink created at $NEXTWP_TOOLKIT_PATH"
    fi
elif [ "$ACTION" = "remove" ]; then
    # Check if the symlink exists
    if [ -L "$NEXTWP_TOOLKIT_PATH" ]; then
        # Remove symlink
        rm "$NEXTWP_TOOLKIT_PATH"
        echo "Symlink removed from $NEXTWP_TOOLKIT_PATH"
    else
        echo "No symlink exists at $NEXTWP_TOOLKIT_PATH"
    fi
else
    echo "Invalid action: $ACTION. Use 'create' or 'remove'."
    exit 1
fi
