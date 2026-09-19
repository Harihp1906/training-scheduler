package com.training.trainingscheduler.controller;

import com.training.trainingscheduler.dto.ContactRequest;
import com.training.trainingscheduler.dto.MessageResponse;
import com.training.trainingscheduler.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<MessageResponse> submit(@Valid @RequestBody ContactRequest request) {
        contactService.submit(request);
        return ResponseEntity.status(201).body(new MessageResponse("Message sent successfully! We'll get back to you soon."));
    }

}
