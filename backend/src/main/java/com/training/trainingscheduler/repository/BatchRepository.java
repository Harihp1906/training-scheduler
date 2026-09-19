package com.training.trainingscheduler.repository;

import com.training.trainingscheduler.entity.Batch;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchRepository extends JpaRepository<Batch, Long> {
}
