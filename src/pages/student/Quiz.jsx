import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/student/Quiz.css';

const Quiz = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const questions = [
    {
      id: 1,
      question: 'What is Java?',
      options: [
        'A programming language',
        'A database',
        'An operating system',
        'A web browser'
      ],
      correct: 0
    },
    {
      id: 2,
      question: 'Which keyword is used to create a class in Java?',
      options: ['class', 'Class', 'create', 'new'],
      correct: 0
    },
    {
      id: 3,
      question: 'What does JDK stand for?',
      options: [
        'Java Development Kit',
        'Java Desktop Kit',
        'Java Data Kit',
        'Java Design Kit'
      ],
      correct: 0
    },
    {
      id: 4,
      question: 'Which of these is NOT a primitive data type in Java?',
      options: ['int', 'boolean', 'String', 'char'],
      correct: 2
    },
    {
      id: 5,
      question: 'What is the entry point of a Java program?',
      options: ['start()', 'main()', 'run()', 'init()'],
      correct: 1
    },
  ];

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion + 1 >= questions.length) {
      setQuizFinished(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
    }
  };

  const getScore = () => {
    return answers.filter((ans, i) => ans === questions[i].correct).length;
  };

  const passed = getScore() >= Math.ceil(questions.length * 0.7);

  if (quizFinished) {
    return (
      <div className="quiz-page">
        <div className="quiz-result">
          <div className="result-icon">{passed ? '🎉' : '😔'}</div>
          <h2>{passed ? 'Congratulations!' : 'Better Luck Next Time!'}</h2>
          <p className="result-score">{getScore()} / {questions.length}</p>
          <p className="result-status">{passed ? 'You passed the quiz!' : 'You need 70% to pass.'}</p>
          <div className="result-actions">
            {passed ? (
              <button className="btn-next-chapter" onClick={() => navigate(`/course/${id}`)}>
                Continue Course
              </button>
            ) : (
              <button className="btn-retry" onClick={() => window.location.reload()}>
                Retry Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="quiz-page">
      <div className="quiz-container">

        {/* Header */}
        <div className="quiz-header">
          <h2>Chapter Quiz</h2>
          <div className="quiz-meta">
            <span className="quiz-progress">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="quiz-timer">⏱ {timeLeft}s</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question */}
        <div className="quiz-question">
          <h3>{question.question}</h3>
        </div>

        {/* Options */}
        <div className="quiz-options">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`quiz-option ${selectedAnswer === index ? 'selected' : ''}`}
              onClick={() => handleAnswer(index)}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              {option}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <div className="quiz-footer">
          <button
            className="btn-next"
            onClick={handleNext}
            disabled={selectedAnswer === null}
          >
            {currentQuestion + 1 === questions.length ? 'Submit Quiz' : 'Next Question →'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Quiz;