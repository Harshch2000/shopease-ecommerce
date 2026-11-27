// Created by Harsh Chourasia
package com.harsh.ecommerce.repository;

import com.harsh.ecommerce.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> { }
