import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { useToast } from '../../components/common/Toast.jsx';
import '../styles/student/Exam.css';

const Exam = () => {
  const showToast = useToast();

  const navigate = useNavigate();
  const { id } = useParams();
  const videoRef = useRef(null);

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [warnings, setWarnings] = useState(0);
  const [warningMessage, setWarningMessage] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [examFinished, setExamFinished] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Fetch the exam
  useEffect(() => {
    apiFetch(`/api/courses/${id}/exam`)
      .then(res => {
        if (!res.ok) throw new Error('Exam not found');
        return res.json();
      })
      .then(data => {
        setQuiz(data);
        setTimeLeft(data.timeLimitSeconds);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching exam:', err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  // Start Camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        }
      } catch (err) {
        showToast('Camera access denied! Camera is required for the exam.', 'error');
        navigate(`/exam/instructions/${id}`);
      }
    };
    startCamera();

    const videoEl = videoRef.current;
    return () => {
      if (videoEl && videoEl.srcObject) {
        videoEl.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [id, navigate, showToast]);

  const submitAttempt = useCallback(async (finalAnswers, finalWarnings, terminated) => {
    if (!quiz) return;
    setSubmitting(true);
    try {
      const response = await apiFetch(`/api/quizzes/${quiz.id}/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers, warningCount: finalWarnings, terminated }),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        console.error('Attempt submission failed:', data.message);
      }
    } catch (err) {
      console.error('Error submitting exam:', err);
    } finally {
      setSubmitting(false);
    }
  }, [quiz]);

  const triggerWarning = useCallback((message) => {
    const newWarnings = warnings + 1;
    setWarnings(newWarnings);
    setWarningMessage(message);
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 3000);

    if (newWarnings >= 3) {
      const finalAnswers = selectedAnswer !== null ? [...answers, selectedAnswer] : answers;
      submitAttempt(finalAnswers, newWarnings, true);
      navigate('/exam/terminated');
    }
  }, [warnings, answers, selectedAnswer, navigate, submitAttempt]);

  // Tab Switch Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerWarning('⚠️ Warning: You switched tabs! Do not leave the exam page.');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [triggerWarning]);

  // Timer
  useEffect(() => {
    if (examFinished || !quiz) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          triggerWarning('⚠️ Warning: Time ran out for this question!');
          handleNext();
          return quiz.timeLimitSeconds;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, examFinished, quiz]);

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);
    setTimeLeft(quiz.timeLimitSeconds);

    if (currentQuestion + 1 >= quiz.questions.length) {
      setExamFinished(true);
      submitAttempt(newAnswers, warnings, false);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  if (loading) return <div className="exam-page"><p style={{ padding: '2rem' }}>Loading exam...</p></div>;
  if (error || !quiz) return <div className="exam-page"><p style={{ padding: '2rem' }}>No final exam available for this course yet.</p></div>;

  if (examFinished) {
    const passed = result?.passed;
    return (
      <div className="exam-page">
        <div className="exam-result-wrapper">
        <div className="exam-result">
          <div className="result-icon">{submitting ? '⏳' : passed ? '🎉' : '😔'}</div>
          <h2>{submitting ? 'Submitting...' : passed ? 'Congratulations! You Passed!' : 'You Did Not Pass'}</h2>
          {result && (
            <>
              <p className="result-score">{result.score}%</p>
              <p className="result-status">
                {passed
                  ? 'Your certificate is ready!'
                  : `You need ${quiz.passScorePercent}% to pass. ${result.attemptsRemaining > 0 ? `${result.attemptsRemaining} attempt(s) left.` : 'No attempts remaining.'}`}
              </p>
            </>
          )}
          <div className="result-actions">
            {passed ? (
              <button className="btn-certificate" onClick={() => navigate(`/certificate/${result.certificateCode}`)}>
                🏆 Get Certificate
              </button>
            ) : result?.attemptsRemaining > 0 ? (
              <button className="btn-retry" onClick={() => window.location.reload()}>
                Retry Exam
              </button>
            ) : (
              <button className="btn-retry" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </button>
            )}
          </div>
        </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="exam-page">

      {/* Warning Banner */}
      {showWarning && (
        <div className="warning-banner">
          <span>⚠️ {warningMessage}</span>
          <span className="warning-count">{warnings}/3 Warnings</span>
        </div>
      )}

      <div className="exam-layout">

        {/* Camera Box */}
        <div className="camera-box">
          <video ref={videoRef} autoPlay muted className="camera-feed" />
          <div className="camera-status">
            <span className={`camera-dot ${cameraReady ? 'active' : ''}`}></span>
            <span>{cameraReady ? 'AI Monitoring Active' : 'Starting Camera...'}</span>
          </div>
          <div className="warnings-display">
            <h4>Warnings</h4>
            <div className="warning-dots">
              <span className={`warn-dot ${warnings >= 1 ? 'active' : ''}`}></span>
              <span className={`warn-dot ${warnings >= 2 ? 'active' : ''}`}></span>
              <span className={`warn-dot ${warnings >= 3 ? 'active' : ''}`}></span>
            </div>
            <p>{warnings}/3 — 3 warnings = terminated</p>
          </div>
        </div>

        {/* Exam Container */}
        <div className="exam-container">

          {/* Header */}
          <div className="exam-header">
            <h2>Final Exam</h2>
            <div className="exam-meta">
              <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
              <span className={`exam-timer ${timeLeft <= 10 ? 'urgent' : ''}`}>
                ⏱ {timeLeft}s
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="quiz-progress-bar">
            <div
              className="quiz-progress-fill"
              style={{ width: `${(currentQuestion / quiz.questions.length) * 100}%` }}
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
              disabled={selectedAnswer === null}
            >
              {currentQuestion + 1 === quiz.questions.length ? 'Submit Exam' : 'Next Question →'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Exam;
