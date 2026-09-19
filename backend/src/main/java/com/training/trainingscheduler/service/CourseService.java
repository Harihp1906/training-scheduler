package com.training.trainingscheduler.service;

import com.training.trainingscheduler.dto.CourseRequest;
import com.training.trainingscheduler.dto.CourseResponse;
import com.training.trainingscheduler.entity.Course;
import com.training.trainingscheduler.entity.CourseStatus;
import com.training.trainingscheduler.exception.ApiException;
import com.training.trainingscheduler.repository.CourseRepository;
import com.training.trainingscheduler.security.AuthUser;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<CourseResponse> getActiveCourses() {
        return courseRepository.findByStatus(CourseStatus.ACTIVE).stream()
                .map(CourseResponse::from)
                .toList();
    }

    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(CourseResponse::from)
                .toList();
    }

    // Public catalog callers only ever see ACTIVE courses; admins (editing a
    // course, incl. an inactive one) see the full record regardless of status.
    public CourseResponse getCourseById(Long id, AuthUser currentUser) {
        Course course = findCourseOrThrow(id);
        boolean isAdmin = currentUser != null && currentUser.isAdmin();
        if (course.getStatus() != CourseStatus.ACTIVE && !isAdmin) {
            throw ApiException.notFound("Course not found");
        }
        return CourseResponse.from(course);
    }

    public CourseResponse createCourse(CourseRequest request) {
        Course course = new Course();
        applyRequest(course, request);
        course.setStatus(CourseStatus.ACTIVE);
        return CourseResponse.from(courseRepository.save(course));
    }

    public CourseResponse updateCourse(Long id, CourseRequest request) {
        Course course = findCourseOrThrow(id);
        applyRequest(course, request);
        return CourseResponse.from(courseRepository.save(course));
    }

    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw ApiException.notFound("Course not found");
        }
        courseRepository.deleteById(id);
    }

    Course findCourseOrThrow(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Course not found"));
    }

    private void applyRequest(Course course, CourseRequest request) {
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setCategory(request.getCategory());
        course.setLevel(request.getLevel());
        course.setDuration(request.getDuration());
        course.setTotalLessons(request.getTotalLessons());
        course.setThumbnailUrl(request.getThumbnailUrl());
    }

}
