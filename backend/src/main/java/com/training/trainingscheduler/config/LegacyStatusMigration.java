package com.training.trainingscheduler.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * courses.status used to be free text ("Active" / "Inactive") before it became
 * a real CourseStatus enum stored via EnumType.STRING ("ACTIVE" / "INACTIVE").
 * Any row written under the old format would make Hibernate throw
 * IllegalArgumentException the first time it's read as an entity. Runs as raw
 * SQL -- ahead of DataSeeder, and bypassing JPA's enum mapping entirely --
 * so it can normalize those rows before anything tries to read them.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class LegacyStatusMigration implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public LegacyStatusMigration(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        jdbcTemplate.update("UPDATE courses SET status = 'ACTIVE' WHERE status = 'Active'");
        jdbcTemplate.update("UPDATE courses SET status = 'INACTIVE' WHERE status = 'Inactive'");
    }

}
