import { useEffect, useState } from 'react';
import { useEmail } from '../context/EmailContext';
import { promptAPI } from '../services/api';
import { Settings, Save, RotateCcw, Zap, AlertCircle } from 'lucide-react';
import './PromptBrainPage.css';

const PromptBrainPage = () => {
  const { loading, error, success, setError, setSuccess, initializePrompts } = useEmail();
  const [prompts, setPrompts] = useState([]);
  const [editingPrompts, setEditingPrompts] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  const loadPrompts = async (signal) => {
    try {
      const response = await promptAPI.getAllPrompts({ signal });
      // build editing state
      const initialEditing = {};
      response.data.forEach(prompt => {
        initialEditing[prompt.name] = prompt.content;
      });

      setPrompts(response.data);
      setEditingPrompts(initialEditing);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError('Failed to load prompts');
      console.error(err);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    Promise.resolve().then(() => loadPrompts(controller.signal));

    return () => controller.abort();
  }, []);

  const handlePromptChange = (promptName, value) => {
    setEditingPrompts(prev => ({
      ...prev,
      [promptName]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async (promptName) => {
    try {
      const prompt = prompts.find(p => p.name === promptName);
      if (!prompt) return;

      await promptAPI.updatePrompt(prompt._id, {
        content: editingPrompts[promptName]
      });

      setSuccess(`${getPromptTitle(promptName)} updated successfully!`);
      setTimeout(() => setSuccess(null), 3000);
      await loadPrompts();
      setHasChanges(false);
    } catch (err) {
      setError(`Failed to update ${getPromptTitle(promptName)}`);
      console.error(err);
    }
  };

  const handleSaveAll = async () => {
    try {
      for (const prompt of prompts) {
        await promptAPI.updatePrompt(prompt._id, {
          content: editingPrompts[prompt.name]
        });
      }
      setSuccess('All prompts updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
      await loadPrompts();
      setHasChanges(false);
    } catch (err) {
      setError('Failed to update prompts');
      console.error(err);
    }
  };

  const handleReset = async (promptName) => {
    const prompt = prompts.find(p => p.name === promptName);
    if (prompt) {
      setEditingPrompts(prev => ({
        ...prev,
        [promptName]: prompt.content
      }));
      setHasChanges(false);
    }
  };

  const handleResetAll = async () => {
    if (window.confirm('Reset all prompts to their current saved values?')) {
      const resetEditing = {};
      prompts.forEach(prompt => {
        resetEditing[prompt.name] = prompt.content;
      });
      setEditingPrompts(resetEditing);
      setHasChanges(false);
    }
  };

  const handleInitializeDefaults = async () => {
    if (window.confirm('Reset all prompts to default values? This will overwrite your current prompts.')) {
      try {
        await initializePrompts();
        await loadPrompts();
        setHasChanges(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getPromptTitle = (name) => {
    const titles = {
      categorization: 'Email Categorization',
      actionItem: 'Action Item Extraction',
      autoReply: 'Auto-Reply Generation'
    };
    return titles[name] || name;
  };

  const getPromptDescription = (name) => {
    const descriptions = {
      categorization: 'Define how emails should be categorized into Important, To-Do, Newsletter, or Spam',
      actionItem: 'Specify how to extract actionable tasks and deadlines from emails',
      autoReply: 'Set the tone and style for automatically generated email replies'
    };
    return descriptions[name] || '';
  };

  const getPromptIcon = (name) => {
    const icons = {
      categorization: '🏷️',
      actionItem: '⚡',
      autoReply: '✉️'
    };
    return icons[name] || '📝';
  };

  return (
    <div className="prompt-brain-page">
      {/* Header */}
      <div className="prompt-header">
        <div>
          <h1>
            <Settings size={32} />
            Prompt Brain
          </h1>
          <p className="prompt-subtitle">
            Customize how the AI agent processes and responds to your emails
          </p>
        </div>

        <div className="prompt-actions">
          <button 
            className="action-btn"
            onClick={handleResetAll}
            disabled={loading || !hasChanges}
          >
            <RotateCcw size={18} />
            Reset All
          </button>
          <button 
            className="action-btn"
            onClick={handleInitializeDefaults}
            disabled={loading}
          >
            <Zap size={18} />
            Reset to Defaults
          </button>
          <button 
            className="action-btn primary"
            onClick={handleSaveAll}
            disabled={loading || !hasChanges}
          >
            <Save size={18} />
            Save All Changes
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

      {/* Info Box */}
      <div className="info-box">
        <AlertCircle size={20} />
        <div>
          <strong>How it works:</strong> These prompts guide the AI when processing emails. 
          Edit them to customize categorization rules, action item extraction, and reply generation. 
          Changes will apply to all newly processed emails.
        </div>
      </div>

      {/* Prompt Cards */}
      <div className="prompts-grid">
        {prompts.map((prompt) => (
          <div key={prompt._id} className="prompt-card">
            <div className="prompt-card-header">
              <div className="prompt-title">
                <span className="prompt-icon">{getPromptIcon(prompt.name)}</span>
                <div>
                  <h3>{getPromptTitle(prompt.name)}</h3>
                  <p className="prompt-description">
                    {getPromptDescription(prompt.name)}
                  </p>
                </div>
              </div>
            </div>

            <div className="prompt-card-body">
              <label htmlFor={`prompt-${prompt.name}`}>Prompt Content</label>
              <textarea
                id={`prompt-${prompt.name}`}
                className="prompt-textarea"
                value={editingPrompts[prompt.name] || ''}
                onChange={(e) => handlePromptChange(prompt.name, e.target.value)}
                rows={12}
                placeholder="Enter prompt instructions..."
              />
              
              <div className="prompt-meta">
                <span className="char-count">
                  {editingPrompts[prompt.name]?.length || 0} characters
                </span>
                <span className={`status ${prompt.isActive ? 'active' : 'inactive'}`}>
                  {prompt.isActive ? '● Active' : '○ Inactive'}
                </span>
              </div>
            </div>

            <div className="prompt-card-footer">
              <button
                className="btn-secondary"
                onClick={() => handleReset(prompt.name)}
                disabled={loading}
              >
                <RotateCcw size={16} />
                Reset
              </button>
              <button
                className="btn-primary"
                onClick={() => handleSave(prompt.name)}
                disabled={loading}
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      <div className="tips-section">
        <h3>💡 Prompt Writing Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <strong>Be Specific</strong>
            <p>Clearly define categories, rules, and expected outputs</p>
          </div>
          <div className="tip-card">
            <strong>Use Examples</strong>
            <p>Include examples of good and bad categorizations</p>
          </div>
          <div className="tip-card">
            <strong>Set Constraints</strong>
            <p>Specify output format (e.g., "respond with only one word")</p>
          </div>
          <div className="tip-card">
            <strong>Test Changes</strong>
            <p>Process a few emails to verify your prompts work as expected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptBrainPage;
