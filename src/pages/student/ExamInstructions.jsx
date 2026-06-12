import { useNavigate } from 'react-router-dom';
import '../styles/student/ExamInstructions.css';

const ExamInstructions = () => {

  const navigate = useNavigate();

  const handleStartExam = () => {
    navigate('/exam/1');
  };

  return (
    <div className="instructions-page">
      <div className="instructions-container">

        <div className="instructions-header">
          <h1>🎓 Final Exam</h1>
          <p>Please read all instructions carefully before starting</p>
        </div>

        {/* Rules */}
        <div className="instructions-section">
          <h2>📋 Exam Rules</h2>
          <div className="rules-grid">
            <div className="rule-card">
              <span className="rule-icon">⏱</span>
              <div>
                <h4>Time Limit</h4>
                <p>Each question has a 30 second time limit. Answer quickly!</p>
              </div>
            </div>
            <div className="rule-card">
              <span className="rule-icon">🔀</span>
              <div>
                <h4>Random Order</h4>
                <p>Questions and answers appear in random order every attempt.</p>
              </div>
            </div>
            <div className="rule-card">
              <span className="rule-icon">⛔</span>
              <div>
                <h4>No Going Back</h4>
                <p>You cannot go back to a previous question once answered.</p>
              </div>
            </div>
            <div className="rule-card">
              <span className="rule-icon">🔁</span>
              <div>
                <h4>Limited Attempts</h4>
                <p>You only have 3 attempts to pass the final exam.</p>
              </div>
            </div>
            <div className="rule-card">
              <span className="rule-icon">✅</span>
              <div>
                <h4>Passing Score</h4>
                <p>You need to score at least 70% to pass and earn your certificate.</p>
              </div>
            </div>
            <div className="rule-card">
              <span className="rule-icon">🏆</span>
              <div>
                <h4>Certificate</h4>
                <p>Pass the exam to receive your verified certificate instantly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Proctoring */}
        <div className="instructions-section proctoring-section">
          <h2>🤖 AI Proctoring System</h2>
          <p className="proctoring-intro">This exam is monitored by our AI proctoring system using your camera. The following behaviors will result in warnings:</p>

          <div className="warning-list">
            <div className="warning-item">
              <span className="warning-icon">⚠️</span>
              <div>
                <h4>Face Not Visible</h4>
                <p>Keep your face clearly visible in the camera at all times.</p>
              </div>
            </div>
            <div className="warning-item">
              <span className="warning-icon">⚠️</span>
              <div>
                <h4>Multiple Faces Detected</h4>
                <p>Only you should be visible in the camera frame.</p>
              </div>
            </div>
            <div className="warning-item">
              <span className="warning-icon">⚠️</span>
              <div>
                <h4>Tab Switching</h4>
                <p>Do not switch to another tab or window during the exam.</p>
              </div>
            </div>
            <div className="warning-item">
              <span className="warning-icon">⚠️</span>
              <div>
                <h4>Phone Detected</h4>
                <p>Do not use or show any mobile device during the exam.</p>
              </div>
            </div>
          </div>

          <div className="termination-notice">
            <span>❌</span>
            <p><strong>3 warnings = Exam automatically terminated!</strong> The attempt will be counted and recorded.</p>
          </div>
        </div>

        {/* Setup Checklist */}
        <div className="instructions-section">
          <h2>✅ Before You Start</h2>
          <div className="checklist">
            <div className="check-item">
              <span>💡</span>
              <p>Sit in a well lit room so your face is clearly visible</p>
            </div>
            <div className="check-item">
              <span>🎥</span>
              <p>Make sure your camera is working properly</p>
            </div>
            <div className="check-item">
              <span>🔇</span>
              <p>Find a quiet place with no distractions</p>
            </div>
            <div className="check-item">
              <span>🌐</span>
              <p>Ensure you have a stable internet connection</p>
            </div>
            <div className="check-item">
              <span>👤</span>
              <p>Make sure you are alone in the room</p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="instructions-footer">
          <p>By clicking Start Exam you agree to be monitored by our AI proctoring system.</p>
          <button className="btn-start-exam" onClick={handleStartExam}>
            🎓 Start Final Exam
          </button>
        </div>

      </div>
    </div>
  );
}

export default ExamInstructions;