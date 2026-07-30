package com.training.trainingscheduler.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String level; // "Beginner", "Intermediate", "Advanced"

    @Column(nullable = false)
    private String duration; // e.g. "8 weeks"

    @Column(nullable = false)
    private Integer totalLessons;

    @Column(nullable = false)
    private String status; // "Active" or "Inactive"

}