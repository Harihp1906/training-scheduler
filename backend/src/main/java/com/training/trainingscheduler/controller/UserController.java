package com.training.trainingscheduler.controller;
import com.training.trainingscheduler.dto.LoginRequest;
import com.training.trainingscheduler.dto.RegisterRequest;
import com.training.trainingscheduler.entity.User;
import com.training.trainingscheduler.repository.UserRepository;
import com.training.trainingscheduler.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
@RestController
@RequestMapping("/api/auth")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return userService.registerUser(
            request.getFullName(),
            request.getEmail(),
            request.getPassword()
        );
    }
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {
        String result = userService.loginUser(
            request.getEmail(),
            request.getPassword()
        );
        Map<String, Object> response = new HashMap<>();
        if (result.equals("Invalid email or password!")) {
            response.put("error", result);
        } else {
            response.put("token", result);
            User user = userRepository.findByEmail(request.getEmail()).get();
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("fullName", user.getFullName());
            userMap.put("email", user.getEmail());
            userMap.put("role", user.getRole());
            response.put("user", userMap);
        }
        return response;
    }
}