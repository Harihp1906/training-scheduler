package com.training.trainingscheduler.dto;

import com.training.trainingscheduler.entity.Certificate;
import com.training.trainingscheduler.entity.CertificateStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

/** Certificate as seen publicly (verification) or by its owner -- no email. */
@Data
@AllArgsConstructor
public class CertificateResponse {

    private Long id;
    private String certificateCode;
    private String studentName;
    private Long courseId;
    private String courseName;
    private int score;
    private String grade;
    private LocalDateTime issuedAt;
    private CertificateStatus status;

    public static CertificateResponse from(Certificate certificate) {
        return new CertificateResponse(
                certificate.getId(),
                certificate.getCertificateCode(),
                certificate.getUser().getFullName(),
                certificate.getCourse().getId(),
                certificate.getCourse().getTitle(),
                certificate.getScore(),
                certificate.getGrade(),
                certificate.getIssuedAt(),
                certificate.getStatus()
        );
    }

}
