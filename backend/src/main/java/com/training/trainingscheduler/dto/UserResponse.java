package com.training.trainingscheduler.dto;

import com.training.trainingscheduler.entity.Role;
import com.training.trainingscheduler.entity.User;
import com.training.trainingscheduler.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private UserStatus status;

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getStatus()
        );
    }

}
