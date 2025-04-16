#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('🔍 Kiểm tra và sửa các vấn đề CSS...');

// 1. Xóa cache
console.log('🧹 Đang xóa cache...');
try {
  if (fs.existsSync(path.join(process.cwd(), '.next'))) {
    fs.rmSync(path.join(process.cwd(), '.next'), { recursive: true });
    console.log('  ✅ Đã xóa thư mục .next');
  }
  
  if (fs.existsSync(path.join(process.cwd(), 'node_modules', '.cache'))) {
    fs.rmSync(path.join(process.cwd(), 'node_modules', '.cache'), { recursive: true });
    console.log('  ✅ Đã xóa node_modules/.cache');
  }
} catch (err) {
  console.error('  ❌ Lỗi khi xóa cache:', err);
}

// 2. Kiểm tra các file tài nguyên
console.log('🖼️ Kiểm tra các file tài nguyên...');
const requiredFiles = [
  'public/favicon.ico',
  'public/favicon-16x16.png', 
  'public/apple-touch-icon.png',
  'public/logo-holihu.jpg'
];

for (const file of requiredFiles) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.log(`  ❌ Thiếu file ${file}. Đang tạo file trống...`);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Tạo file trống
    fs.writeFileSync(filePath, '');
    console.log(`  ✅ Đã tạo file ${file}`);
  } else {
    console.log(`  ✅ File ${file} đã tồn tại`);
  }
}

// 3. Kiểm tra và cài đặt các dependency cần thiết
console.log('📦 Kiểm tra các dependency...');
exec('npm install -D tailwindcss postcss autoprefixer postcss-import', (error, stdout, stderr) => {
  if (error) {
    console.error(`  ❌ Lỗi khi cài đặt packages: ${error.message}`);
    return;
  }
  console.log('  ✅ Đã cài đặt các dependency cần thiết');
  
  // 4. Khởi động lại server
  console.log('🚀 Khởi động lại server...');
  exec('npm run dev', (error, stdout, stderr) => {
    if (error) {
      console.error(`  ❌ Lỗi khi khởi động server: ${error.message}`);
      return;
    }
    console.log('  ✅ Server đang chạy');
    console.log('✅ Hoàn tất! Vui lòng kiểm tra ứng dụng của bạn.');
  });
});
