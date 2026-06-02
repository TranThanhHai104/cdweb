package com.zosh.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.zosh.exception.OrderException;
import com.zosh.modal.Address;
import com.zosh.modal.Cart;
import com.zosh.modal.CartItem;
import com.zosh.modal.Order;
import com.zosh.modal.OrderItem;
import com.zosh.modal.User;
import com.zosh.repository.AddressRepository;
import com.zosh.repository.CartItemRepository;
import com.zosh.repository.OrderItemRepository;
import com.zosh.repository.OrderRepository;
import com.zosh.repository.UserRepository;
import com.zosh.user.domain.OrderStatus;
import com.zosh.user.domain.PaymentStatus;

@Service
public class OrderServiceImplementation implements OrderService {

	private OrderRepository orderRepository;
	private CartService cartService;
	private AddressRepository addressRepository;
	private UserRepository userRepository;
	private OrderItemService orderItemService;
	private OrderItemRepository orderItemRepository;
	private CartItemRepository cartItemRepository;

	public OrderServiceImplementation(OrderRepository orderRepository, CartService cartService,
	                                  AddressRepository addressRepository, UserRepository userRepository,
	                                  OrderItemService orderItemService, OrderItemRepository orderItemRepository,
	                                  CartItemRepository cartItemRepository) {
		this.orderRepository = orderRepository;
		this.cartService = cartService;
		this.addressRepository = addressRepository;
		this.userRepository = userRepository;
		this.orderItemService = orderItemService;
		this.orderItemRepository = orderItemRepository;
		this.cartItemRepository = cartItemRepository;
	}

	private Address copyAddress(Address source) {
		Address copy = new Address();
		copy.setFirstName(source.getFirstName());
		copy.setLastName(source.getLastName());
		copy.setStreetAddress(source.getStreetAddress());
		copy.setCity(source.getCity());
		copy.setState(source.getState());
		copy.setZipCode(source.getZipCode());
		copy.setMobile(source.getMobile());
		return copy;
	}

	private boolean isUsersAddress(Address address, User user) {
		return address.getUser() != null
				&& address.getUser().getId() != null
				&& address.getUser().getId().equals(user.getId());
	}

	@Override
	public Order createOrder(User user, Address shippAddress) {

		Address addressForOrder = shippAddress;
		if (shippAddress.getId() != null) {
			Optional<Address> savedAddress = addressRepository.findById(shippAddress.getId());
			if (savedAddress.isPresent() && isUsersAddress(savedAddress.get(), user)) {
				addressForOrder = savedAddress.get();
			}
		} else {
			Address addressBookAddress = copyAddress(shippAddress);
			addressBookAddress.setUser(user);
			addressBookAddress = addressRepository.save(addressBookAddress);
			user.getAddresses().add(addressBookAddress);
			userRepository.save(user);
			addressForOrder = addressBookAddress;
		}

		Address shippingSnapshot = addressRepository.save(copyAddress(addressForOrder));

		Cart cart = cartService.findUserCart(user.getId());
		List<OrderItem> orderItems = new ArrayList<>();

		for (CartItem item : cart.getCartItems()) {
			OrderItem orderItem = new OrderItem();
			orderItem.setPrice(item.getPrice());
			orderItem.setProduct(item.getProduct());
			orderItem.setQuantity(item.getQuantity());
			orderItem.setSize(item.getSize());
			orderItem.setUserId(item.getUserId());
			orderItem.setDiscountedPrice(item.getDiscountedPrice());

			OrderItem createdOrderItem = orderItemRepository.save(orderItem);
			orderItems.add(createdOrderItem);
		}

		Order createdOrder = new Order();
		createdOrder.setUser(user);
		createdOrder.setOrderItems(orderItems);
		createdOrder.setTotalPrice(cart.getTotalPrice());
		createdOrder.setTotalDiscountedPrice(cart.getTotalDiscountedPrice());

		// FIX 1: Order dùng "discount" (không phải "discounte" như Cart)
		createdOrder.setDiscount(cart.getDiscounte());

		createdOrder.setTotalItem(cart.getTotalItem());
		createdOrder.setShippingAddress(shippingSnapshot);

		// FIX 2: orderDate kiểu LocalDate, không phải LocalDateTime
		createdOrder.setOrderDate(LocalDate.now());

		createdOrder.setOrderStatus(OrderStatus.PENDING);
		createdOrder.getPaymentDetails().setStatus(PaymentStatus.PENDING);
		createdOrder.setCreatedAt(LocalDateTime.now());

		Order savedOrder = orderRepository.save(createdOrder);

		for (OrderItem item : orderItems) {
			item.setOrder(savedOrder);
			orderItemRepository.save(item);
		}

		// FIX 3: Xóa giỏ hàng sau khi đặt hàng thành công
		cartItemRepository.deleteAll(cart.getCartItems());
		cart.getCartItems().clear();
		cart.setTotalPrice(0);
		cart.setTotalDiscountedPrice(0);
		cart.setDiscounte(0);
		cart.setTotalItem(0);
		cartService.findUserCart(user.getId());

		return savedOrder;
	}

	@Override
	public Order placedOrder(Long orderId) throws OrderException {
		Order order = findOrderById(orderId);
		order.setOrderStatus(OrderStatus.PLACED);
		order.getPaymentDetails().setStatus(PaymentStatus.COMPLETED);
		return orderRepository.save(order);
	}

	@Override
	public Order confirmedOrder(Long orderId) throws OrderException {
		Order order = findOrderById(orderId);
		order.setOrderStatus(OrderStatus.CONFIRMED);
		return orderRepository.save(order);
	}

	@Override
	public Order shippedOrder(Long orderId) throws OrderException {
		Order order = findOrderById(orderId);
		order.setOrderStatus(OrderStatus.SHIPPED);
		return orderRepository.save(order);
	}

	@Override
	public Order deliveredOrder(Long orderId) throws OrderException {
		Order order = findOrderById(orderId);
		order.setOrderStatus(OrderStatus.DELIVERED);
		return orderRepository.save(order);
	}

	@Override
	public Order cancledOrder(Long orderId) throws OrderException {
		Order order = findOrderById(orderId);
		order.setOrderStatus(OrderStatus.CANCELLED);
		return orderRepository.save(order);
	}

	@Override
	public Order findOrderById(Long orderId) throws OrderException {
		Optional<Order> opt = orderRepository.findById(orderId);
		if (opt.isPresent()) {
			return opt.get();
		}
		throw new OrderException("order not exist with id " + orderId);
	}

	@Override
	public List<Order> usersOrderHistory(Long userId) {
		return orderRepository.getUsersOrders(userId);
	}

	@Override
	public List<Order> getAllOrders() {
		return orderRepository.findAllByOrderByCreatedAtDesc();
	}

	@Override
	public void deleteOrder(Long orderId) throws OrderException {
		findOrderById(orderId);
		orderRepository.deleteById(orderId);
	}
}
