package com.training.trainingscheduler.service;

import com.training.trainingscheduler.dto.BatchRequest;
import com.training.trainingscheduler.dto.BatchResponse;
import com.training.trainingscheduler.dto.BatchRosterResponse;
import com.training.trainingscheduler.dto.EnrollmentAdminResponse;
import com.training.trainingscheduler.entity.Batch;
import com.training.trainingscheduler.entity.Course;
import com.training.trainingscheduler.entity.Enrollment;
import com.training.trainingscheduler.exception.ApiException;
import com.training.trainingscheduler.repository.BatchRepository;
import com.training.trainingscheduler.repository.CourseRepository;
import com.training.trainingscheduler.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BatchService {

    private final BatchRepository batchRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public BatchService(BatchRepository batchRepository, CourseRepository courseRepository,
                         EnrollmentRepository enrollmentRepository) {
        this.batchRepository = batchRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public List<BatchResponse> getAll() {
        return batchRepository.findAll().stream()
                .map(batch -> BatchResponse.from(batch, enrollmentRepository.countByBatch(batch)))
                .toList();
    }

    public BatchRosterResponse getRoster(Long batchId) {
        Batch batch = findBatchOrThrow(batchId);

        List<EnrollmentAdminResponse> assigned = enrollmentRepository.findByBatch(batch).stream()
                .map(EnrollmentAdminResponse::from)
                .toList();
        List<EnrollmentAdminResponse> eligible = enrollmentRepository.findByCourseAndBatchIsNull(batch.getCourse()).stream()
                .map(EnrollmentAdminResponse::from)
                .toList();

        return new BatchRosterResponse(assigned, eligible);
    }

    public void assignStudent(Long batchId, Long enrollmentId) {
        Batch batch = findBatchOrThrow(batchId);
        Enrollment enrollment = findEnrollmentOrThrow(enrollmentId);

        if (!enrollment.getCourse().getId().equals(batch.getCourse().getId())) {
            throw ApiException.badRequest("Enrollment is not for this batch's course");
        }
        if (enrollment.getBatch() != null) {
            throw ApiException.conflict("Student is already assigned to a batch for this course");
        }

        enrollment.setBatch(batch);
        enrollmentRepository.save(enrollment);
    }

    public void removeStudent(Long batchId, Long enrollmentId) {
        Batch batch = findBatchOrThrow(batchId);
        Enrollment enrollment = findEnrollmentOrThrow(enrollmentId);

        if (enrollment.getBatch() == null || !enrollment.getBatch().getId().equals(batch.getId())) {
            throw ApiException.badRequest("Student is not assigned to this batch");
        }

        enrollment.setBatch(null);
        enrollmentRepository.save(enrollment);
    }

    private Batch findBatchOrThrow(Long batchId) {
        return batchRepository.findById(batchId)
                .orElseThrow(() -> ApiException.notFound("Batch not found"));
    }

    private Enrollment findEnrollmentOrThrow(Long enrollmentId) {
        return enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> ApiException.notFound("Enrollment not found"));
    }

    public BatchResponse create(BatchRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> ApiException.notFound("Course not found"));

        Batch batch = new Batch();
        batch.setCourse(course);
        applyRequest(batch, request, course);

        return BatchResponse.from(batchRepository.save(batch), 0);
    }

    public BatchResponse update(Long id, BatchRequest request) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Batch not found"));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> ApiException.notFound("Course not found"));

        applyRequest(batch, request, course);
        Batch saved = batchRepository.save(batch);

        return BatchResponse.from(saved, enrollmentRepository.countByBatch(saved));
    }

    public void delete(Long id) {
        Batch batch = findBatchOrThrow(id);

        // Unassign rather than cascade-delete -- removing a batch shouldn't
        // touch the underlying enrollments, just free the students back up.
        List<Enrollment> assigned = enrollmentRepository.findByBatch(batch);
        assigned.forEach(enrollment -> enrollment.setBatch(null));
        enrollmentRepository.saveAll(assigned);

        batchRepository.delete(batch);
    }

    private void applyRequest(Batch batch, BatchRequest request, Course course) {
        if (!request.getEndDate().isAfter(request.getStartDate())) {
            throw ApiException.badRequest("endDate must be after startDate");
        }
        batch.setName(request.getName());
        batch.setCourse(course);
        batch.setStartDate(request.getStartDate());
        batch.setEndDate(request.getEndDate());
    }

}
