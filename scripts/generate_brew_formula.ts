import fs from 'fs';
import path from 'path';

// Read package.json to get the version
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// Define repo details
const repoUrl = 'https://github.com/wess/opm';
const formulaPath = path.join(__dirname, '../dist/brew/opm.rb');

// Read the SHA256 from the generated text file
const sha256Path = path.join(__dirname, '../dist/brew/sha256.txt');
const sha256 = fs.readFileSync(sha256Path, 'utf8').split(' ')[0];

// Generate the Homebrew formula
const formula = `class Opm < Formula
  desc "A CLI app to manage OpenAPI projects"
  homepage "${repoUrl}"
  url "${repoUrl}/releases/download/v${version}/opm.tar.gz"
  sha256 "${sha256}"
  version "${version}"

  def install
    bin.install "opm"
  end
end
`;

// Write the formula to the brew folder
fs.writeFileSync(formulaPath, formula);
console.log(`Homebrew formula generated at ${formulaPath}`);
