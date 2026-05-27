package com.zosh.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.exception.OrderException;
import com.zosh.exception.UserException;
import com.zosh.modal.Address;
import com.zosh.modal.Order;
import com.zosh.modal.User;
import com.zosh.service.OrderService;
import com.zosh.service.UserService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
	
	private OrderService orderService;
	private UserService userService;
	
	public OrderController(OrderService orderService,UserService userService) {
		this.orderService=orderService;
		this.userService=userService;
	}
	
	@PostMapping("/")
	public ResponseEntity<Order> createOrderHandler(
			@RequestBody Address spippingAddress,
			@RequestHeader("Authorization")String jwt) throws UserException{
		
		User user=userService.findUserProfileByJwt(jwt);
		Order order =orderService.createOrder(user, spippingAddress);
		
		return new ResponseEntity<Order>(order,HttpStatus.OK);
		
	}
	
	@GetMapping("/user")
	public ResponseEntity< List<Order>> usersOrderHistoryHandler(@RequestHeader("Authorization") 
	String jwt) throws OrderException, UserException{
		
		User user=userService.findUserProfileByJwt(jwt);
		List<Order> orders=orderService.usersOrderHistory(user.getId());
		return new ResponseEntity<>(orders,HttpStatus.ACCEPTED);
	}
	
	@GetMapping("/{orderId}")
	public ResponseEntity< Order> findOrderHandler(@PathVariable Long orderId, @RequestHeader("Authorization") 
	String jwt) throws OrderException, UserException{
		
		User user=userService.findUserProfileByJwt(jwt);
		Order orders=orderService.findOrderById(orderId);
		return new ResponseEntity<>(orders,HttpStatus.ACCEPTED);
	}


	@PutMapping("/{orderId}/cancel")
	public ResponseEntity<Order> cancelOrderHandler(
			@PathVariable Long orderId,
			@RequestHeader("Authorization") String jwt) throws OrderException, UserException {
		User user = userService.findUserProfileByJwt(jwt);
		Order order = orderService.findOrderById(orderId);
		// Only allow cancel if not yet delivered
		if (order.getOrderStatus() != null && order.getOrderStatus().name().equals("DELIVERED")) {
			throw new OrderException("Không thể hủy đơn hàng đã giao.");
		}
		Order cancelled = orderService.cancledOrder(orderId);
		return new ResponseEntity<>(cancelled, HttpStatus.ACCEPTED);
	}

}