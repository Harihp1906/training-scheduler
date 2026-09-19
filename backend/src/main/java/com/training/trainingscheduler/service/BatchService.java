package com.training.trainingscheduler.service;

import com.training.trainingscheduler.dto.BatchRequest;
import com.training.trainingscheduler.dto.BatchResponse;
import com.training.trainingscheduler.entity.Batch;
import com.training.trainingscheduler.entity.Course;
import com.training.trainingscheduler.exception.ApiException;
import com.training.trainingscheduler.repository.BatchRepository;
import com.training.trainingscheduler.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BatchService {

    private final BatchRepository batchRepository;
    private final CourseRepository courseRepository;

    public BatchService(BatchRepository batchRepository, CourseRepository courseRepository) {
        this.batchRepository = batchRepository;
        this.courseRepository = courseRepository;
    }

    public List<BatchResponse> getAll() {
        return batchRepository.findAll().stream()
                .map(BatchResponse::from)
                .toList();
    }

    public BatchResponse create(BatchRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> ApiException.notFound("Course not found"));

        Batch batch = new Batch();
        batch.setCourse(course);
        applyRequest(batch, request, course);

        return BatchResponse.from(batchRepository.save(batch));
    }

    public BatchResponse update(Long id, BatchRequest request) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Batch not found"));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> ApiException.notFound("Course not found"));

        applyRequest(batch, request, course);

        return BatchResponse.from(batchRepository.save(batch));
    }

    public void delete(Long id) {
        if (!batchRepository.existsById(id)) {
            throw ApiException.notFound("Batch not found");
        }
        batchRepository.deleteById(id);
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
