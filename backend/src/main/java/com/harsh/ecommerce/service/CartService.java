// Created by Harsh Chourasia
package com.harsh.ecommerce.service;

import com.harsh.ecommerce.entity.CartItem;
import com.harsh.ecommerce.entity.Product;
import com.harsh.ecommerce.entity.User;
import com.harsh.ecommerce.repository.CartItemRepository;
import com.harsh.ecommerce.repository.ProductRepository;
import com.harsh.ecommerce.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class CartService {
    private final CartItemRepository items;
    private final ProductRepository products;
    private final UserRepository users;

    public CartService(CartItemRepository items, ProductRepository products, UserRepository users) {
        this.items = items;
        this.products = products;
        this.users = users;
    }

    private User user(String email) {
        return users.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    @Transactional(readOnly = true)
    public List<CartItem> get(String email) {
        return items.findByUser(user(email));
    }

    @Transactional
    public List<CartItem> add(String email, Long productId, int qty) {
        User u = user(email);
        Product p = products.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        CartItem ci = items.findByUserAndProduct(u, p).orElseGet(() -> {
            CartItem c = new CartItem();
            c.setUser(u);
            c.setProduct(p);
            return c;
        });
        int newQty = ci.getQuantity() + qty;
        if (newQty > p.getStock()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only " + p.getStock() + " in stock");
        }
        ci.setQuantity(newQty);
        items.save(ci);
        return items.findByUser(u);
    }

    @Transactional
    public List<CartItem> update(String email, Long itemId, int qty) {
        User u = user(email);
        CartItem ci = owned(u, itemId);
        if (qty <= 0) {
            items.delete(ci);
        } else {
            if (qty > ci.getProduct().getStock()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only " + ci.getProduct().getStock() + " in stock");
            }
            ci.setQuantity(qty);
            items.save(ci);
        }
        return items.findByUser(u);
    }

    @Transactional
    public List<CartItem> remove(String email, Long itemId) {
        User u = user(email);
        items.delete(owned(u, itemId));
        return items.findByUser(u);
    }

    private CartItem owned(User u, Long itemId) {
        CartItem ci = items.findById(itemId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));
        if (!ci.getUser().getId().equals(u.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your cart item");
        }
        return ci;
    }
}
