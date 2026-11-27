// Created by Harsh Chourasia
package com.harsh.ecommerce.controller;

import com.harsh.ecommerce.dto.Dtos.CategoryRequest;
import com.harsh.ecommerce.entity.Category;
import com.harsh.ecommerce.repository.CategoryRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryRepository repo;

    public CategoryController(CategoryRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Category> list() {
        return repo.findAll();
    }

    @PostMapping
    public Category create(@Valid @RequestBody CategoryRequest r) {
        Category c = new Category();
        c.setName(r.name().trim());
        return repo.save(c);
    }
}
