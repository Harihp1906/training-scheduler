package com.training.trainingscheduler.service;

import com.training.trainingscheduler.dto.ContactRequest;
import com.training.trainingscheduler.entity.ContactMessage;
import com.training.trainingscheduler.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    public void submit(ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setSubject(request.getSubject());
        message.setMessage(request.getMessage());
        contactMessageRepository.save(message);
    }

}
