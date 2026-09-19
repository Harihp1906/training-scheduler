package com.training.trainingscheduler.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminStatsResponse {

    private long totalStudents;
    private long totalCourses;
    private long certificatesIssued;
    private long activeExams;

}
