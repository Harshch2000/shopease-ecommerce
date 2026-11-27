// Created by Harsh Chourasia
package com.harsh.ecommerce.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class Dtos {
    public record RegisterRequest(@NotBlank String name, @Email @NotBlank String email,
                                  @Size(min = 6, message = "Password must be at least 6 characters") String password) {}
    public record LoginRequest(@NotBlank String email, @NotBlank String password) {}
    public record AuthResponse(String token, String name, String email, String role) {}

    public record ProductRequest(@NotBlank String name, String description,
                                 @NotNull @DecimalMin("0.01") BigDecimal price,
                                 @Min(0) int stock, String imageUrl, @NotNull Long categoryId) {}
    public record CategoryRequest(@NotBlank String name) {}

    public record CartRequest(@NotNull Long productId, @Min(1) int quantity) {}
    public record CheckoutRequest(@NotBlank(message = "Shipping address is required") String shippingAddress) {}

    public record OrderItemDto(Long productId, String productName, int quantity, BigDecimal price) {}
    public record OrderDto(Long id, LocalDateTime createdAt, String status, BigDecimal total, String paymentStatus,
                           String shippingAddress, String customerEmail, List<OrderItemDto> items) {}
}
