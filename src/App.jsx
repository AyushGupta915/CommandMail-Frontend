import { useState } from 'react';
import { EmailProvider } from './context/EmailContext';
import { Mail, MessageSquare, Settings, FileText, BarChart3 } from 'lucide-react';
import InboxPage from './pages/InboxPage';
import PromptBrainPage from './pages/PromptBrainPage';
import AgentChatPage from './pages/AgentChatPage';
import DraftsPage from './pages/DraftsPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('inbox');

  return (
    <EmailProvider>
      <div className="app">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-content">
            <div className="navbar-brand">
              <Mail size={28} />
              <span>CommandMail</span>
            </div>
            
            <ul className="navbar-nav">
              {/* Inbox */}
              <li>
                <button 
                  className={`nav-button ${currentView === 'inbox' ? 'active' : ''}`}
                  onClick={() => setCurrentView('inbox')}
                >
                  <Mail size={18} />
                  Inbox
                </button>
              </li>
              
              {/* Dashboard */}
              <li>
                <button 
                  className={`nav-button ${currentView === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setCurrentView('dashboard')}
                >
                  <BarChart3 size={18} />
                  Dashboard
                </button>
              </li>

              {/* Prompts */}
              <li>
                <button 
                  className={`nav-button ${currentView === 'prompts' ? 'active' : ''}`}
                  onClick={() => setCurrentView('prompts')}
                >
                  <Settings size={18} />
                  Prompts
                </button>
              </li>

              {/* Agent Chat */}
              <li>
                <button 
                  className={`nav-button ${currentView === 'agent' ? 'active' : ''}`}
                  onClick={() => setCurrentView('agent')}
                >
                  <MessageSquare size={18} />
                  Agent Chat
                </button>
              </li>

              {/* Drafts */}
              <li>
                <button 
                  className={`nav-button ${currentView === 'drafts' ? 'active' : ''}`}
                  onClick={() => setCurrentView('drafts')}
                >
                  <FileText size={18} />
                  Drafts
                </button>
              </li>

            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-container">
          {currentView === 'inbox' && <InboxPage />}
          {currentView === 'dashboard' && <DashboardPage />}
          {currentView === 'prompts' && <PromptBrainPage />}
          {currentView === 'agent' && <AgentChatPage />}
          {currentView === 'drafts' && <DraftsPage />}
        </main>
      </div>
    </EmailProvider>
  );
}

export default App;
