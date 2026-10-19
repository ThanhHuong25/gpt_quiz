# Ebook quiz landing page — Thanh Hương

Landing page tiếng Việt kết hợp bài trắc nghiệm cá nhân hóa và giới thiệu hai ebook.

## Stack
- Next.js 15 + React 19 + TypeScript
- CSS thuần, responsive
- Có thể triển khai trên Vercel

## Chạy trên máy

Yêu cầu Node.js 20.9 trở lên.

```bash
npm install
npm run dev
```

Mở http://localhost:3000.

Kiểm tra bản build:

```bash
npm run build
```

## Đưa lên GitHub và Vercel

1. Tạo repository mới trên GitHub.
2. Giải nén bộ mã nguồn này vào thư mục dự án.
3. Mở Terminal tại thư mục dự án và chạy:

```bash
git init
git add .
git commit -m "Initial ebook quiz landing page"
git branch -M main
git remote add origin https://github.com/TEN-TAI-KHOAN/TEN-REPOSITORY.git
git push -u origin main
```

4. Vào Vercel, chọn **Add New → Project**, kết nối GitHub và import repository.
5. Vercel thường tự nhận diện Next.js. Chọn Deploy.

## Những nội dung cần hoàn thiện trước khi mở bán

- Thay `metadataBase` trong `app/layout.tsx` từ `https://example.com` sang tên miền thật.
- Thay ảnh bìa minh họa trong component `BookCover` bằng bìa ebook chính thức (hiện tại bìa được dựng bằng CSS).
- Cập nhật nội dung mô tả sách theo bản ebook đã chốt.
- Thêm đường dẫn YouTube thật cho bài thiền “Lắng nghe nhịp điệu bên trong”.
- Tích hợp cổng thanh toán và quy trình gửi ebook an toàn. Hiện các nút mua chỉ là điểm neo/CTA minh họa, chưa thu tiền và chưa gửi file.
- Thêm email, chính sách quyền riêng tư và điều khoản cần thiết.
- Không commit file ebook đầy đủ vào repository GitHub công khai.

## Quy tắc chấm điểm quiz

Mỗi phương án cộng điểm vào các nhóm A, B, C, D. Có thể nổi bật nhiều nhóm cùng lúc.

- Nhóm nổi bật nếu đạt **ít nhất 12 điểm** và **tối thiểu 70% điểm cao nhất** trong bốn nhóm.
- Không có nhóm đạt ngưỡng: hiển thị kết quả “Giai đoạn khám phá”.
- A — Tìm lại sự vững vàng → Bản lĩnh tĩnh lặng.
- B — Hiểu mình và những phản ứng của mình → Bản lĩnh tĩnh lặng.
- C — Tìm nhịp điệu riêng → Sổ tay vũ trụ cá nhân.
- D — Buông bớt kiểm soát và sống có chủ đích → Bản lĩnh tĩnh lặng.
- Nếu nhiều nhóm nổi bật dẫn đến cùng một ebook, ebook đó là gợi ý chính. Nếu các nhóm nổi bật dẫn đến hai ebook khác nhau, hiển thị cả hai như lựa chọn ngang hàng; bộ đôi là lựa chọn mở rộng, không tự động ép mua combo.

## Giá đang thiết lập

| Sản phẩm | Giá niêm yết | Giá ra mắt dự kiến |
|---|---:|---:|
| Bản lĩnh tĩnh lặng | 89.000đ | 69.000đ |
| Sổ tay vũ trụ cá nhân | 79.000đ | 59.000đ |
| Bộ đôi Trở về với chính mình | 149.000đ | 119.000đ |

Giá và nội dung tập trung tại `lib/quiz.ts` để tiện chỉnh sửa.
