package com.training.trainingscheduler.controller;

import com.training.trainingscheduler.dto.AttemptRequest;
import com.training.trainingscheduler.dto.AttemptResponse;
import com.training.trainingscheduler.dto.QuizStudentResponse;
import com.training.trainingscheduler.entity.QuizType;
import com.training.trainingscheduler.security.AuthUser;
import com.training.trainingscheduler.service.QuizAttemptService;
import com.training.trainingscheduler.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class QuizController {

    private final QuizService quizService;
    private final QuizAttemptService quizAttemptService;

    public QuizController(QuizService quizService, QuizAttemptService quizAttemptService) {
        this.quizService = quizService;
        this.quizAttemptService = quizAttemptService;
    }

    @GetMapping("/courses/{courseId}/quiz")
    public QuizStudentResponse getPracticeQuiz(@PathVariable Long courseId) {
        return quizService.getQuizForCourse(courseId, QuizType.PRACTICE);
    }

    @GetMapping("/courses/{courseId}/exam")
    public QuizStudentResponse getFinalExam(@PathVariable Long courseId) {
        return quizService.getQuizForCourse(courseId, QuizType.FINAL_EXAM);
    }

    @PostMapping("/quizzes/{quizId}/attempts")
    public AttemptResponse submitAttempt(@AuthenticationPrincipal AuthUser currentUser,
                                          @PathVariable Long quizId,
                                          @Valid @RequestBody AttemptRequest request) {
        return quizAttemptService.submitAttempt(currentUser, quizId, request);
    }

}
