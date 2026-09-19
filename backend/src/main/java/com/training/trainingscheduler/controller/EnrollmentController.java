package com.training.trainingscheduler.controller;

import com.training.trainingscheduler.dto.EnrollRequest;
import com.training.trainingscheduler.dto.EnrollmentAdminResponse;
import com.training.trainingscheduler.dto.EnrollmentResponse;
import com.training.trainingscheduler.dto.ProgressRequest;
import com.training.trainingscheduler.security.AuthUser;
import com.training.trainingscheduler.service.EnrollmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping
    public ResponseEntity<EnrollmentResponse> enroll(@AuthenticationPrincipal AuthUser currentUser,
                                                       @Valid @RequestBody EnrollRequest request) {
        return ResponseEntity.status(201).body(enrollmentService.enroll(currentUser, request));
    }

    @GetMapping("/user/{userId}")
    public List<EnrollmentResponse> getByUser(@AuthenticationPrincipal AuthUser currentUser,
                                               @PathVariable Long userId) {
        return enrollmentService.getEnrollmentsForUser(currentUser, userId);
    }

    @GetMapping("/course/{courseId}")
    public List<EnrollmentAdminResponse> getByCourse(@PathVariable Long courseId) {
        return enrollmentService.getEnrollmentsForCourse(courseId);
    }

    @PutMapping("/{enrollmentId}/progress")
    public EnrollmentResponse updateProgress(@AuthenticationPrincipal AuthUser currentUser,
                                              @PathVariable Long enrollmentId,
                                              @Valid @RequestBody ProgressRequest request) {
        return enrollmentService.updateProgress(currentUser, enrollmentId, request.getProgress());
    }

}
