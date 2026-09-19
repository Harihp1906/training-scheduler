package com.training.trainingscheduler.dto;

import com.training.trainingscheduler.entity.Quiz;
import com.training.trainingscheduler.entity.QuizStatus;
import com.training.trainingscheduler.entity.QuizType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class QuizAdminResponse {

    private Long id;
    private Long courseId;
    private String courseTitle;
    private QuizType type;
    private String chapter;
    private int timeLimitSeconds;
    private int passScorePercent;
    private QuizStatus status;
    private int attempts;
    private List<QuestionAdminResponse> questions;

    public static QuizAdminResponse from(Quiz quiz, long attemptCount) {
        return new QuizAdminResponse(
                quiz.getId(),
                quiz.getCourse().getId(),
                quiz.getCourse().getTitle(),
                quiz.getType(),
                quiz.getChapter(),
                quiz.getTimeLimitSeconds(),
                quiz.getPassScorePercent(),
                quiz.getStatus(),
                (int) attemptCount,
                quiz.getQuestions().stream().map(QuestionAdminResponse::from).toList()
        );
    }

}
