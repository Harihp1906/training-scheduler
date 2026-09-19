package com.training.trainingscheduler.controller;

import com.training.trainingscheduler.dto.AdminStudentResponse;
import com.training.trainingscheduler.dto.StudentStatusRequest;
import com.training.trainingscheduler.service.AdminStudentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/students")
public class AdminStudentController {

    private final AdminStudentService adminStudentService;

    public AdminStudentController(AdminStudentService adminStudentService) {
        this.adminStudentService = adminStudentService;
    }

    @GetMapping
    public List<AdminStudentResponse> getAll() {
        return adminStudentService.getAllStudents();
    }

    @PutMapping("/{id}/status")
    public AdminStudentResponse setStatus(@PathVariable Long id, @Valid @RequestBody StudentStatusRequest request) {
        return adminStudentService.setStatus(id, request.getStatus());
    }

}
