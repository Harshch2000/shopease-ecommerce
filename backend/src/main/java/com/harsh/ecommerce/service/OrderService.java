// Created by Harsh Chourasia
package com.harsh.ecommerce.service;

import com.harsh.ecommerce.dto.Dtos.OrderDto;
import com.harsh.ecommerce.dto.Dtos.OrderItemDto;
import com.harsh.ecommerce.entity.*;
import com.harsh.ecommerce.repository.CartItemRepository;
import com.harsh.ecommerce.repository.OrderRepository;
import com.harsh.ecommerce.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orders;
    private final CartItemRepository cartItems;
    private final UserRepository users;

    public OrderService(OrderRepository orders, CartItemRepository cartItems, UserRepository users) {
        this.orders = orders;
        this.cartItems = cartItems;
        this.users = users;
    }

    /** Checkout: converts the cart into an order, reduces stock and clears the cart. Payment is mocked. */
    @Transactional
    public OrderDto place(String email, String address) {
        User u = users.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        List<CartItem> cart = cartItems.findByUser(u);
        if (cart.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Your cart is empty");
        }
        Order o = new Order();
        o.setUser(u);
        o.setShippingAddress(address.trim());
        o.setStatus(OrderStatus.PLACED);
        o.setCreatedAt(LocalDateTime.now());
        o.setPaymentStatus("PAID (MOCK)");
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem ci : cart) {
            Product p = ci.getProduct();
            if (ci.getQuantity() > p.getStock()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not enough stock for " + p.getName());
            }
            p.setStock(p.getStock() - ci.getQuantity());
            OrderItem oi = new OrderItem();
            oi.setOrder(o);
            oi.setProduct(p);
            oi.setQuantity(ci.getQuantity());
            oi.setPrice(p.getPrice());
            o.getItems().add(oi);
            total = total.add(p.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())));
        }
        o.setTotal(total);
        orders.save(o);
        cartItems.deleteAll(cart);
        return toDto(o);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> mine(String email) {
        User u = users.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        return orders.findByUserOrderByCreatedAtDesc(u).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<OrderDto> all() {
        return orders.findAllByOrderByCreatedAtDesc().stream().map(this::toDto).toList();
    }

    @Transactional
    public OrderDto updateStatus(Long id, String status) {
        Order o = orders.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        try {
            o.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status");
        }
        return toDto(o);
    }

    private OrderDto toDto(Order o) {
        List<OrderItemDto> items = o.getItems().stream()
                .map(i -> new OrderItemDto(i.getProduct().getId(), i.getProduct().getName(), i.getQuantity(), i.getPrice())).toList();
        return new OrderDto(o.getId(), o.getCreatedAt(), o.getStatus().name(), o.getTotal(), o.getPaymentStatus(),
                o.getShippingAddress(), o.getUser().getEmail(), items);
    }
}
