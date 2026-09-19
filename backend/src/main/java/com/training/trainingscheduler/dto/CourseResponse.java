package com.training.trainingscheduler.dto;

import com.training.trainingscheduler.entity.Course;
import com.training.trainingscheduler.entity.CourseStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CourseResponse {

    private Long id;
    private String title;
    private String description;
    private String category;
    private String level;
    private String duration;
    private Integer totalLessons;
    private String thumbnailUrl;
    private CourseStatus status;

    public static CourseResponse from(Course course) {
        return new CourseResponse(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getCategory(),
                course.getLevel(),
                course.getDuration(),
                course.getTotalLessons(),
                course.getThumbnailUrl(),
                course.getStatus()
        );
    }

}
