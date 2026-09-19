package com.training.trainingscheduler.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class StudentStatusRequest {

    @Pattern(regexp = "Active|Blocked", message = "status must be 'Active' or 'Blocked'")
    private String status;

}
