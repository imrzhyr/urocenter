import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Define required directories
const REQUIRED_DIRECTORIES = [
  'apps/web/src',
  'apps/mobile/src',
  'packages/core/api',
  'packages/core/ui',
  'packages/core/utils',
  'packages/shared/types',
  'resources/images'
];

// Define file mappings
const FILE_MAPPING = {
  'src/App.tsx': 'apps/web/src/App.tsx',
  'src/components': 'packages/core/ui/components',
  'src/services': 'packages/core/api/services',
  'src/utils': 'packages/core/utils',
  'src/types': 'packages/shared/types',
  'src/assets': 'resources/images',
  'src/hooks': 'packages/core/hooks',
  'src/contexts': 'packages/core/contexts',
  'src/lib': 'packages/core/lib',
  'src/i18n': 'packages/core/i18n',
  'src/integrations': 'packages/core/integrations',
  'src/translations': 'packages/core/translations'
};

// Define import path updates
const IMPORT_PATH_UPDATES = {
  '@/components': '@urocenter/ui/components',
  '@/hooks': '@urocenter/core/hooks',
  '@/utils': '@urocenter/core/utils',
  '@/services': '@urocenter/core/services',
  '@/contexts': '@urocenter/core/contexts',
  '@/types': '@urocenter/shared/types',
  '@/lib': '@urocenter/core/lib',
  '@/i18n': '@urocenter/core/i18n',
  '@/integrations': '@urocenter/core/integrations',
  '@/assets': '@urocenter/shared/assets',
  '@/styles': '@urocenter/ui/styles',
  '@/translations': '@urocenter/core/translations'
};

function createDirectoryStructure() {
  console.log('Creating directory structure...');
  REQUIRED_DIRECTORIES.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function updateImportPaths(content: string): string {
  let updatedContent = content;
  Object.entries(IMPORT_PATH_UPDATES).forEach(([oldPath, newPath]) => {
    const importRegex = new RegExp(`from ['"]${oldPath}(/[^'"]+)?['"]`, 'g');
    updatedContent = updatedContent.replace(importRegex, (match) => {
      return match.replace(oldPath, newPath);
    });
  });
  return updatedContent;
}

function copyDirectory(source: string, target: string) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(sourcePath, 'utf8');
      const updatedContent = updateImportPaths(content);
      fs.writeFileSync(targetPath, updatedContent);
    } else {
      // Copy non-TypeScript files as-is
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

function moveFiles() {
  console.log('Moving files to new structure...');
  Object.entries(FILE_MAPPING).forEach(([oldPath, newPath]) => {
    if (fs.existsSync(oldPath)) {
      const stat = fs.statSync(oldPath);
      
      if (stat.isDirectory()) {
        copyDirectory(oldPath, newPath);
      } else {
        const content = fs.readFileSync(oldPath, 'utf8');
        const updatedContent = updateImportPaths(content);
        fs.mkdirSync(path.dirname(newPath), { recursive: true });
        fs.writeFileSync(newPath, updatedContent);
      }
    }
  });
}

function updateTsConfig() {
  console.log('Updating TypeScript configuration...');
  const tsConfigPath = 'tsconfig.json';
  const tsConfig = {
    compilerOptions: {
      target: "ES2020",
      useDefineForClassFields: true,
      lib: ["ES2020", "DOM", "DOM.Iterable"],
      module: "ESNext",
      skipLibCheck: true,
      moduleResolution: "bundler",
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx",
      strict: false,
      noUnusedLocals: false,
      noUnusedParameters: false,
      noImplicitAny: false,
      noFallthroughCasesInSwitch: false,
      baseUrl: ".",
      paths: {
        "@urocenter/*": ["packages/*/src"]
      }
    },
    include: ["apps/**/*.ts", "apps/**/*.tsx", "packages/**/*.ts", "packages/**/*.tsx"],
    references: [{ path: "./tsconfig.node.json" }]
  };
  fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
}

async function main() {
  try {
    // Create backup branch
    console.log('Creating backup branch...');
    execSync('git checkout main');
    execSync('git branch -D backup/pre-reorganization || true');
    execSync('git checkout -b backup/pre-reorganization');

    // Run migration
    createDirectoryStructure();
    moveFiles();
    updateTsConfig();

    // Commit changes
    console.log('Committing changes...');
    execSync('git add .');
    execSync('git commit -m "refactor: reorganize project structure"');
    execSync('git checkout -b refactor/workspace-organization');

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    execSync('git checkout main');
    process.exit(1);
  }
}

main(); 