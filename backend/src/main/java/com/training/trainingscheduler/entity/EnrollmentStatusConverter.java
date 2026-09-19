package com.training.trainingscheduler.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/** Keeps the DB column storing "In Progress" / "Completed" exactly as before -- see EnrollmentStatus. */
@Converter(autoApply = true)
public class EnrollmentStatusConverter implements AttributeConverter<EnrollmentStatus, String> {

    @Override
    public String convertToDatabaseColumn(EnrollmentStatus status) {
        return status == null ? null : status.getLabel();
    }

    @Override
    public EnrollmentStatus convertToEntityAttribute(String dbValue) {
        return dbValue == null ? null : EnrollmentStatus.fromLabel(dbValue);
    }

}
