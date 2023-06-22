#!/usr/bin/env bash

echo "Compiling OpenAPI specification..." | status

# Basic OpenAPI object
openapi='{"openapi":"3.0.3"}'

# Process Info
INFO_FILE="$SOURCE_DIR/info.yaml"

# Process the info file
if [[ -f ${INFO_FILE} ]]; then
  info=$(yq e -o=json ${INFO_FILE})
  openapi=$(echo ${openapi} | jq --argjson new "${info}" '.info = $new')
else
  echo "${INFO_FILE} does not exist. Using default info."
  info='{"title":"API","version":"1.0.0"}'
  openapi=$(echo ${openapi} | jq --argjson new "${info}" '.info = $new')
fi

# Merge paths
for file in $PATHS_DIR/*; do
  if [[ $file == *.yaml ]] || [[ $file == *.yml ]]; then
    content=$(yq e -o=json $file)
    openapi=$(echo $openapi | jq --argjson new "$content" '.paths += $new')
  fi
done

# Merge schemas
for file in $SCHEMAS_DIR/*; do
  if [[ $file == *.yaml ]] || [[ $file == *.yml ]]; then
    content=$(yq e -o=json $file)
    openapi=$(echo $openapi | jq --argjson new "$content" '.components.schemas += $new')
  fi
done

# Convert back to YAML and save
echo $openapi | yq e -P > $OUTPUT_FILE

echo "OpenAPI specification has been written to $OUTPUT_FILE" | success
