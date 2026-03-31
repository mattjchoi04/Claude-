import { useState, useEffect } from 'react';
import FeedScreen from './components/FeedScreen';
import PlayScreen from './components/PlayScreen';
import CompeteScreen from './components/CompeteScreen';
import GroupsScreen from './components/GroupsScreen';
import ProfileScreen from './components/ProfileScreen';
import MessagesScreen from './components/MessagesScreen';

const TABS = ['feed', 'compete', 'play', 'groups', 'profile'];

function NavIcon({ tab, active }) {
  const icons = {
    feed: active
      ? <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
      : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
    compete: active
      ? <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
      : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>,
    groups: active
      ? <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    profile: active
      ? <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  };
  return icons[tab] || null;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [showMessages, setShowMessages] = useState(false);
  const [toast, setToast] = useState({ msg: '', visible: false });
  const [showPlay, setShowPlay] = useState(false);

  function showToast(msg) {
    setToast({ msg, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2200);
  }

  function handleNavigate(dest) {
    if (dest === 'messages') setShowMessages(true);
    else { setActiveTab(dest); setShowMessages(false); }
  }

  function handleNavClick(tab) {
    if (tab === 'play') {
      setShowPlay(true);
      setShowMessages(false);
    } else {
      setShowPlay(false);
      setShowMessages(false);
      setActiveTab(tab);
    }
  }

  return (
    <div className="app-shell">
      {/* Screen area */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {showMessages ? (
          <MessagesScreen showToast={showToast} onBack={() => setShowMessages(false)} />
        ) : showPlay ? (
          <PlayScreen showToast={showToast} onPostRound={() => { setShowPlay(false); setActiveTab('feed'); }} />
        ) : activeTab === 'feed' ? (
          <FeedScreen showToast={showToast} onNavigate={handleNavigate} />
        ) : activeTab === 'compete' ? (
          <CompeteScreen showToast={showToast} />
        ) : activeTab === 'groups' ? (
          <GroupsScreen showToast={showToast} />
        ) : (
          <ProfileScreen showToast={showToast} />
        )}
      </div>

      {/* Bottom nav */}
      <div className="bottom-nav">
        <button className={`nav-item ${activeTab === 'feed' && !showPlay && !showMessages ? 'active' : ''}`}
          onClick={() => handleNavClick('feed')}>
          <NavIcon tab="feed" active={activeTab === 'feed' && !showPlay && !showMessages} />
          <span>Feed</span>
        </button>

        <button className={`nav-item ${activeTab === 'compete' && !showPlay ? 'active' : ''}`}
          onClick={() => handleNavClick('compete')}>
          <NavIcon tab="compete" active={activeTab === 'compete' && !showPlay} />
          <span>Compete</span>
        </button>

        {/* Center play button */}
        <button className="nav-play-btn" onClick={() => handleNavClick('play')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        </button>

        <button className={`nav-item ${activeTab === 'groups' && !showPlay ? 'active' : ''}`}
          onClick={() => handleNavClick('groups')}>
          <NavIcon tab="groups" active={activeTab === 'groups' && !showPlay} />
          <span>Groups</span>
        </button>

        <button className={`nav-item ${activeTab === 'profile' && !showPlay ? 'active' : ''}`}
          onClick={() => handleNavClick('profile')}>
          <NavIcon tab="profile" active={activeTab === 'profile' && !showPlay} />
          <span>Profile</span>
        </button>
      </div>

      {/* Toast */}
      <div className={`toast ${toast.visible ? 'show' : ''}`}>{toast.msg}</div>
    </div>
  );
}
