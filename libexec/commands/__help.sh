#!/usr/bin/env bash

# Define an associative array to hold command names and definitions
declare -A commands=(
  ["init"]="Initialize a new OpenAPI project."
  ["build"]="Generate openapi.yaml."
  ["clean"]="Clean the OpenAPI project."
)

# Function to display the help output
display_help() {
  echo "Usage: opm [command]"
  echo
  echo "Commands:"
  
  # Loop through the associative array and display command names and definitions
  for command in "${!commands[@]}"; do
    definition="${commands[$command]}"
    printf "  %-15s %s\n" "$command" "$definition"
  done
}

# Check if a command is provided as an argument
if [[ $# -eq 0 ]]; then
  display_help
else
  # Get the command name from the first argument
  command_name="$1"
  
  # Check if the command exists in the associative array
  if [[ -v commands["$command_name"] ]]; then
    definition="${commands[$command_name]}"
    printf "Definition of '%s': %s\n" "$command_name" "$definition"
  else
    echo "Command not found: $command_name"
    echo
    display_help
    exit 1
  fi
fi

echo