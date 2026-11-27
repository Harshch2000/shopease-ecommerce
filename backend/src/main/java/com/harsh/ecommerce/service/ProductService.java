// Created by Harsh Chourasia
package com.harsh.ecommerce.service;

import com.harsh.ecommerce.dto.Dtos.ProductRequest;
import com.harsh.ecommerce.entity.Product;
import com.harsh.ecommerce.repository.CategoryRepository;
import com.harsh.ecommerce.repository.ProductRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProductService {
    private final ProductRepository products;
    private final CategoryRepository categories;

    public ProductService(ProductRepository products, CategoryRepository categories) {
        this.products = products;
        this.categories = categories;
    }

    public Page<Product> search(String q, Long categoryId, int page, int size) {
        String query = (q == null || q.isBlank()) ? null : q.trim();
        return products.search(query, categoryId, PageRequest.of(page, size, Sort.by("id").descending()));
    }

    public Product get(Long id) {
        return products.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    public Product create(ProductRequest r) {
        return products.save(apply(new Product(), r));
    }

    public Product update(Long id, ProductRequest r) {
        return products.save(apply(get(id), r));
    }

    public void delete(Long id) {
        get(id);
        try {
            products.deleteById(id);
            products.flush();
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product is used in carts or orders and cannot be deleted");
        }
    }

    private Product apply(Product p, ProductRequest r) {
        p.setName(r.name());
        p.setDescription(r.description());
        p.setPrice(r.price());
        p.setStock(r.stock());
        p.setImageUrl(r.imageUrl());
        p.setCategory(categories.findById(r.categoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found")));
        return p;
    }
}
