package com.training.trainingscheduler.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProgressRequest {

    @NotNull(message = "progress is required")
    @Min(value = 0, message = "progress cannot be negative")
    @Max(value = 100, message = "progress cannot exceed 100")
    private Integer progress;

}
