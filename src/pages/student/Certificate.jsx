import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import '../styles/student/Certificate.css';

const Certificate = () => {

  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiFetch(`/api/certificates/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Certificate not found');
        return res.json();
      })
      .then(data => {
        setCertificate(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching certificate:', err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="certificate-page"><p style={{ padding: '2rem' }}>Loading certificate...</p></div>;
  if (error || !certificate) return <div className="certificate-page"><p style={{ padding: '2rem' }}>Certificate not found. Double-check the certificate ID.</p></div>;

  const completionDate = new Date(certificate.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const isRevoked = certificate.status === 'REVOKED';

  return (
    <div className="certificate-page">

      <div className="certificate-actions no-print">
        <h2>{isRevoked ? 'This Certificate Has Been Revoked' : 'Your Certificate'}</h2>
        <p>{isRevoked ? 'This certificate is no longer valid.' : 'Congratulations on completing the course!'}</p>
        {!isRevoked && (
          <button className="btn-print" onClick={handlePrint}>
            🖨️ Print Certificate
          </button>
        )}
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
              <p className="cert-text">with a score of <strong>{certificate.score}%</strong> — Grade: <strong>{certificate.grade}</strong></p>
            </div>

            {/* Divider */}
            <div className="certificate-divider"></div>

            {/* Footer */}
            <div className="certificate-footer">
              <div className="cert-footer-item">
                <p className="cert-label">Date of Completion</p>
                <p className="cert-value">{completionDate}</p>
              </div>
              <div className="cert-seal">🏆</div>
              <div className="cert-footer-item">
                <p className="cert-label">Certificate ID</p>
                <p className="cert-value">{certificate.certificateCode}</p>
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
          <span>{certificate.certificateCode}</span>
        </div>
      </div>

    </div>
  );
}

export default Certificate;
