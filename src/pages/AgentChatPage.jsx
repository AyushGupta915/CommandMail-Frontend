import { useState, useRef, useEffect } from 'react';
import { useEmail } from '../context/EmailContext';
import { parseMarkdown } from '../services/parseMarkdown';
import { agentAPI } from '../services/api';
import { Send, Bot, User, Loader, Zap, Mail, Sparkles, MessageSquare } from 'lucide-react';
import './AgentChatPage.css';

const AgentChatPage = () => {
  const { emails } = useEmail();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedEmailForChat, setSelectedEmailForChat] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: "Hello! I'm your email assistant. I can help you with:\n\n• Summarizing emails\n• Finding urgent messages\n• Generating replies\n• Answering questions about your inbox\n\nWhat would you like to know?",
        timestamp: new Date()
      }
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await agentAPI.query({
        query: inputMessage,
        emailId: selectedEmailForChat?._id,
        context: selectedEmailForChat ? `Selected Email: ${selectedEmailForChat.subject}` : ''
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = async (action) => {
    let query = '';
    
    switch(action) {
      case 'urgent':
        query = 'Show me all urgent and important emails that need my attention';
        break;
      case 'summary':
        query = 'Give me a brief summary of my inbox';
        break;
      case 'todos':
        query = 'What are my action items and tasks from recent emails?';
        break;
      case 'unread':
        query = 'How many unprocessed emails do I have?';
        break;
      default:
        return;
    }

    setInputMessage(query);
    // Automatically send after a short delay
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleSelectEmailForChat = (email) => {
    setSelectedEmailForChat(email);
    const contextMessage = {
      role: 'system',
      content: `Selected email: "${email.subject}" from ${email.sender}`,
      timestamp: new Date(),
      isSystem: true
    };
    setMessages(prev => [...prev, contextMessage]);
  };

  const handleClearEmailContext = () => {
    setSelectedEmailForChat(null);
    const contextMessage = {
      role: 'system',
      content: 'Email context cleared',
      timestamp: new Date(),
      isSystem: true
    };
    setMessages(prev => [...prev, contextMessage]);
  };

  const processedEmails = emails.filter(e => e.processed);
  const urgentEmails = emails.filter(e => e.category === 'Important' || e.category === 'To-Do');

  return (
    <div className="agent-chat-page">
      {/* Header */}
      <div className="chat-header">
        <div>
          <h1>
            <MessageSquare size={32} />
            Agent Chat
          </h1>
          <p className="chat-subtitle">
            Ask questions about your emails and get AI-powered insights
          </p>
        </div>
        
        <div className="chat-stats">
          <div className="stat-item">
            <Mail size={18} />
            <span>{emails.length} Emails</span>
          </div>
          <div className="stat-item">
            <Zap size={18} />
            <span>{urgentEmails.length} Urgent</span>
          </div>
        </div>
      </div>

      <div className="chat-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="sidebar-section">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button 
                className="quick-action-btn"
                onClick={() => handleQuickAction('urgent')}
                disabled={loading}
              >
                <Zap size={16} />
                Show Urgent Emails
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => handleQuickAction('summary')}
                disabled={loading}
              >
                <Sparkles size={16} />
                Inbox Summary
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => handleQuickAction('todos')}
                disabled={loading}
              >
                <Zap size={16} />
                My Action Items
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => handleQuickAction('unread')}
                disabled={loading}
              >
                <Mail size={16} />
                Unprocessed Count
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Email Context</h3>
            {selectedEmailForChat ? (
              <div className="selected-email-context">
                <div className="context-email-info">
                  <Mail size={16} />
                  <div>
                    <strong>{selectedEmailForChat.subject}</strong>
                    <span>From: {selectedEmailForChat.sender}</span>
                  </div>
                </div>
                <button 
                  className="clear-context-btn"
                  onClick={handleClearEmailContext}
                >
                  Clear
                </button>
              </div>
            ) : (
              <div className="no-context">
                <p>No email selected</p>
                <p className="hint">Select an email below to chat about it</p>
              </div>
            )}
          </div>

          <div className="sidebar-section">
            <h3>Recent Emails</h3>
            <div className="email-list-sidebar">
              {processedEmails.length === 0 ? (
                <div className="no-emails-sidebar">
                  <p>No processed emails</p>
                  <p className="hint">Process some emails first in the Inbox</p>
                </div>
              ) : (
                processedEmails.slice(0, 10).map(email => (
                  <div 
                    key={email._id}
                    className={`email-item-sidebar ${selectedEmailForChat?._id === email._id ? 'selected' : ''}`}
                    onClick={() => handleSelectEmailForChat(email)}
                  >
                    <div className="email-item-header">
                      <span className="email-sender">{email.sender.split('@')[0]}</span>
                      <span className={`email-category cat-${email.category.toLowerCase().replace('-', '').replace(' ', '')}`}>
                        {email.category}
                      </span>
                    </div>
                    <p className="email-subject">{email.subject}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-main">
          <div className="messages-container">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`message ${message.role} ${message.isSystem ? 'system-message' : ''} ${message.isError ? 'error-message' : ''}`}
              >
                <div className="message-avatar">
                  {message.role === 'user' ? (
                    <User size={20} />
                  ) : message.isSystem ? (
                    <Mail size={20} />
                  ) : (
                    <Bot size={20} />
                  )}
                </div>
                <div className="message-content">
                  {/* UPDATED: Use parseMarkdown to render formatted text */}
                  <div 
                    className="message-text"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
                  />
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="message assistant">
                <div className="message-avatar">
                  <Bot size={20} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-container">
            <div className="chat-input-wrapper">
              <textarea
                className="chat-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your emails..."
                rows={1}
                disabled={loading}
              />
              <button 
                className="send-button"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || loading}
              >
                {loading ? (
                  <Loader size={20} className="spinning" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
            <p className="input-hint">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentChatPage;
