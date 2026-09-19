package com.training.trainingscheduler.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExamReportRow {

    private String course;
    private long totalAttempts;
    private long passed;
    private long failed;
    private int passRate; // percent

}
