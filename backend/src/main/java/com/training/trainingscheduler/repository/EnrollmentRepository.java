package com.training.trainingscheduler.repository;

import com.training.trainingscheduler.entity.Enrollment;
import com.training.trainingscheduler.entity.User;
import com.training.trainingscheduler.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    // Get all enrollments for a specific student
    List<Enrollment> findByUser(User user);

    // Get all enrollments for a specific course
    List<Enrollment> findByCourse(Course course);

    // Check if a student is already enrolled in a course
    Optional<Enrollment> findByUserAndCourse(User user, Course course);

    // Check if enrollment exists
    boolean existsByUserAndCourse(User user, Course course);

}