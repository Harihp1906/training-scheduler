package com.training.trainingscheduler.controller;

import com.training.trainingscheduler.entity.Enrollment;
import com.training.trainingscheduler.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:3000")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    // POST /api/enrollments?userId=1&courseId=2
    @PostMapping
    public ResponseEntity<?> enroll(@RequestParam Long userId, @RequestParam Long courseId) {
        try {
            Enrollment enrollment = enrollmentService.enrollStudent(userId, courseId);
            return ResponseEntity.ok(enrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET /api/enrollments/user/1  → all courses a student is enrolled in
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Enrollment>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByUser(userId));
    }

    // GET /api/enrollments/course/1  → all students in a course (admin)
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Enrollment>> getByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByCourse(courseId));
    }

    // PUT /api/enrollments/1/progress?progress=50
    @PutMapping("/{enrollmentId}/progress")
    public ResponseEntity<?> updateProgress(@PathVariable Long enrollmentId, @RequestParam int progress) {
        try {
            Enrollment updated = enrollmentService.updateProgress(enrollmentId, progress);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}