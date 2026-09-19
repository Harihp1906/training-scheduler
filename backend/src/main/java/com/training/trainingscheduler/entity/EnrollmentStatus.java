package com.training.trainingscheduler.entity;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * The frontend compares against (and displays) the exact literals "In
 * Progress" / "Completed" -- with the space -- in several pages, so the DB
 * column and JSON responses keep that exact text via {@link #getLabel()}
 * (through EnrollmentStatusConverter and @JsonValue respectively) while the
 * Java side gets a real enum instead of a hand-rolled string constant.
 */
public enum EnrollmentStatus {

    IN_PROGRESS("In Progress"),
    COMPLETED("Completed");

    private final String label;

    EnrollmentStatus(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    public static EnrollmentStatus fromLabel(String label) {
        for (EnrollmentStatus status : values()) {
            if (status.label.equals(label)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown enrollment status: " + label);
    }

}
