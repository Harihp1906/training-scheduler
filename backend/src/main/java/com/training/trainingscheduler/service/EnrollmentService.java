package com.training.trainingscheduler.service;

import com.training.trainingscheduler.entity.Course;
import com.training.trainingscheduler.entity.Enrollment;
import com.training.trainingscheduler.entity.User;
import com.training.trainingscheduler.repository.CourseRepository;
import com.training.trainingscheduler.repository.EnrollmentRepository;
import com.training.trainingscheduler.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    // Enroll a student into a course
    public Enrollment enrollStudent(Long userId, Long courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Prevent duplicate enrollment
        Optional<Enrollment> existing = enrollmentRepository.findByUserAndCourse(user, course);
        if (existing.isPresent()) {
            throw new RuntimeException("Already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setProgress(0);
        enrollment.setStatus("In Progress");

        return enrollmentRepository.save(enrollment);
    }

    // Get all enrollments for a specific student
    public List<Enrollment> getEnrollmentsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return enrollmentRepository.findByUser(user);
    }

    // Get all enrollments for a specific course (admin use)
    public List<Enrollment> getEnrollmentsByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return enrollmentRepository.findByCourse(course);
    }

    // Update progress
    public Enrollment updateProgress(Long enrollmentId, int progress) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        enrollment.setProgress(progress);
        if (progress >= 100) {
            enrollment.setStatus("Completed");
        }
        return enrollmentRepository.save(enrollment);
    }
}