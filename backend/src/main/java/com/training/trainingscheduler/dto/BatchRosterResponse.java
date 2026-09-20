package com.training.trainingscheduler.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

/** A batch's current members plus the course's enrollments still up for grabs. */
@Data
@AllArgsConstructor
public class BatchRosterResponse {

    private List<EnrollmentAdminResponse> assigned;
    private List<EnrollmentAdminResponse> eligible;

}
