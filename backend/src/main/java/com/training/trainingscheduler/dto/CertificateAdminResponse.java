package com.training.trainingscheduler.dto;

import com.training.trainingscheduler.entity.Certificate;
import com.training.trainingscheduler.entity.CertificateStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

/** Certificate as seen by an admin -- includes the student's email. */
@Data
@AllArgsConstructor
public class CertificateAdminResponse {

    private Long id;
    private String certificateCode;
    private String studentName;
    private String studentEmail;
    private Long courseId;
    private String courseName;
    private int score;
    private String grade;
    private LocalDateTime issuedAt;
    private CertificateStatus status;

    public static CertificateAdminResponse from(Certificate certificate) {
        return new CertificateAdminResponse(
                certificate.getId(),
                certificate.getCertificateCode(),
                certificate.getUser().getFullName(),
                certificate.getUser().getEmail(),
                certificate.getCourse().getId(),
                certificate.getCourse().getTitle(),
                certificate.getScore(),
                certificate.getGrade(),
                certificate.getIssuedAt(),
                certificate.getStatus()
        );
    }

}
