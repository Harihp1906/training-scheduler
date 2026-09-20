import { useState } from 'react';
import { apiFetch } from '../../utils/api';
import { useToast } from '../../components/common/Toast.jsx';
import '../styles/public/Contact.css';

const Contact = () => {
  const showToast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await apiFetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      showToast(data.message || (response.ok ? 'Message sent successfully!' : 'Something went wrong.'), response.ok ? 'success' : 'error');
      if (response.ok) {
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">

      {/* Header */}
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>Have a question? We'd love to hear from you!</p>
      </div>

      <div className="contact-container">

        {/* Contact Info */}
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <p>Reach out to us and we'll get back to you as soon as possible.</p>

          <div className="info-card">
            <span className="info-icon">📧</span>
            <div>
              <h4>Email</h4>
              <p>support@trainingscheduler.com</p>
            </div>
          </div>

          <div className="info-card">
            <span className="info-icon">📍</span>
            <div>
              <h4>Location</h4>
              <p>Chennai, Tamil Nadu, India</p>
            </div>
          </div>

          <div className="info-card">
            <span className="info-icon">🕐</span>
            <div>
              <h4>Working Hours</h4>
              <p>Monday - Friday, 9AM - 6PM</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-box">
          <h2>Send a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Enter subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
              />
            </div>

            <button type="submit" className="btn-contact-submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default Contact;