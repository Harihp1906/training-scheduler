package com.training.trainingscheduler.dto;

import com.training.trainingscheduler.entity.Enrollment;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

/** Enrollment as seen by its owner -- course nested, no user data (they already know who they are). */
@Data
@AllArgsConstructor
public class EnrollmentResponse {

    private Long id;
    private int progress;
    private String status;
    private LocalDateTime enrolledAt;
    private CourseResponse course;

    public static EnrollmentResponse from(Enrollment enrollment) {
        return new EnrollmentResponse(
                enrollment.getId(),
                enrollment.getProgress(),
                enrollment.getStatus().getLabel(),
                enrollment.getEnrolledAt(),
                CourseResponse.from(enrollment.getCourse())
        );
    }

}
