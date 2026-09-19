package com.training.trainingscheduler.repository;

import com.training.trainingscheduler.entity.Course;
import com.training.trainingscheduler.entity.Enrollment;
import com.training.trainingscheduler.entity.EnrollmentStatus;
import com.training.trainingscheduler.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findByUser(User user);

    List<Enrollment> findByUserIn(List<User> users);

    List<Enrollment> findByCourse(Course course);

    Optional<Enrollment> findByUserAndCourse(User user, Course course);

    long countByStatus(EnrollmentStatus status);

    List<Enrollment> findAllByOrderByEnrolledAtDesc();

}
