import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    reason: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // EmailJS configuration
    emailjs
      .send(
        'service_tr6npb8', // Replace with your EmailJS Service ID
        'template_zh720p8', // Replace with your EmailJS Template ID
        {
          from_name: formData.fullName,
          from_email: formData.email,
          reason: formData.reason,
          message: formData.message
        },
        'YOUR_USER_ID' // Replace with your EmailJS User ID
      )
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        alert('Your message has been sent!');
        setFormData({ fullName: '', email: '', reason: '', message: '' });
      })
      .catch((error) => {
        console.log('FAILED...', error);
        alert('Failed to send message. Please try again later.');
      });
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        Full Name:
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Reason:
        <select name="reason" value={formData.reason} onChange={handleChange} required>
          <option value="">Select a reason</option>
          <option value="General Inquiry">General Inquiry</option>
          <option value="Support">Support</option>
          <option value="Feedback">Feedback</option>
          <option value="Other">Other</option>
        </select>
      </label>
      <label>
        Message:
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
      </label>
      <button type="submit">Send Message</button>
    </form>
  );
};

export default ContactForm;
