import fs from 'fs';
import path from 'path';

// Function to initialize a new OpenAPI project with example files
export default (projectName: string | undefined) => {
  // If projectName is not provided, use the current directory name
  const projectPath = projectName 
    ? path.resolve(projectName) 
    : process.cwd();

  const folderName = projectName 
    ? path.basename(projectPath) 
    : path.basename(process.cwd());

  // Create folder structure
  const folders = [
    path.join(projectPath, 'paths'),
    path.join(projectPath, 'components', 'schemas'),
    path.join(projectPath, 'components', 'securitySchemes')
  ];

  folders.forEach(folder => {
    fs.mkdirSync(folder, { recursive: true });
  });

  // Create info.yaml with the project name
  const infoContent = `openapi: 3.0.0\ninfo:\n  title: "${folderName}"\n  version: "1.0.0"`;
  fs.writeFileSync(path.join(projectPath, 'info.yaml'), infoContent);

  // Add example files
  // Example for paths/user/get.yaml
  const pathExample = `get:\n  summary: Get user information\n  responses:\n    '200':\n      description: Successful response\n      content:\n        application/json:\n          schema:\n            type: object\n            properties:\n              id:\n                type: string\n              name:\n                type: string`;
  fs.writeFileSync(path.join(projectPath, 'paths', 'user.get.yaml'), pathExample);

  // Example for components/schemas/user.yaml
  const schemaExample = `type: object\nproperties:\n  id:\n    type: string\n  name:\n    type: string\nrequired:\n  - id\n  - name`;
  fs.writeFileSync(path.join(projectPath, 'components', 'schemas', 'user.yaml'), schemaExample);

  // Example for components/securitySchemes/bearer.yaml
  const securitySchemeExample = `type: http\nscheme: bearer\nbearerFormat: JWT`;
  fs.writeFileSync(path.join(projectPath, 'components', 'securitySchemes', 'bearer.yaml'), securitySchemeExample);

  console.log(`Project "${folderName}" initialized with folder structure and example files.`);
}
