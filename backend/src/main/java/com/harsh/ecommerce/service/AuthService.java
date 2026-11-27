// Created by Harsh Chourasia
package com.harsh.ecommerce.service;

import com.harsh.ecommerce.dto.Dtos.*;
import com.harsh.ecommerce.entity.Role;
import com.harsh.ecommerce.entity.User;
import com.harsh.ecommerce.repository.UserRepository;
import com.harsh.ecommerce.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtUtil jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public AuthResponse register(RegisterRequest r) {
        String email = r.email().trim().toLowerCase();
        if (users.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }
        User u = new User();
        u.setName(r.name().trim());
        u.setEmail(email);
        u.setPassword(encoder.encode(r.password()));
        u.setRole(Role.USER);
        users.save(u);
        return response(u);
    }

    public AuthResponse login(LoginRequest r) {
        User u = users.findByEmail(r.email().trim().toLowerCase())
                .filter(x -> encoder.matches(r.password(), x.getPassword()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        return response(u);
    }

    private AuthResponse response(User u) {
        return new AuthResponse(jwt.generate(u.getEmail(), u.getRole().name()), u.getName(), u.getEmail(), u.getRole().name());
    }
}
