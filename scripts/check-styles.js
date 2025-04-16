/**
 * Script để kiểm tra CSS trong dự án
 * Chạy bằng lệnh: node scripts/check-styles.js
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔍 Kiểm tra CSS trong dự án...');

// Tìm tất cả các file CSS
const cssFiles = glob.sync('**/*.css', {
  ignore: ['node_modules/**', '.next/**', 'out/**']
});

console.log(`📋 Đã tìm thấy ${cssFiles.length} file CSS`);

// Tìm tất cả các file JavaScript/TypeScript
const jsFiles = glob.sync('**/*.{js,jsx,ts,tsx}', {
  ignore: ['node_modules/**', '.next/**', 'out/**', 'scripts/**']
});

console.log(`📋 Đã tìm thấy ${jsFiles.length} file JS/TS`);

// Kiểm tra import của CSS trong các file JavaScript/TypeScript
let cssImports = 0;
jsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const importMatches = content.match(/import\s+['"].*\.css['"]/g) || [];
  cssImports += importMatches.length;
});

console.log(`📊 Tổng số import CSS: ${cssImports}`);

// Kiểm tra các class Tailwind được sử dụng
let tailwindClasses = new Set();
jsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const classMatches = content.match(/className=['"](.*?)['"]/g) || [];
  classMatches.forEach(match => {
    const classNames = match.replace(/className=['"]/, '').replace(/['"]$/, '').split(/\s+/);
    classNames.forEach(className => tailwindClasses.add(className));
  });
});

console.log(`📊 Số lượng class được sử dụng: ${tailwindClasses.size}`);

// Kiểm tra các file CSS có được import trong _app.js hoặc layout.tsx không
const layoutFiles = glob.sync('**/layout.tsx');
let hasGlobalCssImport = false;

layoutFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('import') && content.includes('globals.css')) {
    hasGlobalCssImport = true;
    console.log(`✅ globals.css được import trong ${file}`);
  }
});

if (!hasGlobalCssImport) {
  console.log('❌ Không tìm thấy import globals.css trong layout.tsx');
} 

console.log('✨ Kiểm tra hoàn tất!');
