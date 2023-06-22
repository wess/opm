#!/usr/bin/env bash

CWD=$(pwd)

SRC="$CWD/src"
PATHS="$SRC/paths"
SCHEMAS="$SRC/schemas"

define EXAMPLE_INFO <<EOF
title: YourProject
version: 0.0.0
description: |-
  A description of your OpenApi Project
contact:
  email: wess@openvendor.io
license:
  name: Some License
  url: https://site/for/license

EOF

define EXAMPLE_PATH <<EOF
/:
  get:
    summary: 'Get a user by ID'
    operationId: 'someHandler'
    responses:
      '200':
        description: 'Successful operation'
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SchemaExample'
      '404':
        description: 'Not found'
EOF

define EXAMPLE_SCHEMA <<EOF
SchemaExample:
  type: object
  properties:
    example:
      type: string
      description: For an example schema.
      example: testing

EOF

echo "Initializing OpenAPI project..." | status

# Create directories
function create_dir() {
  folder_paths=("$@")

  for folder_path in "${folder_paths[@]}"; do
    if [[ ! -d $folder_path ]]; then
      mkdir -p $folder_path
    fi
  done
}

folders=(
  "$SRC"
  "$PATHS"
  "$SCHEMAS"
)

create_dir "${folders[@]}"

touch "$SRC/info.yaml"
echo "$EXAMPLE_INFO" > "$SRC/info.yaml"

touch "$PATHS/example.yaml"
echo "$EXAMPLE_PATH" > "$PATHS/example.yaml"

touch "$SCHEMAS/example.yaml"
echo "$EXAMPLE_SCHEMA" > "$SCHEMAS/example.yaml"