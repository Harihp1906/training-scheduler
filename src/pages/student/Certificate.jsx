import { useParams } from 'react-router-dom';
import '../styles/student/Certificate.css';

const Certificate = () => {

  const { id } = useParams();

  const certificate = {
    id: 'TS-2024-001',
    studentName: 'Hari Preyadharshan S P',
    courseName: 'Java Programming',
    completionDate: 'June 12, 2024',
    grade: 'Distinction',
    score: '92%'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="certificate-page">

      <div className="certificate-actions no-print">
        <h2>Your Certificate</h2>
        <p>Congratulations on completing the course!</p>
        <button className="btn-print" onClick={handlePrint}>
          🖨️ Print Certificate
        </button>
      </div>

      {/* Certificate */}
      <div className="certificate-wrapper">
        <div className="certificate">

          {/* Border */}
          <div className="certificate-border">

            {/* Header */}
            <div className="certificate-header">
              <div className="certificate-logo">🎓</div>
              <h1>Training Scheduler</h1>
              <p className="certificate-subtitle">Certificate of Completion</p>
            </div>

            {/* Divider */}
            <div className="certificate-divider"></div>

            {/* Body */}
            <div className="certificate-body">
              <p className="cert-text">This is to certify that</p>
              <h2 className="cert-name">{certificate.studentName}</h2>
              <p className="cert-text">has successfully completed the course</p>
              <h3 className="cert-course">"{certificate.courseName}"</h3>
              <p className="cert-text">with a score of <strong>{certificate.score}</strong> — Grade: <strong>{certificate.grade}</strong></p>
            </div>

            {/* Divider */}
            <div className="certificate-divider"></div>

            {/* Footer */}
            <div className="certificate-footer">
              <div className="cert-footer-item">
                <p className="cert-label">Date of Completion</p>
                <p className="cert-value">{certificate.completionDate}</p>
              </div>
              <div className="cert-seal">🏆</div>
              <div className="cert-footer-item">
                <p className="cert-label">Certificate ID</p>
                <p className="cert-value">{certificate.id}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Verify Section */}
      <div className="certificate-verify no-print">
        <h3>Verify this Certificate</h3>
        <p>Anyone can verify the authenticity of this certificate using the certificate ID below:</p>
        <div className="verify-id">
          <span>{certificate.id}</span>
        </div>
      </div>

    </div>
  );
}

export default Certificate;