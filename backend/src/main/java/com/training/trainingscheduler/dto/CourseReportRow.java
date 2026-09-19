package com.training.trainingscheduler.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CourseReportRow {

    private String title;
    private long students;
    private int completionRate; // percent of enrollments with status "Completed"

}
