package com.training.trainingscheduler.controller;

import com.training.trainingscheduler.entity.Course;
import com.training.trainingscheduler.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    // GET all courses (admin)
    @GetMapping("/all")
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    // GET active courses only (students)
    @GetMapping
    public List<Course> getActiveCourses() {
        return courseService.getActiveCourses();
    }

    // GET single course by ID
    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    // POST create new course (admin)
    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        return courseService.createCourse(course);
    }

    // PUT update course (admin)
    @PutMapping("/{id}")
    public Course updateCourse(@PathVariable Long id, @RequestBody Course course) {
        return courseService.updateCourse(id, course);
    }

    // DELETE course (admin)
    @DeleteMapping("/{id}")
    public String deleteCourse(@PathVariable Long id) {
        return courseService.deleteCourse(id);
    }

}