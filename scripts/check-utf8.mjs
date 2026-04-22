import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const ignoredDirs = new Set(['.git', '.vite', '.vscode', 'dist', 'node_modules']);
const textExtensions = new Set([
  '.css',
  '.env',
  '.example',
  '.gitignore',
  '.gitattributes',
  '.editorconfig',
  '.html',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mjs',
  '.ts',
  '.tsx',
  '.txt',
  '.yaml',
  '.yml',
]);
const explicitFiles = new Set([
  '.env.example',
  '.gitignore',
  '.gitattributes',
  '.editorconfig',
]);

const decoder = new TextDecoder('utf-8', { fatal: true });

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (ignoredDirs.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (textExtensions.has(ext) || explicitFiles.has(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function checkFile(filePath) {
  const buffer = await readFile(filePath);
  decoder.decode(buffer);

  if (buffer.includes(0)) {
    throw new Error('contains NUL byte');
  }
}

async function main() {
  const files = await collectFiles(rootDir);
  const failures = [];

  for (const filePath of files) {
    try {
      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) {
        continue;
      }
      await checkFile(filePath);
    } catch (error) {
      failures.push({
        filePath: path.relative(rootDir, filePath),
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (failures.length > 0) {
    console.error('UTF-8 check failed for these files:');
    for (const failure of failures) {
      console.error(`- ${failure.filePath}: ${failure.message}`);
    }
    process.exit(1);
  }

  console.log(`UTF-8 check passed for ${files.length} files.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
