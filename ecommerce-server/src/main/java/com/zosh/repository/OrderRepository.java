package com.zosh.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.zosh.modal.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // FIX: Thêm PENDING và CANCELLED để đơn mới đặt và đơn hủy đều hiển thị đúng
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId " +
           "AND o.orderStatus IN (com.zosh.user.domain.OrderStatus.PENDING, " +
           "com.zosh.user.domain.OrderStatus.PLACED, " +
           "com.zosh.user.domain.OrderStatus.CONFIRMED, " +
           "com.zosh.user.domain.OrderStatus.SHIPPED, " +
           "com.zosh.user.domain.OrderStatus.DELIVERED, " +
           "com.zosh.user.domain.OrderStatus.CANCELLED) " +
           "ORDER BY o.createdAt DESC")
    List<Order> getUsersOrders(@Param("userId") Long userId);

    List<Order> findAllByOrderByCreatedAtDesc();

    List<Order> findByUserId(Long userId);
}
