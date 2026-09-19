package com.training.trainingscheduler.repository;

import com.training.trainingscheduler.entity.Certificate;
import com.training.trainingscheduler.entity.Course;
import com.training.trainingscheduler.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    Optional<Certificate> findByCertificateCode(String certificateCode);

    Optional<Certificate> findByUserAndCourse(User user, Course course);

    List<Certificate> findByUser(User user);

    List<Certificate> findByUserIn(List<User> users);

}
