package com.training.trainingscheduler.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class AttemptRequest {

    // One entry per question, in order; null/-1 for an unanswered question.
    @NotNull(message = "answers are required")
    private List<Integer> answers;

    private int warningCount = 0;

    private boolean terminated = false;

}
