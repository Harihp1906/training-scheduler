package com.training.trainingscheduler.repository;

import com.training.trainingscheduler.entity.Quiz;
import com.training.trainingscheduler.entity.QuizType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    Optional<Quiz> findFirstByCourseIdAndType(Long courseId, QuizType type);

    List<Quiz> findByCourseId(Long courseId);

}
