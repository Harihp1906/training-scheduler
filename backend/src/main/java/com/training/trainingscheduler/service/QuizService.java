package com.training.trainingscheduler.service;

import com.training.trainingscheduler.dto.QuestionRequest;
import com.training.trainingscheduler.dto.QuizAdminResponse;
import com.training.trainingscheduler.dto.QuizRequest;
import com.training.trainingscheduler.dto.QuizStudentResponse;
import com.training.trainingscheduler.entity.Course;
import com.training.trainingscheduler.entity.Question;
import com.training.trainingscheduler.entity.Quiz;
import com.training.trainingscheduler.entity.QuizStatus;
import com.training.trainingscheduler.entity.QuizType;
import com.training.trainingscheduler.exception.ApiException;
import com.training.trainingscheduler.repository.CourseRepository;
import com.training.trainingscheduler.repository.QuizAttemptRepository;
import com.training.trainingscheduler.repository.QuizRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Methods here are @Transactional because Quiz.questions is a lazy
 * @OneToMany and open-in-view is disabled -- without an open session, mapping
 * to a response DTO after the repository call returns throws
 * LazyInitializationException.
 */
@Service
@Transactional
public class QuizService {

    private final QuizRepository quizRepository;
    private final CourseRepository courseRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    public QuizService(QuizRepository quizRepository, CourseRepository courseRepository,
                        QuizAttemptRepository quizAttemptRepository) {
        this.quizRepository = quizRepository;
        this.courseRepository = courseRepository;
        this.quizAttemptRepository = quizAttemptRepository;
    }

    public QuizStudentResponse getQuizForCourse(Long courseId, QuizType type) {
        Quiz quiz = quizRepository.findFirstByCourseIdAndType(courseId, type)
                .orElseThrow(() -> ApiException.notFound(
                        (type == QuizType.FINAL_EXAM ? "Final exam" : "Quiz") + " not found for this course"));
        return QuizStudentResponse.from(quiz);
    }

    public List<QuizAdminResponse> getAllForAdmin() {
        List<Quiz> quizzes = quizRepository.findAll();

        // One findAll() + in-memory grouping instead of a countByQuiz() per
        // quiz, so this stays O(1) queries regardless of quiz count.
        Map<Long, Long> attemptCountByQuizId = quizAttemptRepository.findAll().stream()
                .collect(Collectors.groupingBy(a -> a.getQuiz().getId(), Collectors.counting()));

        return quizzes.stream()
                .map(quiz -> QuizAdminResponse.from(quiz, attemptCountByQuizId.getOrDefault(quiz.getId(), 0L)))
                .toList();
    }

    public QuizAdminResponse createQuiz(QuizRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> ApiException.notFound("Course not found"));

        Quiz quiz = new Quiz();
        quiz.setCourse(course);
        applyRequest(quiz, request);

        Quiz saved = quizRepository.save(quiz);
        return QuizAdminResponse.from(saved, 0);
    }

    public QuizAdminResponse updateQuiz(Long id, QuizRequest request) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Quiz not found"));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> ApiException.notFound("Course not found"));

        quiz.setCourse(course);
        applyRequest(quiz, request);

        Quiz saved = quizRepository.save(quiz);
        return QuizAdminResponse.from(saved, quizAttemptRepository.countByQuiz(saved));
    }

    public void deleteQuiz(Long id) {
        if (!quizRepository.existsById(id)) {
            throw ApiException.notFound("Quiz not found");
        }
        quizRepository.deleteById(id);
    }

    Quiz findQuizOrThrow(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Quiz not found"));
    }

    private void applyRequest(Quiz quiz, QuizRequest request) {
        quiz.setType(request.getType());
        quiz.setChapter(request.getChapter());
        quiz.setTimeLimitSeconds(request.getTimeLimitSeconds());
        quiz.setPassScorePercent(request.getPassScorePercent());
        quiz.setStatus(request.getStatus() != null ? request.getStatus() : QuizStatus.ACTIVE);

        quiz.getQuestions().clear();
        for (QuestionRequest qr : request.getQuestions()) {
            if (qr.getCorrectIndex() >= qr.getOptions().size()) {
                throw ApiException.badRequest("correctIndex is out of range for question: " + qr.getText());
            }
            Question question = new Question();
            question.setQuiz(quiz);
            question.setText(qr.getText());
            question.setOptions(qr.getOptions());
            question.setCorrectIndex(qr.getCorrectIndex());
            quiz.getQuestions().add(question);
        }
    }

}
