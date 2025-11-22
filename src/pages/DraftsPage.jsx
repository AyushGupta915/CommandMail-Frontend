import { useState, useEffect } from 'react';
import { draftAPI, agentAPI } from '../services/api';
import { FileText, Trash2, Edit, Save, X, Mail, Plus, Sparkles, Send } from 'lucide-react';
import './DraftsPage.css';

const DraftsPage = () => {
  const [drafts, setDrafts] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [editingDraft, setEditingDraft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showNewDraftForm, setShowNewDraftForm] = useState(false);
  const [newDraft, setNewDraft] = useState({
    subject: '',
    body: '',
    metadata: {}
  });

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      setLoading(true);
      const response = await draftAPI.getAllDrafts();
      setDrafts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load drafts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDraft = (draft) => {
    setSelectedDraft(draft);
    setEditingDraft(null);
    setShowNewDraftForm(false);
  };

  const handleEditDraft = () => {
    if (selectedDraft) {
      setEditingDraft({
        ...selectedDraft,
        subject: selectedDraft.subject,
        body: selectedDraft.body
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingDraft(null);
  };

  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      await draftAPI.updateDraft(editingDraft._id, {
        subject: editingDraft.subject,
        body: editingDraft.body
      });
      
      setSuccess('Draft updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
      
      await loadDrafts();
      setSelectedDraft(editingDraft);
      setEditingDraft(null);
    } catch (err) {
      setError('Failed to update draft');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDraft = async (draftId) => {
    if (!window.confirm('Are you sure you want to delete this draft?')) {
      return;
    }

    try {
      setLoading(true);
      await draftAPI.deleteDraft(draftId);
      
      setSuccess('Draft deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
      
      if (selectedDraft?._id === draftId) {
        setSelectedDraft(null);
      }
      
      await loadDrafts();
    } catch (err) {
      setError('Failed to delete draft');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewDraft = () => {
    setShowNewDraftForm(true);
    setSelectedDraft(null);
    setEditingDraft(null);
    setNewDraft({
      subject: '',
      body: '',
      metadata: {}
    });
  };

  const handleSaveNewDraft = async () => {
    if (!newDraft.subject.trim() || !newDraft.body.trim()) {
      setError('Subject and body are required');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setLoading(true);
      await draftAPI.createDraft(newDraft);
      
      setSuccess('Draft created successfully!');
      setTimeout(() => setSuccess(null), 3000);
      
      setShowNewDraftForm(false);
      setNewDraft({ subject: '', body: '', metadata: {} });
      await loadDrafts();
    } catch (err) {
      setError('Failed to create draft');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImproveWithAI = async () => {
    if (!editingDraft) return;

    try {
      setLoading(true);
      const response = await agentAPI.query({
        query: `Improve this email draft. Make it more professional and clear while keeping the same meaning:\n\nSubject: ${editingDraft.subject}\n\nBody:\n${editingDraft.body}`
      });

      // Extract improved content from AI response
      const improvedBody = response.data.response;
      
      setEditingDraft({
        ...editingDraft,
        body: improvedBody
      });
      
      setSuccess('Draft improved with AI!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to improve draft with AI');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="drafts-page">
      {/* Header */}
      <div className="drafts-header">
        <div>
          <h1>
            <FileText size={32} />
            Drafts
          </h1>
          <p className="drafts-subtitle">
            {drafts.length} draft{drafts.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        
        <button 
          className="action-btn primary"
          onClick={handleCreateNewDraft}
          disabled={loading}
        >
          <Plus size={18} />
          New Draft
        </button>
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

      <div className="drafts-container">
        {/* Drafts List */}
        <div className="drafts-list">
          {loading && drafts.length === 0 ? (
            <div className="drafts-loading">
              <div className="spinner"></div>
              <p>Loading drafts...</p>
            </div>
          ) : drafts.length === 0 ? (
            <div className="drafts-empty">
              <FileText size={64} />
              <h3>No Drafts Yet</h3>
              <p>Create a new draft to get started</p>
            </div>
          ) : (
            drafts.map((draft) => (
              <div
                key={draft._id}
                className={`draft-card ${selectedDraft?._id === draft._id ? 'selected' : ''}`}
                onClick={() => handleSelectDraft(draft)}
              >
                <div className="draft-card-header">
                  <h3>{draft.subject || 'No Subject'}</h3>
                  <button
                    className="delete-btn-small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDraft(draft._id);
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="draft-preview">{draft.body}</p>
                <div className="draft-card-footer">
                  <span className="draft-date">
                    {formatDate(draft.createdAt)}
                  </span>
                  {draft.emailId && (
                    <span className="draft-reply-badge">
                      <Mail size={12} />
                      Reply
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Draft Detail / Editor */}
        <div className="draft-detail">
          {showNewDraftForm ? (
            // New Draft Form
            <div className="draft-editor">
              <div className="editor-header">
                <h2>
                  <Plus size={24} />
                  New Draft
                </h2>
                <button className="close-btn" onClick={() => setShowNewDraftForm(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="editor-content">
                <div className="form-group">
                  <label htmlFor="new-subject">Subject</label>
                  <input
                    id="new-subject"
                    type="text"
                    className="form-input"
                    value={newDraft.subject}
                    onChange={(e) => setNewDraft({ ...newDraft, subject: e.target.value })}
                    placeholder="Email subject..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="new-body">Body</label>
                  <textarea
                    id="new-body"
                    className="form-textarea"
                    value={newDraft.body}
                    onChange={(e) => setNewDraft({ ...newDraft, body: e.target.value })}
                    placeholder="Write your email..."
                    rows={15}
                  />
                </div>

                <div className="editor-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => setShowNewDraftForm(false)}
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    className="btn-primary"
                    onClick={handleSaveNewDraft}
                    disabled={loading}
                  >
                    <Save size={18} />
                    Save Draft
                  </button>
                </div>
              </div>
            </div>
          ) : editingDraft ? (
            // Edit Existing Draft
            <div className="draft-editor">
              <div className="editor-header">
                <h2>
                  <Edit size={24} />
                  Edit Draft
                </h2>
                <button className="close-btn" onClick={handleCancelEdit}>
                  <X size={20} />
                </button>
              </div>

              <div className="editor-content">
                <div className="form-group">
                  <label htmlFor="edit-subject">Subject</label>
                  <input
                    id="edit-subject"
                    type="text"
                    className="form-input"
                    value={editingDraft.subject}
                    onChange={(e) => setEditingDraft({ ...editingDraft, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-body">Body</label>
                  <textarea
                    id="edit-body"
                    className="form-textarea"
                    value={editingDraft.body}
                    onChange={(e) => setEditingDraft({ ...editingDraft, body: e.target.value })}
                    rows={15}
                  />
                </div>

                <div className="editor-actions">
                  <button
                    className="btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    className="btn-ai"
                    onClick={handleImproveWithAI}
                    disabled={loading}
                  >
                    <Sparkles size={18} />
                    Improve with AI
                  </button>
                  <button
                    className="btn-primary"
                    onClick={handleSaveDraft}
                    disabled={loading}
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          ) : selectedDraft ? (
            // View Draft
            <div className="draft-viewer">
              <div className="viewer-header">
                <h2>Draft Details</h2>
                <div className="viewer-actions">
                  <button
                    className="btn-icon"
                    onClick={handleEditDraft}
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="btn-icon danger"
                    onClick={() => handleDeleteDraft(selectedDraft._id)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="viewer-content">
                <div className="draft-meta">
                  <div className="meta-row">
                    <span className="meta-label">Created:</span>
                    <span className="meta-value">{formatDate(selectedDraft.createdAt)}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Last Updated:</span>
                    <span className="meta-value">{formatDate(selectedDraft.updatedAt)}</span>
                  </div>
                  {selectedDraft.emailId && (
                    <div className="meta-row">
                      <span className="reply-indicator">
                        <Mail size={16} />
                        This is a reply draft
                      </span>
                    </div>
                  )}
                </div>

                <div className="draft-subject-view">
                  <h3>Subject</h3>
                  <p>{selectedDraft.subject || 'No Subject'}</p>
                </div>

                <div className="draft-body-view">
                  <h3>Body</h3>
                  <div className="body-content">
                    {selectedDraft.body.split('\n').map((line, index) => (
                      <p key={index}>{line || '\u00A0'}</p>
                    ))}
                  </div>
                </div>

                <div className="draft-actions-view">
                  <button className="btn-secondary" onClick={handleEditDraft}>
                    <Edit size={18} />
                    Edit Draft
                  </button>
                  <button className="btn-primary" disabled>
                    <Send size={18} />
                    Send Email (Coming Soon)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Empty State
            <div className="draft-detail-empty">
              <FileText size={80} />
              <h3>No Draft Selected</h3>
              <p>Select a draft from the list or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraftsPage;