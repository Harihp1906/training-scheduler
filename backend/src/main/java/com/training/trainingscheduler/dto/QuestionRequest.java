package com.training.trainingscheduler.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class QuestionRequest {

    @NotBlank(message = "Question text is required")
    private String text;

    @NotNull(message = "Options are required")
    @Size(min = 2, message = "A question needs at least 2 options")
    private List<@NotBlank(message = "Option text cannot be blank") String> options;

    @NotNull(message = "correctIndex is required")
    @Min(value = 0, message = "correctIndex must be a valid option index")
    private Integer correctIndex;

}
