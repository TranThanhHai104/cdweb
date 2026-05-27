package com.zosh.controller;

import java.time.LocalDateTime;
import java.util.List;

import com.zosh.exception.UserException;
import com.zosh.modal.Cart;
import com.zosh.modal.Order;
import com.zosh.modal.User;
import com.zosh.repository.CartRepository;
import com.zosh.repository.OrderRepository;
import com.zosh.repository.UserRepository;
import com.zosh.response.ApiResponse;
import com.zosh.service.CartService;
import com.zosh.service.UserService;
import com.zosh.user.domain.UserRole;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminUserController {

	private final UserService userService;
	private final UserRepository userRepository;
	private final CartRepository cartRepository;
	private final OrderRepository orderRepository;
	private final CartService cartService;
	private final PasswordEncoder passwordEncoder;

	public AdminUserController(UserService userService, UserRepository userRepository,
							   CartRepository cartRepository, OrderRepository orderRepository,
							   CartService cartService, PasswordEncoder passwordEncoder) {
		this.userService = userService;
		this.userRepository = userRepository;
		this.cartRepository = cartRepository;
		this.orderRepository = orderRepository;
		this.cartService = cartService;
		this.passwordEncoder = passwordEncoder;
	}

	@GetMapping("/users")
	public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Authorization") String jwt) throws UserException{
		List<User> users=userService.findAllUsers();
		return new ResponseEntity<>(users,HttpStatus.OK);
	}

	@PostMapping("/users")
	public ResponseEntity<User> createUser(@RequestBody User user) throws UserException {
		if (userRepository.findByEmail(user.getEmail()) != null) {
			throw new UserException("Email is already used by another account");
		}

		User createdUser = new User();
		createdUser.setFirstName(user.getFirstName());
		createdUser.setLastName(user.getLastName());
		createdUser.setEmail(user.getEmail());
		createdUser.setMobile(user.getMobile());
		createdUser.setRole(normalizeRole(user.getRole()));
		createdUser.setCreatedAt(LocalDateTime.now());
		createdUser.setPassword(passwordEncoder.encode(user.getPassword()));

		User savedUser = userRepository.save(createdUser);
		cartService.createCart(savedUser);
		return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
	}

	@PutMapping("/users/{userId}")
	public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody User user) throws UserException {
		User existingUser = userService.findUserById(userId);
		User emailOwner = userRepository.findByEmail(user.getEmail());
		if (emailOwner != null && !emailOwner.getId().equals(userId)) {
			throw new UserException("Email is already used by another account");
		}

		existingUser.setFirstName(user.getFirstName());
		existingUser.setLastName(user.getLastName());
		existingUser.setEmail(user.getEmail());
		existingUser.setMobile(user.getMobile());
		existingUser.setRole(normalizeRole(user.getRole()));
		if (user.getPassword() != null && !user.getPassword().isBlank()) {
			existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
		}

		return new ResponseEntity<>(userRepository.save(existingUser), HttpStatus.OK);
	}

	@DeleteMapping("/users/{userId}")
	public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long userId) throws UserException {
		User user = userService.findUserById(userId);
		if (UserRole.ROLE_ADMIN.toString().equals(user.getRole())) {
			long adminCount = userRepository.findAll().stream()
					.filter(item -> UserRole.ROLE_ADMIN.toString().equals(item.getRole()))
					.count();
			if (adminCount <= 1) {
				throw new UserException("Cannot delete the last admin account");
			}
		}

		List<Order> orders = orderRepository.findByUserId(userId);
		for (Order order : orders) {
			order.setUser(null);
			order.setShippingAddress(null);
		}
		orderRepository.saveAll(orders);

		Cart cart = cartRepository.findByUserId(userId);
		if (cart != null) {
			cartRepository.delete(cart);
		}

		userRepository.delete(user);
		return new ResponseEntity<>(new ApiResponse("Customer deleted successfully", true), HttpStatus.OK);
	}

	private String normalizeRole(String role) {
		if (UserRole.ROLE_ADMIN.toString().equals(role)) {
			return UserRole.ROLE_ADMIN.toString();
		}
		return UserRole.ROLE_CUSTOMER.toString();
	}
}
