package com.training.trainingscheduler.repository;

import com.training.trainingscheduler.entity.Course;
import com.training.trainingscheduler.entity.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByStatus(CourseStatus status);

}
