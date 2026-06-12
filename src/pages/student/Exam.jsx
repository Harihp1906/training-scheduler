import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/student/Exam.css';

const Exam = () => {

  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [warnings, setWarnings] = useState(0);
  const [warningMessage, setWarningMessage] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [examFinished, setExamFinished] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const questions = [
    {
      id: 1,
      question: 'What is the correct way to declare a variable in Java?',
      options: ['int x = 5;', 'variable x = 5;', 'x = 5;', 'declare x = 5;'],
      correct: 0
    },
    {
      id: 2,
      question: 'Which of the following is a Java OOP concept?',
      options: ['Compilation', 'Inheritance', 'Debugging', 'Execution'],
      correct: 1
    },
    {
      id: 3,
      question: 'What does the "static" keyword mean in Java?',
      options: [
        'The variable changes every time',
        'Belongs to the class not the instance',
        'It is a constant value',
        'It cannot be used in methods'
      ],
      correct: 1
    },
    {
      id: 4,
      question: 'Which method is automatically called when an object is created?',
      options: ['start()', 'init()', 'constructor()', 'Constructor'],
      correct: 3
    },
    {
      id: 5,
      question: 'What is the size of int in Java?',
      options: ['8 bits', '16 bits', '32 bits', '64 bits'],
      correct: 2
    },
  ];

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
        alert('Camera access denied! Camera is required for the exam.');
        navigate('/exam/instructions');
      }
    };
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Tab Switch Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerWarning('⚠️ Warning: You switched tabs! Do not leave the exam page.');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [warnings]);

  // Timer
  useEffect(() => {
    if (examFinished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          triggerWarning('⚠️ Warning: Time ran out for this question!');
          handleNext();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestion, examFinished]);

  const triggerWarning = (message) => {
    const newWarnings = warnings + 1;
    setWarnings(newWarnings);
    setWarningMessage(message);
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 3000);

    if (newWarnings >= 3) {
      navigate('/exam/terminated');
    }
  };

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);
    setTimeLeft(30);

    if (currentQuestion + 1 >= questions.length) {
      setExamFinished(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const getScore = () => {
    return answers.filter((ans, i) => ans === questions[i].correct).length;
  };

  const passed = getScore() >= Math.ceil(questions.length * 0.7);

  if (examFinished) {
    return (
      <div className="exam-page">
        <div className="exam-result">
          <div className="result-icon">{passed ? '🎉' : '😔'}</div>
          <h2>{passed ? 'Congratulations! You Passed!' : 'You Did Not Pass'}</h2>
          <p className="result-score">{getScore()} / {questions.length}</p>
          <p className="result-status">{passed ? 'Your certificate is ready!' : 'You need 70% to pass. Try again!'}</p>
          <div className="result-actions">
            {passed ? (
              <button className="btn-certificate" onClick={() => navigate('/certificate/1')}>
                🏆 Get Certificate
              </button>
            ) : (
              <button className="btn-retry" onClick={() => window.location.reload()}>
                Retry Exam
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

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
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span className={`exam-timer ${timeLeft <= 10 ? 'urgent' : ''}`}>
                ⏱ {timeLeft}s
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="quiz-progress-bar">
            <div
              className="quiz-progress-fill"
              style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
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
              {currentQuestion + 1 === questions.length ? 'Submit Exam' : 'Next Question →'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Exam;