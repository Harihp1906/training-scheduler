package com.training.trainingscheduler.dto;

import com.training.trainingscheduler.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/** Full question detail, correctIndex included -- admin only. */
@Data
@AllArgsConstructor
public class QuestionAdminResponse {

    private Long id;
    private String text;
    private List<String> options;
    private int correctIndex;

    // See QuestionStudentResponse.from for why this copies into a plain list.
    public static QuestionAdminResponse from(Question question) {
        return new QuestionAdminResponse(
                question.getId(),
                question.getText(),
                new ArrayList<>(question.getOptions()),
                question.getCorrectIndex()
        );
    }

}
