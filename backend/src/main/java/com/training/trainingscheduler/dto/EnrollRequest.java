package com.training.trainingscheduler.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EnrollRequest {

    @NotNull(message = "courseId is required")
    private Long courseId;

}
