package com.training.trainingscheduler.service;

import com.training.trainingscheduler.dto.*;
import com.training.trainingscheduler.entity.*;
import com.training.trainingscheduler.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminDashboardService {

    private static final int RECENT_STUDENTS_LIMIT = 5;

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CertificateRepository certificateRepository;
    private final QuizRepository quizRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    public AdminDashboardService(UserRepository userRepository, CourseRepository courseRepository,
                                  EnrollmentRepository enrollmentRepository, CertificateRepository certificateRepository,
                                  QuizRepository quizRepository, QuizAttemptRepository quizAttemptRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.certificateRepository = certificateRepository;
        this.quizRepository = quizRepository;
        this.quizAttemptRepository = quizAttemptRepository;
    }

    public AdminStatsResponse getStats() {
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        long totalCourses = courseRepository.count();
        long certificatesIssued = certificateRepository.count();
        long activeExams = quizRepository.findAll().stream()
                .filter(q -> q.getType() == QuizType.FINAL_EXAM && q.getStatus() == QuizStatus.ACTIVE)
                .count();

        return new AdminStatsResponse(totalStudents, totalCourses, certificatesIssued, activeExams);
    }

    public List<RecentStudentResponse> getRecentStudents() {
        Map<Long, Enrollment> mostRecentPerUser = new LinkedHashMap<>();
        for (Enrollment enrollment : enrollmentRepository.findAllByOrderByEnrolledAtDesc()) {
            mostRecentPerUser.putIfAbsent(enrollment.getUser().getId(), enrollment);
            if (mostRecentPerUser.size() >= RECENT_STUDENTS_LIMIT) break;
        }

        return mostRecentPerUser.values().stream()
                .map(e -> new RecentStudentResponse(
                        e.getUser().getId(),
                        e.getUser().getFullName(),
                        e.getUser().getEmail(),
                        e.getCourse().getTitle(),
                        e.getProgress(),
                        e.getStatus() == EnrollmentStatus.COMPLETED ? "Completed" : "Active"
                ))
                .toList();
    }

    public ReportsResponse getReports() {
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        long coursesCompleted = enrollmentRepository.countByStatus(EnrollmentStatus.COMPLETED);
        long certificatesIssued = certificateRepository.count();

        List<Course> courses = courseRepository.findAll();

        // One findAll() per entity + in-memory grouping instead of a
        // findByCourse/count query per course, so this stays O(1) queries
        // regardless of how many courses/quizzes exist.
        Map<Long, List<Enrollment>> enrollmentsByCourseId = enrollmentRepository.findAll().stream()
                .collect(Collectors.groupingBy(e -> e.getCourse().getId()));

        List<CourseReportRow> topCourses = courses.stream()
                .map(course -> {
                    List<Enrollment> enrollments = enrollmentsByCourseId.getOrDefault(course.getId(), List.of());
                    long completed = enrollments.stream().filter(e -> e.getStatus() == EnrollmentStatus.COMPLETED).count();
                    int completionRate = enrollments.isEmpty() ? 0 : (int) Math.round(completed * 100.0 / enrollments.size());
                    return new CourseReportRow(course.getTitle(), enrollments.size(), completionRate);
                })
                .sorted((a, b) -> Long.compare(b.getStudents(), a.getStudents()))
                .limit(5)
                .toList();

        Map<Long, Quiz> finalExamByCourseId = quizRepository.findAll().stream()
                .filter(q -> q.getType() == QuizType.FINAL_EXAM)
                .collect(Collectors.toMap(q -> q.getCourse().getId(), q -> q, (a, b) -> a));

        Map<Long, List<QuizAttempt>> attemptsByQuizId = quizAttemptRepository.findAll().stream()
                .collect(Collectors.groupingBy(a -> a.getQuiz().getId()));

        List<ExamReportRow> examStats = courses.stream()
                .map(course -> {
                    Quiz quiz = finalExamByCourseId.get(course.getId());
                    if (quiz == null) return null;
                    List<QuizAttempt> attempts = attemptsByQuizId.getOrDefault(quiz.getId(), List.of());
                    long total = attempts.size();
                    long passed = attempts.stream().filter(QuizAttempt::isPassed).count();
                    int passRate = total == 0 ? 0 : (int) Math.round(passed * 100.0 / total);
                    return new ExamReportRow(course.getTitle(), total, passed, total - passed, passRate);
                })
                .filter(Objects::nonNull)
                .toList();

        return new ReportsResponse(totalStudents, coursesCompleted, certificatesIssued, topCourses, examStats);
    }

}
