package com.training.trainingscheduler.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminStudentResponse {

    private Long id;
    private String name;
    private String email;
    private int courses;
    private int progress;
    private int certificates;
    private String status; // "Active" | "Blocked"

}
