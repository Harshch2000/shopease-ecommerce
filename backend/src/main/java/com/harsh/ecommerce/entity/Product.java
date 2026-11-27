// Created by Harsh Chourasia
package com.harsh.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Getter @Setter
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(length = 1000)
    private String description;
    @Column(nullable = false)
    private BigDecimal price;
    private int stock;
    private String imageUrl;
    @ManyToOne(fetch = FetchType.EAGER)
    private Category category;
}
