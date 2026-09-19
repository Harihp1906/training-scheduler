package com.training.trainingscheduler.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BatchRequest {

    @NotBlank(message = "Batch name is required")
    private String name;

    @NotNull(message = "courseId is required")
    private Long courseId;

    @NotNull(message = "startDate is required")
    private LocalDate startDate;

    @NotNull(message = "endDate is required")
    private LocalDate endDate;

}
