import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { useToast } from '../../components/common/Toast.jsx';
import '../styles/student/Quiz.css';

const Quiz = () => {
  const showToast = useToast();

  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    apiFetch(`/api/courses/${id}/quiz`)
      .then(res => {
        if (!res.ok) throw new Error('Quiz not found');
        return res.json();
      })
      .then(data => {
        setQuiz(data);
        setTimeLeft(data.timeLimitSeconds);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching quiz:', err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
  };

  const handleNext = async () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion + 1 >= quiz.questions.length) {
      setSubmitting(true);
      try {
        const response = await apiFetch(`/api/quizzes/${quiz.id}/attempts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: newAnswers, warningCount: 0, terminated: false }),
        });
        const data = await response.json();
        if (response.ok) {
          setResult(data);
        } else {
          showToast(data.message || 'Could not submit quiz', 'error');
        }
      } catch (err) {
        console.error('Error submitting quiz:', err);
        showToast('Something went wrong. Please try again.', 'error');
      } finally {
        setSubmitting(false);
        setQuizFinished(true);
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(quiz.timeLimitSeconds);
    }
  };

  if (loading) return <div className="quiz-page"><p style={{ padding: '2rem' }}>Loading quiz...</p></div>;
  if (error || !quiz) return <div className="quiz-page"><p style={{ padding: '2rem' }}>No quiz available for this course yet.</p></div>;

  if (quizFinished) {
    const passed = result?.passed;
    return (
      <div className="quiz-page">
        <div className="quiz-result">
          <div className="result-icon">{submitting ? '⏳' : passed ? '🎉' : '😔'}</div>
          <h2>{submitting ? 'Submitting...' : passed ? 'Congratulations!' : 'Better Luck Next Time!'}</h2>
          {result && (
            <>
              <p className="result-score">{result.score}%</p>
              <p className="result-status">{passed ? 'You passed the quiz!' : `You need ${quiz.passScorePercent}% to pass.`}</p>
            </>
          )}
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

  const question = quiz.questions[currentQuestion];

  return (
    <div className="quiz-page">
      <div className="quiz-container">

        {/* Header */}
        <div className="quiz-header">
          <h2>Chapter Quiz</h2>
          <div className="quiz-meta">
            <span className="quiz-progress">Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span className="quiz-timer">⏱ {timeLeft}s</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((currentQuestion) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question */}
        <div className="quiz-question">
          <h3>{question.text}</h3>
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
            disabled={selectedAnswer === null || submitting}
          >
            {currentQuestion + 1 === quiz.questions.length ? 'Submit Quiz' : 'Next Question →'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Quiz;
