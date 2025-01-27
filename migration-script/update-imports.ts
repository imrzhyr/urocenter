import fs from 'fs';
import path from 'path';

const IMPORT_PATH_UPDATES: Record<string, string> = {
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

function updateImportsInFile(filePath: string): void {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Update import paths
    for (const [oldPath, newPath] of Object.entries(IMPORT_PATH_UPDATES)) {
      const importRegex = new RegExp(`from ['"]${oldPath}(/[^'"]+)?['"]`, 'g');
      if (importRegex.test(content)) {
        content = content.replace(importRegex, (match) => {
          hasChanges = true;
          return match.replace(oldPath, newPath);
        });
      }
    }

    // Only write if changes were made
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated imports in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating imports in ${filePath}:`, error);
  }
}

function processDirectory(dir: string): void {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules and other special directories
      if (!['node_modules', '.git', 'dist'].includes(file)) {
        processDirectory(fullPath);
      }
    } else if (file.match(/\.(ts|tsx)$/)) {
      updateImportsInFile(fullPath);
    }
  }
}

// Start processing from the apps/web/src directory
const srcDir = path.join(process.cwd(), 'apps/web/src');
console.log('Starting import path updates...');
processDirectory(srcDir);
console.log('Import path updates completed.'); 