-- ============================================================
-- Script xóa dữ liệu SẢN PHẨM để backend tự seed lại 45 sp
-- Database: ecommerce (Spring Boot tự tạo bảng qua JPA)
-- Chạy trong MySQL Workbench / phpMyAdmin / CLI
-- GIỮ NGUYÊN: users, addresses, cart (chỉ xóa items)
-- ============================================================

USE ecommerce;

-- Tắt kiểm tra foreign key tạm thời để xóa an toàn
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Xóa cart items (sản phẩm trong giỏ hàng)
TRUNCATE TABLE cart_item;

-- 2. Xóa order items (chi tiết từng đơn hàng)
TRUNCATE TABLE order_item;

-- 3. Xóa đánh giá sao
TRUNCATE TABLE rating;

-- 4. Xóa bình luận / review
TRUNCATE TABLE review;

-- 5. Xóa đơn hàng
TRUNCATE TABLE orders;

-- 6. Xóa sizes của sản phẩm (bảng phụ do @ElementCollection tạo ra)
--    Tên bảng do Hibernate tự đặt: product_sizes
TRUNCATE TABLE product_sizes;

-- 7. Xóa sản phẩm
TRUNCATE TABLE product;

-- 8. Xóa danh mục (phải xóa cấp con trước, rồi mới xóa cấp cha)
--    Hibernate đặt tên bảng là "categories" (do @Table(name="categories"))
DELETE FROM categories WHERE parent_category_id IS NOT NULL;  -- cấp 2, 3
DELETE FROM categories WHERE parent_category_id IS NULL;      -- cấp 1 (gốc)

-- Bật lại kiểm tra foreign key
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- Sau khi chạy xong SQL này:
-- → Restart backend Spring Boot
-- → Backend sẽ tự động seed lại 45 sản phẩm
-- ============================================================

SELECT 'Done! Hay restart Spring Boot backend ngay bay gio.' AS thong_bao;