
# OPM - OpenAPI Project Manager

OPM is a CLI tool designed to help manage OpenAPI projects in a folder-friendly and structured way. It allows you to initialize, build, and serve OpenAPI projects with ease.

## Features

- Initialize new OpenAPI projects
- Build OpenAPI specifications
- Serve mock REST/Web API based on OpenAPI specifications
- Supports both npm and Bun package managers
- Package and upload releases to npm or Homebrew

## Installation

### Using npm

```bash
npm install -g opm
```

### Using Bun

```bash
bun install -g opm
```

## Usage

### Initialize a new OpenAPI project

```bash
opm init <projectName>
```

If no project name is provided, the current directory will be used.

### Build OpenAPI specification

```bash
opm build
```

This command generates the final `openapi.yaml` file based on your project structure.

### Serve a mock API

```bash
opm serve --port <port>
```

By default, the server runs on port 3000.


## License

This project is licensed under the MIT License.
