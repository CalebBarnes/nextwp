# create-nextwp-app

[![npm version](https://badge.fury.io/js/create-nextwp-app.svg?v=1.1)](https://badge.fury.io/js/create-nextwp-app) ![npm](https://img.shields.io/npm/dw/create-nextwp-app?v=1.1)

`create-nextwp-app` is a cross platform CLI tool designed for rapidly setting up NextWP projects, streamlining the development of Headless WordPress sites using Next.js. It provides a quick and automated process to initialize a starter project.

## Usage

Create a new NextWP project with:

```bash
npx create-nextwp-app project-name
```

If no project name is provided, you will be prompted to enter one.

## Components

### main.go

This Go file is the core of the CLI tool. It handles project initialization, including cloning the repository, setting up directories, and preparing the project environment.

### create-nextwp-app.js

This JavaScript file serves as the main CLI entry point. It identifies the user's OS and executes the appropriate binary file, ensuring cross-platform compatibility.

### postinstall script.js

This script automatically runs post-installation to configure the tool based on the user's OS. It detects the OS (macOS, Linux, or Windows) and sets up the corresponding executable.

## Troubleshooting

If you encounter issues during installation or usage, please check the following:

- Ensure you have the correct permissions to install global npm packages.
- Verify your Node.js and npm versions are up to date.
- For specific errors, refer to the error log and follow the provided instructions.
  For more help, visit our [GitHub repository](https://github.com/CalebBarnes/nextwp) or submit an issue.

### bin directory

**create-nextwp-app.js**: The main cli entrypoint.

- Detects the OS Platform and executes the apprioriate binary.
