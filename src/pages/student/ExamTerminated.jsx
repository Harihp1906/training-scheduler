import { useNavigate } from 'react-router-dom';
import '../styles/student/ExamTerminated.css';

const ExamTerminated = () => {

  const navigate = useNavigate();

  return (
    <div className="terminated-page">
      <div className="terminated-container">

        <div className="terminated-icon">❌</div>

        <h1>Exam Terminated</h1>
        <p className="terminated-reason">
          Your exam has been automatically terminated because you received 3 warnings from our AI proctoring system.
        </p>

        {/* Warnings Summary */}
        <div className="terminated-warnings">
          <h3>Warnings Received</h3>
          <div className="warning-items">
            <div className="terminated-warning-item">
              <span>⚠️</span>
              <p>Warning 1 — Suspicious behavior detected</p>
            </div>
            <div className="terminated-warning-item">
              <span>⚠️</span>
              <p>Warning 2 — Suspicious behavior detected</p>
            </div>
            <div className="terminated-warning-item">
              <span>⚠️</span>
              <p>Warning 3 — Exam terminated automatically</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="terminated-info">
          <h3>What happens now?</h3>
          <div className="info-items">
            <div className="info-item">
              <span>📋</span>
              <p>This attempt has been recorded and reported to the admin.</p>
            </div>
            <div className="info-item">
              <span>🔁</span>
              <p>You can retry the exam if you have attempts remaining.</p>
            </div>
            <div className="info-item">
              <span>📧</span>
              <p>Contact support if you believe this was a mistake.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="terminated-actions">
          <button
            className="btn-go-dashboard"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>
          <button
            className="btn-contact-support"
            onClick={() => navigate('/contact')}
          >
            Contact Support
          </button>
        </div>

      </div>
    </div>
  );
}

export default ExamTerminated;