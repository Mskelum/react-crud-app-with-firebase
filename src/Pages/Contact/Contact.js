import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import './Contact.css'; 

const Contact = () => {
  return (
    <div>
      <Navbar />
    <div className="contact-container">
      <div className="contact-details">
        <h1>Contact Us</h1>
        <p>Email: <a href="mailto:mskelum@gmail.com">mskelum@gmail.com</a></p>
        <p>WhatsApp: <a href="https://wa.me/94758125068" target="_blank" rel="noopener noreferrer">+94758125068</a></p>
      </div>
    </div>
    </div>
  );
};

export default Contact;
