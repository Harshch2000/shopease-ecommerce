// Created by Harsh Chourasia
package com.harsh.ecommerce.controller;

import com.harsh.ecommerce.dto.Dtos.CheckoutRequest;
import com.harsh.ecommerce.dto.Dtos.OrderDto;
import com.harsh.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class OrderController {
    private final OrderService orders;

    public OrderController(OrderService orders) {
        this.orders = orders;
    }

    @PostMapping("/api/orders/checkout")
    public OrderDto checkout(Authentication auth, @Valid @RequestBody CheckoutRequest r) {
        return orders.place(auth.getName(), r.shippingAddress());
    }

    @GetMapping("/api/orders")
    public List<OrderDto> mine(Authentication auth) {
        return orders.mine(auth.getName());
    }

    @GetMapping("/api/admin/orders")
    public List<OrderDto> all() {
        return orders.all();
    }

    @PutMapping("/api/admin/orders/{id}/status")
    public OrderDto status(@PathVariable Long id, @RequestParam String status) {
        return orders.updateStatus(id, status);
    }
}
