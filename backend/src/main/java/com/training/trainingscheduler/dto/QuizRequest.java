package com.training.trainingscheduler.dto;

import com.training.trainingscheduler.entity.QuizStatus;
import com.training.trainingscheduler.entity.QuizType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class QuizRequest {

    @NotNull(message = "courseId is required")
    private Long courseId;

    @NotNull(message = "type is required")
    private QuizType type;

    @NotBlank(message = "chapter is required")
    private String chapter;

    @Min(value = 5, message = "timeLimitSeconds must be at least 5")
    private int timeLimitSeconds;

    @Min(value = 1, message = "passScorePercent must be between 1 and 100")
    @Max(value = 100, message = "passScorePercent must be between 1 and 100")
    private int passScorePercent;

    private QuizStatus status;

    @NotNull(message = "questions are required")
    @Size(min = 1, message = "A quiz needs at least 1 question")
    private List<@Valid QuestionRequest> questions;

}
