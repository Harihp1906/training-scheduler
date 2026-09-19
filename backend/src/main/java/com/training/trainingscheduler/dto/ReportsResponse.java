package com.training.trainingscheduler.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

/** No revenue field -- Course has no price and there's no Payment entity, so it can't be computed honestly. */
@Data
@AllArgsConstructor
public class ReportsResponse {

    private long totalStudents;
    private long coursesCompleted;
    private long certificatesIssued;
    private List<CourseReportRow> topCourses;
    private List<ExamReportRow> examStats;

}
