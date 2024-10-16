import fs from 'fs';
import path from 'path';
import { serve } from 'bun';
import yaml from 'js-yaml';
import chokidar from 'chokidar';
import Logger from '../lib/logger';

// Function to generate a temporary openapi.yaml file in .tmp folder
function generateTempOpenAPI(): string {
  const projectPath = process.cwd();
  const tmpPath = path.join(projectPath, '.tmp');
  const tmpOpenapiPath = path.join(tmpPath, 'openapi.yaml');

  if (!fs.existsSync(tmpPath)) {
    fs.mkdirSync(tmpPath, { recursive: true });
  }

  // Load info.yaml if it exists, otherwise create basic info
  const infoPath = path.join(projectPath, 'info.yaml');
  let infoData = {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0'
    }
  };

  if (fs.existsSync(infoPath)) {
    const infoContent = fs.readFileSync(infoPath, 'utf8');
    infoData = yaml.load(infoContent) as { openapi: string; info: { title: string; version: string } };
  }

  // Collect paths from the paths/ folder
  const pathsDir = path.join(projectPath, 'paths');
  const paths: Record<string, any> = {};
  if (fs.existsSync(pathsDir)) {
    fs.readdirSync(pathsDir).forEach((file) => {
      const filePath = path.join(pathsDir, file);
      const routeName = `/${file.split('.')[0]}`;
      paths[routeName] = yaml.load(fs.readFileSync(filePath, 'utf8'));
    });
  }

  // Collect schemas from components/schemas
  const schemasDir = path.join(projectPath, 'components', 'schemas');
  const schemas: Record<string, any> = {};
  if (fs.existsSync(schemasDir)) {
    fs.readdirSync(schemasDir).forEach((file) => {
      const schemaName = file.split('.')[0];
      schemas[schemaName] = yaml.load(fs.readFileSync(path.join(schemasDir, file), 'utf8'));
    });
  }

  // Create OpenAPI structure
  const openapiSpec = {
    openapi: '3.0.0',
    info: infoData.info,
    paths,
    components: {
      schemas
    }
  };

  // Write the temporary openapi.yaml to the .tmp folder
  fs.writeFileSync(tmpOpenapiPath, yaml.dump(openapiSpec));
  Logger.success(`Temporary openapi.yaml generated at ${tmpOpenapiPath}`);

  return tmpOpenapiPath;
}

// Function to start the mock server
export default (port: number = 3000) => {
  const tmpOpenapiPath = generateTempOpenAPI();

  // Function to start the Bun server
  const startServer = () => {
    // Read and parse openapi.yaml from the .tmp folder
    const openapiSpec = fs.readFileSync(tmpOpenapiPath, 'utf8');
    let openapi;
    
    try {
      openapi = yaml.load(openapiSpec) as any;
    } catch (err) {
      Logger.error(`Error parsing openapi.yaml: ${err.message}`);
      process.exit(1);
    }

    const routes = openapi.paths;

    // Define the mock server
    serve({
      port, // Use the port argument
      fetch(req) {
        const method = req.method.toLowerCase(); // Get the method from the request (e.g., GET, POST)
        const { pathname } = new URL(req.url);   // Get the pathname from the URL

        // Match incoming request to OpenAPI paths
        const route = Object.keys(routes).find((route) => {
          return pathname === route;
        });

        if (route && routes[route][method]) {
          const mockResponse = {
            message: `Mock response for ${method.toUpperCase()} ${pathname}`
          };
          return new Response(JSON.stringify(mockResponse), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } else {
          return new Response('Route not found', { status: 404 });
        }
      },
    });

    Logger.info(`Mock API server running at http://localhost:${port}`);
  };

  // Watch for changes in openapi.yaml, paths/, and components/ directories
  const watcher = chokidar.watch([path.join(process.cwd(), 'paths'), path.join(process.cwd(), 'components'), path.join(process.cwd(), 'info.yaml')], {
    persistent: true,
  });

  let serverRunning = false;
  watcher.on('change', (filePath) => {
    Logger.warning(`\nFile changed: ${filePath}. Regenerating openapi.yaml and restarting server...`);
    generateTempOpenAPI();  // Regenerate the temporary openapi.yaml
    if (serverRunning) {
      serverRunning = false;
      startServer();  // Restart the server on file change
      serverRunning = true;
    }
  });

  startServer();  // Initial server start
}
