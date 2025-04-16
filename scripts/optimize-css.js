/**
 * CSS Optimization Script
 * This script analyzes CSS usage and helps optimize your CSS files
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

// Config
const projectRoot = path.resolve(__dirname, '..');
const cssFiles = glob.sync('**/*.css', {
  cwd: projectRoot,
  ignore: ['node_modules/**', '.next/**', 'out/**']
});

console.log(chalk.blue('🔍 Analyzing CSS files...'));
console.log(chalk.gray(`Found ${cssFiles.length} CSS files\n`));

// Track total sizes
let totalOriginalSize = 0;
let hasIssues = false;

// Check each CSS file
cssFiles.forEach(filePath => {
  const fullPath = path.join(projectRoot, filePath);
  const content = fs.readFileSync(fullPath, 'utf8');
  const fileSize = Buffer.byteLength(content, 'utf8');
  totalOriginalSize += fileSize;
  
  console.log(chalk.cyan(`📁 ${filePath}`));
  console.log(chalk.gray(`   Size: ${(fileSize / 1024).toFixed(2)} KB`));
  
  // Check for potential issues
  const issues = [];
  
  // Check for !important declarations
  const importantCount = (content.match(/!important/g) || []).length;
  if (importantCount > 0) {
    issues.push(`⚠️  Contains ${importantCount} !important declarations`);
  }
  
  // Check for large media queries
  const mediaQueriesCount = (content.match(/@media/g) || []).length;
  if (mediaQueriesCount > 10) {
    issues.push(`⚠️  Contains ${mediaQueriesCount} media queries (consider consolidating)`);
  }
  
  // Check for unused or duplicated selectors (simplified check)
  const selectors = content.match(/([.#][a-zA-Z0-9_-]+)\s*\{/g) || [];
  const uniqueSelectors = new Set(selectors);
  if (selectors.length > uniqueSelectors.size) {
    issues.push(`⚠️  May contain ${selectors.length - uniqueSelectors.size} duplicated selectors`);
  }
  
  // Check for CSS variables
  const cssVarsCount = (content.match(/var\(--[a-zA-Z0-9_-]+\)/g) || []).length;
  console.log(chalk.gray(`   CSS Variables: ${cssVarsCount}`));
  
  // Report issues
  if (issues.length > 0) {
    hasIssues = true;
    console.log(chalk.yellow(`   Issues found:`));
    issues.forEach(issue => console.log(chalk.yellow(`   ${issue}`)));
  } else {
    console.log(chalk.green(`   ✅ No issues detected`));
  }
  
  console.log(''); // Empty line for spacing
});

// Import analysis
console.log(chalk.blue('🔎 Analyzing CSS imports...'));
const jsFiles = glob.sync('**/*.{js,jsx,ts,tsx}', {
  cwd: projectRoot,
  ignore: ['node_modules/**', '.next/**', 'out/**', 'scripts/**']
});

// Count CSS imports
let cssImports = 0;
jsFiles.forEach(file => {
  const content = fs.readFileSync(path.join(projectRoot, file), 'utf8');
  const importMatches = content.match(/import\s+['"].*\.css['"]/g) || [];
  cssImports += importMatches.length;
});

console.log(chalk.gray(`${cssImports} CSS imports found in ${jsFiles.length} JS/TS files`));
if (cssImports < 3) {
  console.log(chalk.yellow(`⚠️  Low number of CSS imports detected (${cssImports}). Consider adding more explicit CSS imports.`));
}

// Summary
console.log(chalk.blue('\n📊 CSS Summary'));
console.log(chalk.gray(`Total CSS size: ${(totalOriginalSize / 1024).toFixed(2)} KB`));
console.log(chalk.gray(`Average file size: ${(totalOriginalSize / cssFiles.length / 1024).toFixed(2)} KB`));

if (hasIssues) {
  console.log(chalk.yellow('\n⚠️  Some issues were detected. Review the output for details.'));
  console.log(chalk.gray('Consider addressing these issues to improve CSS performance and maintainability.'));
} else {
  console.log(chalk.green('\n✅ No significant issues found in your CSS files.'));
}

console.log(chalk.blue('\n💡 Recommendations:'));
console.log(chalk.gray('1. Ensure CSS is imported explicitly in components that need it'));
console.log(chalk.gray('2. Consider using @import in your CSS files to organize styles'));
console.log(chalk.gray('3. Add CSS variables for consistent theming'));
console.log(chalk.gray('4. Use proper import order: reset → base → components → utilities'));

console.log(chalk.green('\n✨ CSS analysis complete!'));
