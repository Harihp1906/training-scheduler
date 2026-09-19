package com.training.trainingscheduler.controller;

import com.training.trainingscheduler.dto.CourseRequest;
import com.training.trainingscheduler.dto.CourseResponse;
import com.training.trainingscheduler.security.AuthUser;
import com.training.trainingscheduler.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // Active courses only -- public catalog
    @GetMapping
    public List<CourseResponse> getActiveCourses() {
        return courseService.getActiveCourses();
    }

    // All courses regardless of status -- admin management view
    @GetMapping("/all")
    public List<CourseResponse> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public CourseResponse getCourseById(@PathVariable Long id, @AuthenticationPrincipal AuthUser currentUser) {
        return courseService.getCourseById(id, currentUser);
    }

    @PostMapping
    public ResponseEntity<CourseResponse> createCourse(@Valid @RequestBody CourseRequest request) {
        return ResponseEntity.status(201).body(courseService.createCourse(request));
    }

    @PutMapping("/{id}")
    public CourseResponse updateCourse(@PathVariable Long id, @Valid @RequestBody CourseRequest request) {
        return courseService.updateCourse(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

}
