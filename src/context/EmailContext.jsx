import { createContext, useContext, useState } from 'react';
import { emailAPI, promptAPI } from '../services/api';

const EmailContext = createContext(undefined);

// Custom hook to use the Email context
export function useEmail() {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error('useEmail must be used within EmailProvider');
  }
  return context;
}

// Email Provider Component
export function EmailProvider({ children }) {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load emails
  const loadEmails = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailAPI.getAllEmails(filters);
      setEmails(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load emails');
      console.error('Load emails error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load mock inbox
  const loadMockInbox = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailAPI.loadMockInbox();
      setEmails(response.data.emails);
      setSuccess(`Loaded ${response.data.count} emails successfully!`);
      setTimeout(() => setSuccess(null), 3000);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load mock inbox');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Process single email
  const processEmail = async (emailId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailAPI.processEmail(emailId);
      
      // Update email in list
      setEmails(prev => 
        prev.map(email => 
          email._id === emailId ? response.data : email
        )
      );
      
      // Update selected email if it's the one being processed
      if (selectedEmail?._id === emailId) {
        setSelectedEmail(response.data);
      }
      
      setSuccess('Email processed successfully!');
      setTimeout(() => setSuccess(null), 3000);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process email');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Process all emails
  const processAllEmails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailAPI.processAllEmails();
      await loadEmails(); // Reload all emails
      setSuccess(response.data.message);
      setTimeout(() => setSuccess(null), 3000);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process emails');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initialize prompts
  const initializePrompts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await promptAPI.initializePrompts();
      setPrompts(response.data.prompts);
      setSuccess('Prompts initialized successfully!');
      setTimeout(() => setSuccess(null), 3000);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to initialize prompts');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    emails,
    setEmails,
    selectedEmail,
    setSelectedEmail,
    prompts,
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
  };

  return (
    <EmailContext.Provider value={value}>
      {children}
    </EmailContext.Provider>
  );
}