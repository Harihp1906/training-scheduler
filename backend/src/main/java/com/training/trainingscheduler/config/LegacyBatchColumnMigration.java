package com.training.trainingscheduler.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * batches.students used to be a manually maintained NOT NULL counter that
 * nothing ever incremented. It's now a value computed from enrollments
 * (see BatchService/EnrollmentRepository#countByBatch), so the entity no
 * longer declares the column -- but ddl-auto=update never drops or relaxes
 * columns it doesn't recognize anymore, so the old NOT NULL constraint would
 * otherwise reject every batch insert. Runs as raw SQL, ahead of anything
 * that might create a Batch.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class LegacyBatchColumnMigration implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public LegacyBatchColumnMigration(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        jdbcTemplate.execute("ALTER TABLE batches DROP COLUMN IF EXISTS students");
    }

}
