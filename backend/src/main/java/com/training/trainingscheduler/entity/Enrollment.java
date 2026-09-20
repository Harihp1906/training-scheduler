package com.training.trainingscheduler.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id")
    private Course course;

    // Nullable -- an enrollment starts unassigned and an admin opts it into a
    // batch of the same course later (see BatchService).
    @ManyToOne
    @JoinColumn(name = "batch_id")
    private Batch batch;

    @Column(nullable = false)
    private int progress;

    // See EnrollmentStatus / EnrollmentStatusConverter -- stored and serialized
    // as "In Progress" / "Completed" (with the space) to match the frontend.
    @Column(nullable = false)
    private EnrollmentStatus status;

    @Column(nullable = false)
    private LocalDateTime enrolledAt;

    @PrePersist
    public void prePersist() {
        this.enrolledAt = LocalDateTime.now();
    }

}
