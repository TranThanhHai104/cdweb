package com.zosh.service;

import org.springframework.stereotype.Service;

import com.zosh.exception.ProductException;
import com.zosh.modal.Cart;
import com.zosh.modal.CartItem;
import com.zosh.modal.Product;
import com.zosh.modal.User;
import com.zosh.repository.CartItemRepository;
import com.zosh.repository.CartRepository;
import com.zosh.request.AddItemRequest;

@Service
public class CartServiceImplementation implements CartService{
	
	private CartRepository cartRepository;
	private CartItemRepository cartItemRepository;
	private CartItemService cartItemService;
	private ProductService productService;
	
	
	public CartServiceImplementation(CartRepository cartRepository, CartItemRepository cartItemRepository, CartItemService cartItemService,
			ProductService productService) {
		this.cartRepository=cartRepository;
		this.cartItemRepository=cartItemRepository;
		this.productService=productService;
		this.cartItemService=cartItemService;
	}

	@Override
	public Cart createCart(User user) {
		
		Cart cart = new Cart();
		cart.setUser(user);
		Cart createdCart=cartRepository.save(cart);
		return createdCart;
	}
	
	public Cart findUserCart(Long userId) {
		Cart cart =	cartRepository.findByUserId(userId);
		int totalPrice=0;
		int totalDiscountedPrice=0;
		int totalItem=0;
		for(CartItem cartsItem : cart.getCartItems()) {
			totalPrice+=cartsItem.getPrice();
			totalDiscountedPrice+=cartsItem.getDiscountedPrice();
			totalItem+=cartsItem.getQuantity();
		}
		
		cart.setTotalPrice(totalPrice);
		cart.setTotalItem(cart.getCartItems().size());
		cart.setTotalDiscountedPrice(totalDiscountedPrice);
		cart.setDiscounte(totalPrice-totalDiscountedPrice);
		cart.setTotalItem(totalItem);
		
		return cartRepository.save(cart);
		
	}

	@Override
	public CartItem addCartItem(Long userId, AddItemRequest req) throws ProductException {
		Cart cart=cartRepository.findByUserId(userId);
		Product product=productService.findProductById(req.getProductId());
		int requestedQuantity = req.getQuantity() > 0 ? req.getQuantity() : 1;
		
		CartItem isPresent=cartItemService.isCartItemExist(cart, product, req.getSize(),userId);
		
		if(isPresent == null) {
			CartItem cartItem = new CartItem();
			cartItem.setProduct(product);
			cartItem.setCart(cart);
			cartItem.setQuantity(requestedQuantity);
			cartItem.setUserId(userId);
			
			
			cartItem.setPrice(product.getPrice() * requestedQuantity);
			cartItem.setSize(req.getSize());
			
			CartItem createdCartItem=cartItemService.createCartItem(cartItem);
			cart.getCartItems().add(createdCartItem);
			return createdCartItem;
		}
		
		isPresent.setQuantity(isPresent.getQuantity() + requestedQuantity);
		isPresent.setPrice(isPresent.getProduct().getPrice() * isPresent.getQuantity());
		isPresent.setDiscountedPrice(isPresent.getProduct().getDiscountedPrice() * isPresent.getQuantity());
		return cartItemRepository.save(isPresent);
		
	}

}
