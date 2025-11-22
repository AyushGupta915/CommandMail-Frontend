import React, { useEffect, useState } from 'react';
import { useEmail } from '../context/EmailContext';
import { agentAPI, draftAPI, emailAPI } from '../services/api';
import EmailList from '../components/EmailList';
import EmailDetail from '../components/EmailDetail';
import { RefreshCw, Download, Zap, Filter } from 'lucide-react';
import './InboxPage.css';

const InboxPage = () => {
  const {
    emails,
    setEmails,
    selectedEmail,
    setSelectedEmail,
    loading,
    error,
    success,
    setError,
    setSuccess,
    loadEmails,
    loadMockInbox,
    processEmail,
    processAllEmails,
    initializePrompts,
  } = useEmail();

  const [filter, setFilter] = useState('all');
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadEmails();
  }, []);

  const handleLoadMockInbox = async () => {
    try {
      await initializePrompts();
      await loadMockInbox();
    } catch (err) {
      console.error('Failed to load mock inbox:', err);
    }
  };

  const handleProcessAll = async () => {
    if (window.confirm('Process all unprocessed emails? This may take a while.')) {
      try {
        await processAllEmails();
      } catch (err) {
        console.error('Failed to process emails:', err);
      }
    }
  };

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedEmail(null);
  };

  const handleProcessEmail = async (emailId) => {
    try {
      await processEmail(emailId);
    } catch (err) {
      console.error('Failed to process email:', err);
    }
  };

  const handleGenerateReply = async (emailId) => {
    try {
      setError(null);
      
      const email = emails.find(e => e._id === emailId);
      if (!email) {
        setError('Email not found');
        return;
      }
      
      const replyResponse = await agentAPI.generateReply({ emailId });
      
      await draftAPI.createDraft({
        emailId: emailId,
        subject: `Re: ${email.subject}`,
        body: replyResponse.data.reply,
        metadata: {
          category: email.category,
          originalSender: email.sender
        }
      });
      
      setSuccess('Reply draft generated and saved! Check Drafts page.');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError('Failed to generate reply draft');
      console.error(err);
    }
  };

  const handleToggleActionItem = async (emailId, itemIndex) => {
    try {
      console.log('Toggling action item:', { emailId, itemIndex }); // Debug log
      
      const response = await emailAPI.toggleActionItem(emailId, itemIndex);
      
      console.log('Toggle response:', response.data); // Debug log
      
      // Update the emails list
      setEmails(prev =>
        prev.map(email =>
          email._id === emailId ? response.data : email
        )
      );
      
      // Update selected email if it's the one being updated
      if (selectedEmail?._id === emailId) {
        setSelectedEmail(response.data);
      }
      
      setSuccess('Action item updated!');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error('Toggle error details:', err); // More detailed error log
      console.error('Error response:', err.response); // See what server returned
      setError(err.response?.data?.error || 'Failed to update action item');
      setTimeout(() => setError(null), 3000);
    }
  };

  const filteredEmails = emails.filter(email => {
    if (filter === 'all') return true;
    if (filter === 'unprocessed') return !email.processed;
    if (filter === 'processed') return email.processed;
    return email.category === filter;
  });

  const stats = {
    total: emails.length,
    unprocessed: emails.filter(e => !e.processed).length,
    important: emails.filter(e => e.category === 'Important').length,
    todo: emails.filter(e => e.category === 'To-Do').length,
  };

  return (
    <div className="inbox-page">
      {/* Header */}
      <div className="inbox-header">
        <div>
          <h1>📬 Inbox</h1>
          <p className="inbox-subtitle">
            {stats.total} emails • {stats.unprocessed} unprocessed • {stats.important} important • {stats.todo} to-do
          </p>
        </div>
        
        <div className="inbox-actions">
          <button className="action-btn" onClick={handleLoadMockInbox} disabled={loading}>
            <Download size={18} />
            Load Mock Inbox
          </button>
          <button className="action-btn" onClick={() => loadEmails()} disabled={loading}>
            <RefreshCw size={18} />
            Refresh
          </button>
          <button 
            className="action-btn primary" 
            onClick={handleProcessAll} 
            disabled={loading || stats.unprocessed === 0}
          >
            <Zap size={18} />
            Process All
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="message-box error-box">
          ❌ {error}
        </div>
      )}
      
      {success && (
        <div className="message-box success-box">
          ✅ {success}
        </div>
      )}

      {/* Filter Bar */}
      {emails.length > 0 && (
        <div className="filter-bar">
          <Filter size={18} />
          <span>Filter:</span>
          <div className="filter-buttons">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All ({stats.total})
            </button>
            <button 
              className={filter === 'unprocessed' ? 'active' : ''}
              onClick={() => setFilter('unprocessed')}
            >
              Unprocessed ({stats.unprocessed})
            </button>
            <button 
              className={filter === 'processed' ? 'active' : ''}
              onClick={() => setFilter('processed')}
            >
              Processed ({stats.total - stats.unprocessed})
            </button>
            <button 
              className={filter === 'Important' ? 'active' : ''}
              onClick={() => setFilter('Important')}
            >
              Important ({stats.important})
            </button>
            <button 
              className={filter === 'To-Do' ? 'active' : ''}
              onClick={() => setFilter('To-Do')}
            >
              To-Do ({stats.todo})
            </button>
            <button 
              className={filter === 'Newsletter' ? 'active' : ''}
              onClick={() => setFilter('Newsletter')}
            >
              Newsletter
            </button>
            <button 
              className={filter === 'Spam' ? 'active' : ''}
              onClick={() => setFilter('Spam')}
            >
              Spam
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`inbox-content ${showDetail ? 'split-view' : 'full-view'}`}>
        <div className="inbox-list">
          <EmailList
            emails={filteredEmails}
            selectedEmail={selectedEmail}
            onSelectEmail={handleSelectEmail}
            loading={loading}
          />
        </div>

        {showDetail && (
          <div className="inbox-detail">
            <EmailDetail
              email={selectedEmail}
              onClose={handleCloseDetail}
              onProcess={handleProcessEmail}
              onGenerateReply={handleGenerateReply}
              onToggleActionItem={handleToggleActionItem}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxPage;