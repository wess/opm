#!/usr/bin/env bun
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';

import { 
  Init,
  Build,
  Serve 

} from './command';


// Read version from package.json
const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const version = packageJson.version;

const program = new Command();

program
  .name('opm')
  .description('OpenAPI Project Manager (opm) - Manage OpenAPI projects easily.')
  .version(version);

// Initialize a new OpenAPI project
program
  .command('init [projectName]')  // Optional projectName
  .description('Initialize a new OpenAPI project with structured folders')
  .action((projectName) => {
    Init(projectName);
  });
  
// Build the final openapi.yaml file
program
  .command('build')
  .description('Generate the final openapi.yaml file from your project structure')
  .action(Build);

// Serve the mock API with an optional port, default to 3000
program
  .command('serve')
  .description('Start a mock REST API based on the openapi.yaml')
  .option('--port <port>', 'Port to run the server on', '3000')  // Default is still '3000'
  .action((options) => {
    const port = options.port ? parseInt(options.port, 10) : 3000;  // Default to port 3000
    if (isNaN(port)) {
      console.error('Invalid port number. Using default port 3000.');
      Serve(3000);
    } else {
      Serve(port);
    }
  });

// Parse the arguments
program.parse(process.argv);
