package com.training.trainingscheduler.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AttemptResponse {

    private int score;
    private int totalQuestions;
    private boolean passed;
    private boolean terminated;
    // Only meaningful for FINAL_EXAM quizzes; null for PRACTICE (unlimited retries).
    private Integer attemptsRemaining;
    // Set only when this attempt just passed a final exam.
    private String certificateCode;

}
