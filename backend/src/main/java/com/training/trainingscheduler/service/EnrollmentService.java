package com.training.trainingscheduler.service;

import com.training.trainingscheduler.dto.EnrollRequest;
import com.training.trainingscheduler.dto.EnrollmentAdminResponse;
import com.training.trainingscheduler.dto.EnrollmentResponse;
import com.training.trainingscheduler.entity.Course;
import com.training.trainingscheduler.entity.Enrollment;
import com.training.trainingscheduler.entity.EnrollmentStatus;
import com.training.trainingscheduler.entity.User;
import com.training.trainingscheduler.exception.ApiException;
import com.training.trainingscheduler.repository.CourseRepository;
import com.training.trainingscheduler.repository.EnrollmentRepository;
import com.training.trainingscheduler.repository.UserRepository;
import com.training.trainingscheduler.security.AuthUser;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentService {

    private static final EnrollmentStatus STATUS_IN_PROGRESS = EnrollmentStatus.IN_PROGRESS;
    private static final EnrollmentStatus STATUS_COMPLETED = EnrollmentStatus.COMPLETED;

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository, UserRepository userRepository,
                              CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    public EnrollmentResponse enroll(AuthUser currentUser, EnrollRequest request) {
        User user = userRepository.findById(currentUser.id())
                .orElseThrow(() -> ApiException.notFound("User not found"));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> ApiException.notFound("Course not found"));

        Optional<Enrollment> existing = enrollmentRepository.findByUserAndCourse(user, course);
        if (existing.isPresent()) {
            throw ApiException.conflict("Already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setProgress(0);
        enrollment.setStatus(STATUS_IN_PROGRESS);

        return EnrollmentResponse.from(enrollmentRepository.save(enrollment));
    }

    public List<EnrollmentResponse> getEnrollmentsForUser(AuthUser currentUser, Long userId) {
        currentUser.requireOwnerOrAdmin(userId, "You can only access your own enrollments");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found"));

        return enrollmentRepository.findByUser(user).stream()
                .map(EnrollmentResponse::from)
                .toList();
    }

    public List<EnrollmentAdminResponse> getEnrollmentsForCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> ApiException.notFound("Course not found"));

        return enrollmentRepository.findByCourse(course).stream()
                .map(EnrollmentAdminResponse::from)
                .toList();
    }

    public EnrollmentResponse updateProgress(AuthUser currentUser, Long enrollmentId, int progress) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> ApiException.notFound("Enrollment not found"));

        currentUser.requireOwnerOrAdmin(enrollment.getUser().getId(), "You can only access your own enrollments");

        enrollment.setProgress(progress);
        enrollment.setStatus(progress >= 100 ? STATUS_COMPLETED : STATUS_IN_PROGRESS);

        return EnrollmentResponse.from(enrollmentRepository.save(enrollment));
    }

}
