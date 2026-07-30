package com.training.trainingscheduler.service;

import com.training.trainingscheduler.config.JwtUtil;
import com.training.trainingscheduler.entity.User;
import com.training.trainingscheduler.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public String registerUser(String fullName, String email, String password) {

        // Check if email already exists
        if (userRepository.existsByEmail(email)) {
            return "Email already registered!";
        }

        // Create new user
        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); // encrypts password
        user.setRole("STUDENT");

        // Save to database
        userRepository.save(user);

        return "Registration successful!";
    }

    public String loginUser(String email, String password) {

        // Find user by email
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return "Invalid email or password!";
        }

        // Check if password matches
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return "Invalid email or password!";
        }

        // Generate JWT token
        return jwtUtil.generateToken(user.getEmail());
    }

}