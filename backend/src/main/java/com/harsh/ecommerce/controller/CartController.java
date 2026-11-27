// Created by Harsh Chourasia
package com.harsh.ecommerce.controller;

import com.harsh.ecommerce.dto.Dtos.CartRequest;
import com.harsh.ecommerce.entity.CartItem;
import com.harsh.ecommerce.service.CartService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cart;

    public CartController(CartService cart) {
        this.cart = cart;
    }

    @GetMapping
    public List<CartItem> get(Authentication auth) {
        return cart.get(auth.getName());
    }

    @PostMapping
    public List<CartItem> add(Authentication auth, @Valid @RequestBody CartRequest r) {
        return cart.add(auth.getName(), r.productId(), r.quantity());
    }

    @PutMapping("/{itemId}")
    public List<CartItem> update(Authentication auth, @PathVariable Long itemId, @RequestParam int quantity) {
        return cart.update(auth.getName(), itemId, quantity);
    }

    @DeleteMapping("/{itemId}")
    public List<CartItem> remove(Authentication auth, @PathVariable Long itemId) {
        return cart.remove(auth.getName(), itemId);
    }
}
