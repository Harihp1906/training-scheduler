package com.training.trainingscheduler.service;

import com.training.trainingscheduler.dto.AdminStudentResponse;
import com.training.trainingscheduler.entity.Enrollment;
import com.training.trainingscheduler.entity.Role;
import com.training.trainingscheduler.entity.User;
import com.training.trainingscheduler.entity.UserStatus;
import com.training.trainingscheduler.exception.ApiException;
import com.training.trainingscheduler.repository.CertificateRepository;
import com.training.trainingscheduler.repository.EnrollmentRepository;
import com.training.trainingscheduler.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminStudentService {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CertificateRepository certificateRepository;

    public AdminStudentService(UserRepository userRepository, EnrollmentRepository enrollmentRepository,
                                CertificateRepository certificateRepository) {
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.certificateRepository = certificateRepository;
    }

    public List<AdminStudentResponse> getAllStudents() {
        List<User> students = userRepository.findByRole(Role.STUDENT);

        // One findByUserIn() per relation instead of one findByUser() per
        // student, so this stays O(1) queries regardless of student count.
        Map<Long, List<Enrollment>> enrollmentsByUserId = enrollmentRepository.findByUserIn(students).stream()
                .collect(Collectors.groupingBy(e -> e.getUser().getId()));
        Map<Long, Long> certCountByUserId = certificateRepository.findByUserIn(students).stream()
                .collect(Collectors.groupingBy(c -> c.getUser().getId(), Collectors.counting()));

        return students.stream()
                .map(user -> toResponse(user,
                        enrollmentsByUserId.getOrDefault(user.getId(), List.of()),
                        certCountByUserId.getOrDefault(user.getId(), 0L)))
                .toList();
    }

    public AdminStudentResponse setStatus(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("Student not found"));
        if (user.getRole() != Role.STUDENT) {
            throw ApiException.badRequest("Only student accounts can be blocked/unblocked");
        }
        user.setStatus("Active".equals(status) ? UserStatus.ACTIVE : UserStatus.BLOCKED);
        return toResponse(userRepository.save(user));
    }

    private AdminStudentResponse toResponse(User user) {
        return toResponse(user, enrollmentRepository.findByUser(user), certificateRepository.findByUser(user).size());
    }

    private AdminStudentResponse toResponse(User user, List<Enrollment> enrollments, long certCount) {
        int avgProgress = enrollments.isEmpty()
                ? 0
                : (int) Math.round(enrollments.stream().mapToInt(Enrollment::getProgress).average().orElse(0));

        return new AdminStudentResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                enrollments.size(),
                avgProgress,
                (int) certCount,
                user.getStatus() == UserStatus.ACTIVE ? "Active" : "Blocked"
        );
    }

}
