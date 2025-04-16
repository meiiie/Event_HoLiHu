# Khắc phục sự cố CSS trong Next.js và Tailwind

## Vấn đề phổ biến

1. **CSS không được áp dụng mặc dù file CSS được tải**
   - Có thể do class names không được tạo đúng hoặc xung đột giữa các files CSS

2. **Tailwind directives (@tailwind) không hoạt động**
   - Cần kiểm tra cấu hình PostCSS và Tailwind

3. **Phối màu không nhất quán**
   - Thiếu hoặc xung đột CSS variables

## Quy trình khắc phục

### 1. Xóa cache

```bash
# Xóa cache Next.js
rm -rf .next

# Xóa cache Node.js
rm -rf node_modules/.cache

# Khởi động lại server
npm run dev
```

### 2. Kiểm tra imports

Đảm bảo thứ tự imports CSS đúng trong file globals.css:

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

### 3. Kiểm tra cài đặt của các package cần thiết

```bash
npm install -D tailwindcss postcss autoprefixer postcss-import
```

### 4. Chế độ dev vs production

Styles có thể khác nhau giữa chế độ development và production. Hãy thử build và chạy ở chế độ production:

```bash
npm run build
npm run start
```

### 5. Browser Developer Tools

Sử dụng Chrome DevTools để:
- Kiểm tra xem CSS có được tải không (tab Network)
- Kiểm tra xem classes có được áp dụng không (tab Elements)
- Kiểm tra xem CSS rules có bị ghi đè không (tab Styles)

### 6. Thêm styles inline để xác định vấn đề

```tsx
<div style={{ border: '2px solid red' }}>Test</div>
```

Nếu styles inline hoạt động nhưng Tailwind không, vấn đề có thể là ở cấu hình Tailwind.
