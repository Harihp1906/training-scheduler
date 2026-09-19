package com.training.trainingscheduler.repository;

import com.training.trainingscheduler.entity.Quiz;
import com.training.trainingscheduler.entity.QuizAttempt;
import com.training.trainingscheduler.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    List<QuizAttempt> findByUserAndQuiz(User user, Quiz quiz);

    long countByQuiz(Quiz quiz);

    long countByQuizAndPassed(Quiz quiz, boolean passed);

}
