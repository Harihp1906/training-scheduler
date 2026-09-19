package com.training.trainingscheduler.dto;

import com.training.trainingscheduler.entity.Quiz;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class QuizStudentResponse {

    private Long id;
    private String chapter;
    private int timeLimitSeconds;
    private int passScorePercent;
    private List<QuestionStudentResponse> questions;

    public static QuizStudentResponse from(Quiz quiz) {
        return new QuizStudentResponse(
                quiz.getId(),
                quiz.getChapter(),
                quiz.getTimeLimitSeconds(),
                quiz.getPassScorePercent(),
                quiz.getQuestions().stream().map(QuestionStudentResponse::from).toList()
        );
    }

}
