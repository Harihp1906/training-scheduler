package com.training.trainingscheduler.dto;

import com.training.trainingscheduler.entity.Enrollment;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

/** Enrollment as seen by an admin looking at one course's roster -- user nested (never with a password), no course (they already know which course). */
@Data
@AllArgsConstructor
public class EnrollmentAdminResponse {

    private Long id;
    private int progress;
    private String status;
    private LocalDateTime enrolledAt;
    private UserResponse user;

    public static EnrollmentAdminResponse from(Enrollment enrollment) {
        return new EnrollmentAdminResponse(
                enrollment.getId(),
                enrollment.getProgress(),
                enrollment.getStatus().getLabel(),
                enrollment.getEnrolledAt(),
                UserResponse.from(enrollment.getUser())
        );
    }

}
