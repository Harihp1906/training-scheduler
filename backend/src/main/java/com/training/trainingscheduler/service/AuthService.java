package com.training.trainingscheduler.service;

import com.training.trainingscheduler.dto.AuthResponse;
import com.training.trainingscheduler.dto.LoginRequest;
import com.training.trainingscheduler.dto.RegisterRequest;
import com.training.trainingscheduler.dto.UserResponse;
import com.training.trainingscheduler.entity.Role;
import com.training.trainingscheduler.entity.User;
import com.training.trainingscheduler.entity.UserStatus;
import com.training.trainingscheduler.exception.ApiException;
import com.training.trainingscheduler.repository.UserRepository;
import com.training.trainingscheduler.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw ApiException.conflict("Email already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.STUDENT);
        user.setStatus(UserStatus.ACTIVE);

        userRepository.save(user);

        return UserResponse.from(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> ApiException.unauthorized("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw ApiException.unauthorized("Invalid email or password");
        }

        if (user.getStatus() == UserStatus.BLOCKED) {
            throw ApiException.forbidden("This account has been blocked. Contact support.");
        }

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, UserResponse.from(user));
    }

}
