package com.training.trainingscheduler.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecentStudentResponse {

    private Long id;
    private String name;
    private String email;
    private String course;
    private int progress;
    private String status; // "Active" | "Completed" -- single word, mirrors enrollment progress state

}
