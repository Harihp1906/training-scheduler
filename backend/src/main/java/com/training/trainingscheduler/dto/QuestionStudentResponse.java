package com.training.trainingscheduler.dto;

import com.training.trainingscheduler.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/** Question as sent to a student taking the quiz -- correctIndex deliberately omitted. */
@Data
@AllArgsConstructor
public class QuestionStudentResponse {

    private Long id;
    private String text;
    private List<String> options;

    // Copy into a plain list -- question.getOptions() is a lazy Hibernate
    // proxy; passing it through unmaterialized breaks once the transaction
    // that fetched it closes (Jackson serializes after the service returns).
    public static QuestionStudentResponse from(Question question) {
        return new QuestionStudentResponse(question.getId(), question.getText(), new ArrayList<>(question.getOptions()));
    }

}
