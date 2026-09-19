package com.training.trainingscheduler.controller;

import com.training.trainingscheduler.dto.QuizAdminResponse;
import com.training.trainingscheduler.dto.QuizRequest;
import com.training.trainingscheduler.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/quizzes")
public class AdminQuizController {

    private final QuizService quizService;

    public AdminQuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping
    public List<QuizAdminResponse> getAll() {
        return quizService.getAllForAdmin();
    }

    @PostMapping
    public ResponseEntity<QuizAdminResponse> create(@Valid @RequestBody QuizRequest request) {
        return ResponseEntity.status(201).body(quizService.createQuiz(request));
    }

    @PutMapping("/{id}")
    public QuizAdminResponse update(@PathVariable Long id, @Valid @RequestBody QuizRequest request) {
        return quizService.updateQuiz(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }

}
