// Created by Harsh Chourasia
package com.harsh.ecommerce.controller;

import com.harsh.ecommerce.dto.Dtos.ProductRequest;
import com.harsh.ecommerce.entity.Product;
import com.harsh.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public Page<Product> list(@RequestParam(required = false) String q,
                              @RequestParam(required = false) Long categoryId,
                              @RequestParam(defaultValue = "0") int page,
                              @RequestParam(defaultValue = "8") int size) {
        return service.search(q, categoryId, page, Math.min(size, 50));
    }

    @GetMapping("/{id}")
    public Product get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    public Product create(@Valid @RequestBody ProductRequest r) {
        return service.create(r);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @Valid @RequestBody ProductRequest r) {
        return service.update(id, r);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
