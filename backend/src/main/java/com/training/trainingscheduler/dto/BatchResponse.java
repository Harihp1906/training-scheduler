package com.training.trainingscheduler.dto;

import com.training.trainingscheduler.entity.Batch;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class BatchResponse {

    private Long id;
    private String name;
    private String course;
    private int students;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status; // "Upcoming" | "Active" | "Completed" -- derived from today vs. start/end date

    public static BatchResponse from(Batch batch, long studentCount) {
        return new BatchResponse(
                batch.getId(),
                batch.getName(),
                batch.getCourse().getTitle(),
                (int) studentCount,
                batch.getStartDate(),
                batch.getEndDate(),
                computeStatus(batch)
        );
    }

    private static String computeStatus(Batch batch) {
        LocalDate today = LocalDate.now();
        if (today.isBefore(batch.getStartDate())) return "Upcoming";
        if (today.isAfter(batch.getEndDate())) return "Completed";
        return "Active";
    }

}
