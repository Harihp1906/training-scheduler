package com.training.trainingscheduler.controller;

import com.training.trainingscheduler.dto.CertificateAdminResponse;
import com.training.trainingscheduler.dto.CertificateResponse;
import com.training.trainingscheduler.security.AuthUser;
import com.training.trainingscheduler.service.CertificateService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    // Public verification by human-facing code, e.g. TS-2026-001
    @GetMapping("/{code}")
    public CertificateResponse getByCode(@PathVariable String code) {
        return certificateService.getByCode(code);
    }

    @GetMapping
    public List<CertificateAdminResponse> getAll() {
        return certificateService.getAllForAdmin();
    }

    @GetMapping("/user/{userId}")
    public List<CertificateResponse> getForUser(@AuthenticationPrincipal AuthUser currentUser,
                                                 @PathVariable Long userId) {
        return certificateService.getForUser(currentUser, userId);
    }

    @PutMapping("/{id}/revoke")
    public CertificateAdminResponse revoke(@PathVariable Long id) {
        return certificateService.revoke(id);
    }

}
