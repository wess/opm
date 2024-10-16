import fs from 'fs';
import path from 'path';

export default () => {
  const projectPath = process.cwd();

  // Read the info.yaml
  const info = fs.readFileSync(path.join(projectPath, 'info.yaml'), 'utf8');

  // Gather paths
  const pathsDir = path.join(projectPath, 'paths');
  const paths: Record<string, any> = {};

  fs.readdirSync(pathsDir).forEach((subDir) => {
    const fullPath = path.join(pathsDir, subDir);
    fs.readdirSync(fullPath).forEach((methodFile) => {
      const method = methodFile.split('.')[0];  // e.g., get, post
      const route = `/${subDir}`;               // e.g., /user
      paths[route] = { [method]: fs.readFileSync(path.join(fullPath, methodFile), 'utf8') };
    });
  });

  // Read components
  const schemasDir = path.join(projectPath, 'components', 'schemas');
  const schemas: Record<string, any> = {};
  fs.readdirSync(schemasDir).forEach((schemaFile) => {
    const schemaName = schemaFile.split('.')[0];  // e.g., User
    schemas[schemaName] = fs.readFileSync(path.join(schemasDir, schemaFile), 'utf8');
  });

  const openapiSpec = {
    ...JSON.parse(info),
    paths,
    components: { schemas }
  };

  fs.writeFileSync(path.join(projectPath, 'openapi.yaml'), JSON.stringify(openapiSpec, null, 2));

  console.log('openapi.yaml built successfully.');
}
