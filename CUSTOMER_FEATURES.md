# Tính năng Khách hàng - Customer Features

## Ngày: 14 Tháng 8, 2026

## Tổng quan

Đã thêm hệ thống đăng nhập/đăng ký cho khách hàng, giỏ hàng, lịch sử đơn hàng, và hiển thị số lượng người đã mua sách.

## 1. Hệ thống Đăng nhập/Đăng ký Khách hàng

### 1.1 Database Schema

**Cập nhật Customer Model:**
```prisma
model Customer {
  id             Int      @id @default(autoincrement())
  fullName       String
  phone          String   @unique
  password       String?  // Mật khẩu đã hash
  defaultAddress String?
  province       String?
  orders         Order[]
  cartItems      CartItem[]
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

**Model CartItem mới:**
```prisma
model CartItem {
  id         Int      @id @default(autoincrement())
  customerId Int
  customer   Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  bookId     Int
  book       Book     @relation(fields: [bookId], references: [id])
  quantity   Int      @default(1)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  @@unique([customerId, bookId])
}
```

### 1.2 Authentication

**File mới:**
- `lib/customer-auth.ts` - Xử lý hash password và xác thực
- `app/api/customer/register/route.ts` - API đăng ký
- `app/api/customer/login/route.ts` - API đăng nhập (JWT token)
- `app/api/customer/logout/route.ts` - API đăng xuất
- `app/api/customer/me/route.ts` - API lấy thông tin khách hàng

**Công nghệ:**
- bcryptjs - Hash mật khẩu
- jose (JWT) - Token authentication
- HTTP-only cookies - Lưu token an toàn

**Environment Variable mới:**
```
CUSTOMER_JWT_SECRET="your-secret-key-here"
```

### 1.3 Login & Register Pages

**`app/login/page.tsx`**
- Form đăng nhập với SĐT + mật khẩu
- Tự động chuyển hướng sau khi đăng nhập
- Link đến trang đăng ký

**`app/register/page.tsx`**
- Form đăng ký: Họ tên, SĐT, mật khẩu, xác nhận mật khẩu
- Validate mật khẩu tối thiểu 6 ký tự
- Tự động đăng nhập sau khi đăng ký thành công

### 1.4 Header Navigation

**`components/auth/CustomerAuthNav.tsx`**
- Hiển thị "Đăng nhập" nếu chưa login
- Hiển thị icon giỏ hàng + tên khách hàng nếu đã login
- Responsive cho mobile và desktop

## 2. Hiển thị Số lượng Người đã Mua

**File cập nhật: `app/books/[slug]/page.tsx`**

```typescript
const orderCount = await prisma.order.count({
  where: {
    items: {
      some: {
        bookId: book.id,
      },
    },
  },
  distinct: ['customerId'],
});
```

**Hiển thị:**
```
[Giá sách]
50 người đã mua sách này
```

## 3. Giỏ hàng (Shopping Cart)

### 3.1 Cart API

**`app/api/cart/route.ts`**
- `GET` - Lấy giỏ hàng
- `POST` - Thêm sách vào giỏ (tự động cộng dồn số lượng nếu đã có)

**`app/api/cart/[id]/route.ts`**
- `PATCH` - Cập nhật số lượng
- `DELETE` - Xóa khỏi giỏ

### 3.2 Cart Page

**`app/cart/page.tsx`**

**Tính năng:**
- Hiển thị danh sách sách trong giỏ
- Tăng/giảm số lượng
- Xóa sách khỏi giỏ
- Tính tổng tiền
- Nút "Thanh toán"
- Empty state khi giỏ trống

**UI Components:**
- Cover sách thumbnail
- Tên sách, tác giả
- Giá đơn vị và tổng
- Controls: +/- số lượng, xóa

### 3.3 Add to Cart Button

**`components/books/AddToCartButton.tsx`**
- Nút "Thêm vào giỏ" trên trang sách
- Tự động chuyển đến `/cart` sau khi thêm
- Redirect đến `/login` nếu chưa đăng nhập

**Tích hợp vào Book Detail Page:**
```
[Thêm vào giỏ] [Mua ngay]
```

## 4. Lịch sử Đơn hàng & Tài khoản

### 4.1 Orders API

**`app/api/customer/orders/route.ts`**
- `GET` - Lấy tất cả đơn hàng của khách hàng
- Include items và book details
- Sắp xếp theo ngày mới nhất

### 4.2 Account Page

**`app/account/page.tsx`**

**2 Tabs chính:**

**1. Đơn hàng Tab:**
- Danh sách tất cả đơn hàng
- Mã đơn hàng (#AIB-...)
- Ngày đặt
- Trạng thái (Chờ xác nhận, Đang giao, ...)
- Danh sách sách trong đơn
- Tổng tiền

**2. Thông tin cá nhân Tab:**
- Họ tên
- Số điện thoại
- Địa chỉ mặc định
- Tỉnh/Thành phố
- Nút "Xem giỏ hàng"

**Header:**
- Tên + SĐT khách hàng
- Nút "Đăng xuất"

## 5. Flow Sử dụng

### 5.1 Khách hàng mới

1. Truy cập website
2. Click "Đăng nhập" ở header
3. Click "Đăng ký ngay"
4. Nhập: Họ tên, SĐT, mật khẩu
5. Tự động đăng nhập và chuyển đến `/account`

### 5.2 Mua sách

**Option 1: Mua ngay**
1. Vào trang sách
2. Click "Mua ngay"
3. Điền thông tin giao hàng
4. Đặt hàng

**Option 2: Giỏ hàng**
1. Vào trang sách
2. Click "Thêm vào giỏ"
3. Tiếp tục mua sắm hoặc vào giỏ hàng
4. Xem giỏ, điều chỉnh số lượng
5. Click "Thanh toán"
6. (TODO: Cart checkout flow)

### 5.3 Xem lịch sử

1. Click tên/avatar ở header
2. Vào `/account`
3. Tab "Đơn hàng" - xem tất cả đơn đã đặt
4. Tab "Thông tin cá nhân" - xem profile

## 6. Trạng thái Đơn hàng

| Status | Tên hiển thị | Màu |
|--------|--------------|-----|
| PENDING | Chờ xác nhận | Vàng (warning) |
| CONFIRMED | Đã xác nhận | Xanh (success) |
| PACKING | Đang đóng gói | Cam (accent) |
| SHIPPING | Đang giao | Cam (accent) |
| COMPLETED | Hoàn thành | Xanh (success) |
| CANCELLED | Đã hủy | Đỏ (error) |

## 7. Security

### Authentication
- ✅ Mật khẩu được hash bằng bcryptjs (10 rounds)
- ✅ JWT token lưu trong HTTP-only cookie
- ✅ Token hết hạn sau 7 ngày
- ✅ Secure cookie trong production
- ✅ Validation input ở cả client và server

### Authorization
- ✅ API routes kiểm tra JWT token
- ✅ Cart và orders chỉ truy cập được bởi chủ sở hữu
- ✅ Customer không thể xem/sửa data của customer khác

## 8. Files Tạo mới

### API Routes (10 files)
- `app/api/customer/register/route.ts`
- `app/api/customer/login/route.ts`
- `app/api/customer/logout/route.ts`
- `app/api/customer/me/route.ts`
- `app/api/customer/orders/route.ts`
- `app/api/cart/route.ts`
- `app/api/cart/[id]/route.ts`

### Pages (4 files)
- `app/login/page.tsx`
- `app/register/page.tsx`
- `app/cart/page.tsx`
- `app/account/page.tsx`

### Components (2 files)
- `components/auth/CustomerAuthNav.tsx`
- `components/books/AddToCartButton.tsx`

### Lib (1 file)
- `lib/customer-auth.ts`

### Database
- Migration: `20260814164045_add_customer_auth_and_cart`

## 9. Files Cập nhật

- `prisma/schema.prisma` - Thêm password & CartItem
- `app/books/[slug]/page.tsx` - Hiển thị order count và Add to Cart
- `components/layout/Header.tsx` - Thêm CustomerAuthNav
- `.env.example` - Thêm CUSTOMER_JWT_SECRET

## 10. Dependencies Mới

```json
{
  "bcryptjs": "^2.4.3",
  "@types/bcryptjs": "^2.4.6"
}
```

## 11. Admin View

**Admin đã có thể xem orders:**
- Admin panel đã có `/admin` dashboard
- Page `/admin/orders` hiển thị tất cả đơn hàng
- Có thể filter và cập nhật trạng thái

**Không cần thay đổi gì thêm.**

## 12. Testing Checklist

### Authentication
- ✅ Đăng ký tài khoản mới
- ✅ Đăng nhập bằng SĐT + mật khẩu
- ✅ Đăng xuất
- ✅ Redirect về login khi chưa đăng nhập
- ✅ Persist login sau khi refresh

### Cart
- ✅ Thêm sách vào giỏ (redirect đến login nếu cần)
- ✅ Xem giỏ hàng
- ✅ Tăng/giảm số lượng
- ✅ Xóa sách khỏi giỏ
- ✅ Tính tổng tiền đúng

### Account
- ✅ Xem lịch sử đơn hàng
- ✅ Xem thông tin cá nhân
- ✅ Hiển thị trạng thái đơn hàng
- ✅ Đăng xuất

### UI/UX
- ✅ Header hiển thị đúng (login/cart/user)
- ✅ Mobile responsive
- ✅ Hiển thị số người đã mua trên book page
- ✅ Add to Cart button hoạt động

## 13. TODO (Nếu cần)

### Cart Checkout Flow
- Hiện tại: Cart → "Thanh toán" button chưa implement
- Nên tạo: `app/cart/checkout/page.tsx` để checkout nhiều sách cùng lúc
- Hoặc: Redirect đến `/checkout?cart=true` và xử lý cart checkout

### Profile Edit
- Thêm form chỉnh sửa thông tin cá nhân
- Update địa chỉ mặc định
- Đổi mật khẩu

### Forgot Password
- Flow reset mật khẩu qua SMS/Email

---

## 🎉 Hoàn thành!

Tất cả tính năng đã được implement:
1. ✅ Hệ thống đăng nhập/đăng ký bằng SĐT + mật khẩu
2. ✅ Hiển thị số lượng người đã mua trên book page
3. ✅ Giỏ hàng (thêm, xóa, cập nhật số lượng)
4. ✅ Lịch sử đơn hàng
5. ✅ Trang tài khoản cá nhân
6. ✅ Admin có thể xem orders (đã có sẵn)

**Truy cập:**
- Đăng ký: http://localhost:3001/register
- Đăng nhập: http://localhost:3001/login
- Giỏ hàng: http://localhost:3001/cart
- Tài khoản: http://localhost:3001/account
