package com.training.trainingscheduler.controller;

import com.training.trainingscheduler.dto.AdminStatsResponse;
import com.training.trainingscheduler.dto.RecentStudentResponse;
import com.training.trainingscheduler.dto.ReportsResponse;
import com.training.trainingscheduler.service.AdminDashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    public AdminDashboardController(AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping("/stats")
    public AdminStatsResponse getStats() {
        return adminDashboardService.getStats();
    }

    @GetMapping("/students/recent")
    public List<RecentStudentResponse> getRecentStudents() {
        return adminDashboardService.getRecentStudents();
    }

    @GetMapping("/reports")
    public ReportsResponse getReports() {
        return adminDashboardService.getReports();
    }

}
