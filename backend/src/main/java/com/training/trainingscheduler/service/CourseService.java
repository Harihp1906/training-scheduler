package com.training.trainingscheduler.service;

import com.training.trainingscheduler.entity.Course;
import com.training.trainingscheduler.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    // Get all courses (for admin)
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Get only active courses (for students)
    public List<Course> getActiveCourses() {
        return courseRepository.findByStatus("Active");
    }

    // Get single course by ID
    public Course getCourseById(Long id) {
        return courseRepository.findById(id).orElse(null);
    }

    // Create new course (admin only)
    public Course createCourse(Course course) {
        course.setStatus("Active");
        return courseRepository.save(course);
    }

    // Update existing course (admin only)
    public Course updateCourse(Long id, Course updatedCourse) {
        Course existing = courseRepository.findById(id).orElse(null);
        if (existing == null) return null;

        existing.setTitle(updatedCourse.getTitle());
        existing.setDescription(updatedCourse.getDescription());
        existing.setCategory(updatedCourse.getCategory());
        existing.setLevel(updatedCourse.getLevel());
        existing.setDuration(updatedCourse.getDuration());
        existing.setTotalLessons(updatedCourse.getTotalLessons());
        existing.setStatus(updatedCourse.getStatus());

        return courseRepository.save(existing);
    }

    // Delete course (admin only)
    public String deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            return "Course not found!";
        }
        courseRepository.deleteById(id);
        return "Course deleted successfully!";
    }

}