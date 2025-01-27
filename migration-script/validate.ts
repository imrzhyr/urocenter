import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REQUIRED_DIRECTORIES = [
  'apps/web/src',
  'apps/mobile/src',
  'packages/core/api',
  'packages/core/ui',
  'packages/core/utils',
  'packages/shared/types',
  'resources/images'
];

async function validateDirectoryStructure() {
  console.log('Validating directory structure...');
  for (const dir of REQUIRED_DIRECTORIES) {
    try {
      const stat = await fs.stat(dir);
      if (!stat.isDirectory()) {
        throw new Error(`${dir} exists but is not a directory`);
      }
    } catch (error) {
      throw new Error(`Required directory ${dir} does not exist`);
    }
  }
}

async function getAllFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const items = await fs.readdir(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = await fs.stat(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...await getAllFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function validateImports() {
  console.log('Validating imports...');
  const oldStyleImports: string[] = [];
  
  const directories = [
    'apps/web/src',
    'packages/core/api',
    'packages/core/ui',
    'packages/core/utils',
    'packages/shared/types'
  ];
  
  for (const dir of directories) {
    try {
      const files = await getAllFiles(dir);
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        if (content.includes('@/')) {
          oldStyleImports.push(`${file}: contains old style imports`);
        }
      }
    } catch (error) {
      console.error(`Error processing directory ${dir}:`, error);
    }
  }
  
  if (oldStyleImports.length > 0) {
    throw new Error('Found old style imports:\n' + oldStyleImports.join('\n'));
  }
}

async function validateTypeScript(): Promise<void> {
  try {
    await execAsync('npx tsc --noEmit');
  } catch (error) {
    throw new Error('TypeScript validation failed');
  }
}

async function validateBuild(): Promise<void> {
  try {
    await execAsync('npm run build');
  } catch (error) {
    throw new Error('Build validation failed');
  }
}

async function main() {
  try {
    console.log('Starting validation...');
    await validateDirectoryStructure();
    await validateImports();
    await validateTypeScript();
    await validateBuild();
    console.log('Validation completed successfully!');
  } catch (error) {
    console.error('Validation failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main(); 