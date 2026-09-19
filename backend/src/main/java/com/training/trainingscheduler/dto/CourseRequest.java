package com.training.trainingscheduler.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CourseRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Level is required")
    private String level;

    @NotBlank(message = "Duration is required")
    private String duration;

    @NotNull(message = "Total lessons is required")
    @Min(value = 1, message = "Total lessons must be at least 1")
    private Integer totalLessons;

    // Optional
    private String thumbnailUrl;

}
