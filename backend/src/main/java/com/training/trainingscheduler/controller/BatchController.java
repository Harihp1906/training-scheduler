package com.training.trainingscheduler.controller;

import com.training.trainingscheduler.dto.BatchRequest;
import com.training.trainingscheduler.dto.BatchResponse;
import com.training.trainingscheduler.service.BatchService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/batches")
public class BatchController {

    private final BatchService batchService;

    public BatchController(BatchService batchService) {
        this.batchService = batchService;
    }

    @GetMapping
    public List<BatchResponse> getAll() {
        return batchService.getAll();
    }

    @PostMapping
    public ResponseEntity<BatchResponse> create(@Valid @RequestBody BatchRequest request) {
        return ResponseEntity.status(201).body(batchService.create(request));
    }

    @PutMapping("/{id}")
    public BatchResponse update(@PathVariable Long id, @Valid @RequestBody BatchRequest request) {
        return batchService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        batchService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
