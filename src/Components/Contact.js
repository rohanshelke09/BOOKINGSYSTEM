import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 80px 20px;
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ContactInfo = styled.div`
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ContactForm = styled.form`
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const InfoCard = styled(motion.div)`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding: 15px;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.3s ease;

  &:hover {
    background: #e9ecef;
  }

  svg {
    font-size: 24px;
    color: #007bff;
    margin-right: 15px;
  }
`;

const InfoContent = styled.div`
  h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.1rem;
  }

  p {
    margin: 5px 0 0;
    color: #6c757d;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    color: #2c3e50;
    font-weight: 500;
  }

  input, textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
  }

  textarea {
    min-height: 150px;
    resize: vertical;
  }
`;

const SubmitButton = styled(motion.button)`
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled(motion.div)`
  background: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your form submission logic here
    // For now, we'll just simulate a submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <ContactInfo>
          <h2>Get in Touch</h2>
          <InfoCard whileHover={{ y: -5 }}>
            <FaPhone />
            <InfoContent>
              <h3>Phone</h3>
              <p>+1 234 567 8900</p>
            </InfoContent>
          </InfoCard>

          <InfoCard whileHover={{ y: -5 }}>
            <FaEnvelope />
            <InfoContent>
              <h3>Email</h3>
              <p>info@smarthotel.com</p>
            </InfoContent>
          </InfoCard>

          <InfoCard whileHover={{ y: -5 }}>
            <FaMapMarkerAlt />
            <InfoContent>
              <h3>Location</h3>
              <p>123 Hotel Street, City, Country</p>
            </InfoContent>
          </InfoCard>

          <InfoCard whileHover={{ y: -5 }}>
            <FaClock />
            <InfoContent>
              <h3>Business Hours</h3>
              <p>24/7 - We're Always Here For You</p>
            </InfoContent>
          </InfoCard>
        </ContactInfo>

        <ContactForm onSubmit={handleSubmit}>
          <h2>Send us a Message</h2>
          <FormGroup>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <SubmitButton
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Send Message
          </SubmitButton>

          {isSubmitted && (
            <SuccessMessage
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Thank you for your message! We'll get back to you soon.
            </SuccessMessage>
          )}
        </ContactForm>
      </ContentWrapper>
    </PageContainer>
  );
};

export default Contact;