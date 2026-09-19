package com.training.trainingscheduler.service;

import com.training.trainingscheduler.dto.AttemptRequest;
import com.training.trainingscheduler.dto.AttemptResponse;
import com.training.trainingscheduler.entity.*;
import com.training.trainingscheduler.exception.ApiException;
import com.training.trainingscheduler.repository.EnrollmentRepository;
import com.training.trainingscheduler.repository.QuizAttemptRepository;
import com.training.trainingscheduler.repository.QuizRepository;
import com.training.trainingscheduler.repository.UserRepository;
import com.training.trainingscheduler.security.AuthUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class QuizAttemptService {

    private static final int MAX_FINAL_EXAM_ATTEMPTS = 3;

    private final QuizRepository quizRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CertificateService certificateService;

    public QuizAttemptService(QuizRepository quizRepository, QuizAttemptRepository quizAttemptRepository,
                               EnrollmentRepository enrollmentRepository, UserRepository userRepository,
                               CertificateService certificateService) {
        this.quizRepository = quizRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.certificateService = certificateService;
    }

    public AttemptResponse submitAttempt(AuthUser currentUser, Long quizId, AttemptRequest request) {
        User user = userRepository.findById(currentUser.id())
                .orElseThrow(() -> ApiException.notFound("User not found"));
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> ApiException.notFound("Quiz not found"));

        Enrollment enrollment = enrollmentRepository.findByUserAndCourse(user, quiz.getCourse())
                .orElseThrow(() -> ApiException.forbidden("You must be enrolled in this course first"));

        List<QuizAttempt> priorAttempts = quizAttemptRepository.findByUserAndQuiz(user, quiz);

        if (quiz.getType() == QuizType.FINAL_EXAM && priorAttempts.size() >= MAX_FINAL_EXAM_ATTEMPTS) {
            throw ApiException.forbidden("No attempts remaining for this exam");
        }

        int total = quiz.getQuestions().size();
        int correct = 0;
        List<Integer> answers = request.getAnswers();
        for (int i = 0; i < total; i++) {
            Integer given = i < answers.size() ? answers.get(i) : null;
            if (given != null && given.equals(quiz.getQuestions().get(i).getCorrectIndex())) {
                correct++;
            }
        }

        int score = total == 0 ? 0 : Math.round(correct * 100f / total);
        boolean passed = !request.isTerminated() && score >= quiz.getPassScorePercent();

        QuizAttempt attempt = new QuizAttempt();
        attempt.setUser(user);
        attempt.setQuiz(quiz);
        attempt.setScore(score);
        attempt.setTotalQuestions(total);
        attempt.setPassed(passed);
        attempt.setWarningCount(request.getWarningCount());
        attempt.setTerminated(request.isTerminated());
        quizAttemptRepository.save(attempt);

        String certificateCode = null;
        if (passed && quiz.getType() == QuizType.FINAL_EXAM) {
            // Passing the final exam is what "completes" a course -- there's no
            // other signal for it (no chapter/lesson model to track otherwise).
            enrollment.setProgress(100);
            enrollment.setStatus(EnrollmentStatus.COMPLETED);
            enrollmentRepository.save(enrollment);

            Certificate certificate = certificateService.issueIfNotExists(user, quiz.getCourse(), score);
            certificateCode = certificate.getCertificateCode();
        }

        Integer attemptsRemaining = quiz.getType() == QuizType.FINAL_EXAM
                ? Math.max(0, MAX_FINAL_EXAM_ATTEMPTS - (priorAttempts.size() + 1))
                : null;

        return new AttemptResponse(score, total, passed, request.isTerminated(), attemptsRemaining, certificateCode);
    }

}
