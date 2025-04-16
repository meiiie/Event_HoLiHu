/**
 * CSS Optimization Script
 * This script analyzes CSS usage and helps optimize your CSS files
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Simple color functions for console output (no dependencies)
const colors = {
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
}

// Config
const projectRoot = path.resolve(__dirname, '..');
const cssFiles = glob.sync('**/*.css', {
  cwd: projectRoot,
  ignore: ['node_modules/**', '.next/**', 'out/**']
});

console.log(colors.blue('🔍 Analyzing CSS files...'));
console.log(colors.gray(`Found ${cssFiles.length} CSS files\n`));

// Track total sizes
let totalOriginalSize = 0;
let hasIssues = false;

// Check each CSS file
cssFiles.forEach(filePath => {
  const fullPath = path.join(projectRoot, filePath);
  const content = fs.readFileSync(fullPath, 'utf8');
  const fileSize = Buffer.byteLength(content, 'utf8');
  totalOriginalSize += fileSize;
  
  console.log(colors.cyan(`📁 ${filePath}`));
  console.log(colors.gray(`   Size: ${(fileSize / 1024).toFixed(2)} KB`));
  
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
  console.log(colors.gray(`   CSS Variables: ${cssVarsCount}`));
  
  // Report issues
  if (issues.length > 0) {
    hasIssues = true;
    console.log(colors.yellow(`   Issues found:`));
    issues.forEach(issue => console.log(colors.yellow(`   ${issue}`)));
  } else {
    console.log(colors.green(`   ✅ No issues detected`));
  }
  
  console.log(''); // Empty line for spacing
});

// Import analysis
console.log(colors.blue('🔎 Analyzing CSS imports...'));
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

console.log(colors.gray(`${cssImports} CSS imports found in ${jsFiles.length} JS/TS files`));
if (cssImports < 3) {
  console.log(colors.yellow(`⚠️  Low number of CSS imports detected (${cssImports}). Consider adding more explicit CSS imports.`));
}

// Summary
console.log(colors.blue('\n📊 CSS Summary'));
console.log(colors.gray(`Total CSS size: ${(totalOriginalSize / 1024).toFixed(2)} KB`));
console.log(colors.gray(`Average file size: ${(totalOriginalSize / cssFiles.length / 1024).toFixed(2)} KB`));

if (hasIssues) {
  console.log(colors.yellow('\n⚠️  Some issues were detected. Review the output for details.'));
  console.log(colors.gray('Consider addressing these issues to improve CSS performance and maintainability.'));
} else {
  console.log(colors.green('\n✅ No significant issues found in your CSS files.'));
}

console.log(colors.blue('\n💡 Recommendations:'));
console.log(colors.gray('1. Ensure CSS is imported explicitly in components that need it'));
console.log(colors.gray('2. Consider using @import in your CSS files to organize styles'));
console.log(colors.gray('3. Add CSS variables for consistent theming'));
console.log(colors.gray('4. Use proper import order: reset → base → components → utilities'));

console.log(colors.green('\n✨ CSS analysis complete!'));
