import React from 'react';
import EmailCard from './EmailCard';
import { Mail } from 'lucide-react';
import './EmailList.css';

const EmailList = ({ emails, selectedEmail, onSelectEmail, loading }) => {
  if (loading) {
    return (
      <div className="email-list-loading">
        <div className="spinner"></div>
        <p>Loading emails...</p>
      </div>
    );
  }

  if (!emails || emails.length === 0) {
    return (
      <div className="email-list-empty">
        <Mail size={64} />
        <h3>No Emails Found</h3>
        <p>Load the mock inbox to get started</p>
      </div>
    );
  }

  return (
    <div className="email-list">
      {emails.map((email) => (
        <EmailCard
          key={email._id}
          email={email}
          isSelected={selectedEmail?._id === email._id}
          onClick={() => onSelectEmail(email)}
        />
      ))}
    </div>
  );
};

export default EmailList;