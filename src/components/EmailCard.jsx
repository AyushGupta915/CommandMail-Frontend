import React from 'react';
import { Mail, Clock, Tag, CheckCircle } from 'lucide-react';
import './EmailCard.css';

const EmailCard = ({ email, isSelected, onClick }) => {
  const getCategoryColor = (category) => {
    const colors = {
      Important: 'category-important',
      'To-Do': 'category-todo',
      Newsletter: 'category-newsletter',
      Spam: 'category-spam',
      Uncategorized: 'category-uncategorized',
    };
    return colors[category] || colors.Uncategorized;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div
      onClick={onClick}
      className={`email-card ${isSelected ? 'email-card-selected' : ''}`}
    >
      <div className="email-card-header">
        <div className="email-sender">
          <Mail size={16} />
          <span>{email.sender}</span>
        </div>
        <div className="email-time">
          <Clock size={14} />
          {formatDate(email.timestamp)}
        </div>
      </div>

      <h3 className="email-subject">{email.subject}</h3>

      <p className="email-preview">{email.body}</p>

      <div className="email-card-footer">
        <div className="email-tags">
          {email.processed ? (
            <>
              <span className={`email-category ${getCategoryColor(email.category)}`}>
                <Tag size={12} />
                {email.category}
              </span>
              <span className="email-processed">
                <CheckCircle size={12} />
                Processed
              </span>
            </>
          ) : (
            <span className="email-unprocessed">
              Not Processed
            </span>
          )}
        </div>
        
        {email.actionItems && email.actionItems.length > 0 && (
          <span className="email-action-items">
            {email.actionItems.length} action item{email.actionItems.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
};

export default EmailCard;