package com.training.trainingscheduler.service;

import com.training.trainingscheduler.dto.CertificateAdminResponse;
import com.training.trainingscheduler.dto.CertificateResponse;
import com.training.trainingscheduler.entity.Certificate;
import com.training.trainingscheduler.entity.CertificateStatus;
import com.training.trainingscheduler.entity.Course;
import com.training.trainingscheduler.entity.User;
import com.training.trainingscheduler.exception.ApiException;
import com.training.trainingscheduler.repository.CertificateRepository;
import com.training.trainingscheduler.repository.UserRepository;
import com.training.trainingscheduler.security.AuthUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;

@Service
@Transactional
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final Object certificateCodeLock = new Object();

    public CertificateService(CertificateRepository certificateRepository, UserRepository userRepository) {
        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
    }

    /** Issues a certificate for a passed final exam, or returns the existing one if already issued. */
    public Certificate issueIfNotExists(User user, Course course, int score) {
        return certificateRepository.findByUserAndCourse(user, course)
                .orElseGet(() -> {
                    // Serialize code generation+save so two concurrent passes never read the same
                    // certificateRepository.count() and collide on the unique certificateCode column.
                    synchronized (certificateCodeLock) {
                        Certificate certificate = new Certificate();
                        certificate.setCertificateCode(generateCertificateCode());
                        certificate.setUser(user);
                        certificate.setCourse(course);
                        certificate.setScore(score);
                        certificate.setGrade(gradeFor(score));
                        certificate.setStatus(CertificateStatus.VALID);
                        return certificateRepository.save(certificate);
                    }
                });
    }

    public CertificateResponse getByCode(String code) {
        Certificate certificate = certificateRepository.findByCertificateCode(code)
                .orElseThrow(() -> ApiException.notFound("Certificate not found"));
        return CertificateResponse.from(certificate);
    }

    public List<CertificateAdminResponse> getAllForAdmin() {
        return certificateRepository.findAll().stream()
                .map(CertificateAdminResponse::from)
                .toList();
    }

    public List<CertificateResponse> getForUser(AuthUser currentUser, Long userId) {
        currentUser.requireOwnerOrAdmin(userId, "You can only access your own certificates");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found"));

        return certificateRepository.findByUser(user).stream()
                .map(CertificateResponse::from)
                .toList();
    }

    public CertificateAdminResponse revoke(Long id) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Certificate not found"));
        certificate.setStatus(CertificateStatus.REVOKED);
        return CertificateAdminResponse.from(certificateRepository.save(certificate));
    }

    private String gradeFor(int score) {
        if (score >= 90) return "Distinction";
        if (score >= 75) return "Merit";
        return "Pass";
    }

    private String generateCertificateCode() {
        return String.format("TS-%d-%03d", Year.now().getValue(), certificateRepository.count() + 1);
    }

}
