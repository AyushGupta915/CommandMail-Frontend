import React from 'react';
import { Mail, Clock, Tag, User, FileText, Zap, X, CheckCircle, Circle } from 'lucide-react';
import './EmailDetail.css';

const EmailDetail = ({ email, onClose, onProcess, onGenerateReply, onToggleActionItem, loading }) => {
  if (!email) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Important: 'detail-category-important',
      'To-Do': 'detail-category-todo',
      Newsletter: 'detail-category-newsletter',
      Spam: 'detail-category-spam',
      Uncategorized: 'detail-category-uncategorized',
    };
    return colors[category] || colors.Uncategorized;
  };

  const handleToggleActionItem = (index) => {
    if (onToggleActionItem) {
      onToggleActionItem(email._id, index);
    }
  };

  const completedCount = email.actionItems?.filter(item => item.completed).length || 0;
  const totalCount = email.actionItems?.length || 0;

  return (
    <div className="email-detail">
      <div className="email-detail-header">
        <div className="email-detail-title">
          <Mail size={24} />
          <h2>Email Details</h2>
        </div>
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="email-detail-content">
        {/* Subject */}
        <div className="email-detail-section">
          <h1 className="email-detail-subject">{email.subject}</h1>
        </div>

        {/* Meta Information */}
        <div className="email-detail-meta">
          <div className="meta-item">
            <User size={16} />
            <div>
              <span className="meta-label">From</span>
              <span className="meta-value">{email.sender}</span>
            </div>
          </div>
          <div className="meta-item">
            <Clock size={16} />
            <div>
              <span className="meta-label">Received</span>
              <span className="meta-value">{formatDate(email.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Category and Status */}
        <div className="email-detail-status">
          {email.processed ? (
            <span className={`detail-category ${getCategoryColor(email.category)}`}>
              <Tag size={14} />
              {email.category}
            </span>
          ) : (
            <span className="detail-unprocessed">
              Not Processed
            </span>
          )}
        </div>

        {/* Body */}
        <div className="email-detail-section">
          <h3 className="section-title">
            <FileText size={18} />
            Message
          </h3>
          <div className="email-body">
            {email.body.split('\n').map((line, index) => (
              <p key={index}>{line || '\u00A0'}</p>
            ))}
          </div>
        </div>

        {/* Action Items */}
        {email.actionItems && email.actionItems.length > 0 && (
          <div className="email-detail-section">
            <div className="action-items-header">
              <h3 className="section-title">
                <Zap size={18} />
                Action Items
              </h3>
              <span className="action-items-count">
                {completedCount} of {totalCount} completed
              </span>
            </div>
            <div className="action-items-list">
              {email.actionItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`action-item ${item.completed ? 'completed' : ''}`}
                >
                  <div className="action-item-content">
                    <button 
                      className="action-item-checkbox"
                      onClick={() => handleToggleActionItem(index)}
                      disabled={loading}
                    >
                      {item.completed ? (
                        <CheckCircle size={24} className="check-icon" />
                      ) : (
                        <Circle size={24} className="uncheck-icon" />
                      )}
                    </button>
                    <div className="action-item-details">
                      <p className="action-item-task">{item.task}</p>
                      <div className="action-item-meta">
                        {item.deadline && (
                          <span className="action-item-deadline">
                            <Clock size={14} />
                            Due: {item.deadline}
                          </span>
                        )}
                        {item.completed && item.completedAt && (
                          <span className="action-item-completed-at">
                            ✓ Completed {new Date(item.completedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="email-detail-actions">
          {!email.processed && (
            <button 
              className="process-button"
              onClick={() => onProcess(email._id)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="button-spinner"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Process Email with AI
                </>
              )}
            </button>
          )}
          
          {email.processed && onGenerateReply && (
            <button 
              className="draft-button"
              onClick={() => onGenerateReply(email._id)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="button-spinner"></div>
                  Generating...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  Generate Reply Draft
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;