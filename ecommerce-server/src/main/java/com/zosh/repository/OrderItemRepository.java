package com.zosh.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zosh.modal.OrderItem;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

	List<OrderItem> findByProductId(Long productId);

}
