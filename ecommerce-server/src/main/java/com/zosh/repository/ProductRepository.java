package com.zosh.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.zosh.modal.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE LOWER(p.category.name) = LOWER(:category)")
    List<Product> findByCategory(@Param("category") String category);

    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.title) LIKE CONCAT('%', LOWER(:query), '%') OR " +
           "LOWER(p.description) LIKE CONCAT('%', LOWER(:query), '%') OR " +
           "LOWER(p.brand) LIKE CONCAT('%', LOWER(:query), '%') OR " +
           "LOWER(p.category.name) LIKE CONCAT('%', LOWER(:query), '%')")
    List<Product> searchProduct(@Param("query") String query);

    // FIX: Thêm điều kiện (:maxPrice = 0 OR BETWEEN) để khi maxPrice=0 thì bỏ qua filter giá
    @Query("SELECT p FROM Product p " +
           "WHERE (LOWER(p.category.name) = LOWER(:category) OR :category = '') " +
           "AND (:maxPrice = 0 OR p.discountedPrice BETWEEN :minPrice AND :maxPrice) " +
           "AND (:minDiscount IS NULL OR p.discountPersent >= :minDiscount) " +
           "ORDER BY " +
           "CASE WHEN :sort = 'price_low' THEN p.discountedPrice END ASC, " +
           "CASE WHEN :sort = 'price_high' THEN p.discountedPrice END DESC, " +
           "p.createdAt DESC")
    List<Product> filterProducts(
            @Param("category") String category,
            @Param("minPrice") Integer minPrice,
            @Param("maxPrice") Integer maxPrice,
            @Param("minDiscount") Integer minDiscount,
            @Param("sort") String sort
    );

    List<Product> findTop10ByOrderByCreatedAtDesc();
}
