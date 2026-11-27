// Created by Harsh Chourasia
package com.harsh.ecommerce.repository;

import com.harsh.ecommerce.entity.Order;
import com.harsh.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findAllByOrderByCreatedAtDesc();
}
