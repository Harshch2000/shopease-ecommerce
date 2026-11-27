// Created by Harsh Chourasia
package com.harsh.ecommerce.config;

import com.harsh.ecommerce.entity.*;
import com.harsh.ecommerce.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.math.BigDecimal;

/** Seeds an admin user, categories and sample products on first start. */
@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seed(UserRepository users, CategoryRepository cats, ProductRepository products, PasswordEncoder enc) {
        return args -> {
            if (!users.existsByEmail("admin@shop.com")) {
                User a = new User();
                a.setName("Admin");
                a.setEmail("admin@shop.com");
                a.setPassword(enc.encode("Admin@123"));
                a.setRole(Role.ADMIN);
                users.save(a);
            }
            if (cats.count() > 0) return;
            Category electronics = cat(cats, "Electronics");
            Category books = cat(cats, "Books");
            Category fashion = cat(cats, "Fashion");
            Category home = cat(cats, "Home & Kitchen");
            prod(products, "Wireless Headphones", "Over-ear Bluetooth headphones with 30-hour battery.", "2499.00", 25, electronics);
            prod(products, "Mechanical Keyboard", "Hot-swappable keyboard with tactile switches.", "3299.00", 15, electronics);
            prod(products, "27-inch 4K Monitor", "IPS panel, 60 Hz, USB-C input.", "18999.00", 8, electronics);
            prod(products, "Clean Code", "A handbook of agile software craftsmanship.", "799.00", 40, books);
            prod(products, "Designing Data-Intensive Applications", "The big ideas behind reliable, scalable systems.", "1499.00", 30, books);
            prod(products, "Cotton Hoodie", "Heavyweight cotton hoodie, unisex fit.", "1299.00", 50, fashion);
            prod(products, "Running Shoes", "Lightweight daily trainers with cushioned sole.", "3499.00", 20, fashion);
            prod(products, "Stainless Steel Bottle", "1 litre insulated bottle, keeps drinks cold for 24 hours.", "699.00", 60, home);
            prod(products, "Ceramic Mug Set", "Set of four 300 ml mugs.", "899.00", 35, home);
        };
    }

    private Category cat(CategoryRepository repo, String name) {
        Category c = new Category();
        c.setName(name);
        return repo.save(c);
    }

    private void prod(ProductRepository repo, String name, String desc, String price, int stock, Category c) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(desc);
        p.setPrice(new BigDecimal(price));
        p.setStock(stock);
        p.setCategory(c);
        p.setImageUrl("https://picsum.photos/seed/" + name.replaceAll("[^A-Za-z]", "") + "/400/300");
        repo.save(p);
    }
}
