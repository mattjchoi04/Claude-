import { useState } from 'react';
import { ChevronLeft, Send } from 'lucide-react';
import { MESSAGES } from '../data';

function ChatView({ convo, onBack, showToast }) {
  const [message, setMessage] = useState('');
  const [msgs, setMsgs] = useState([
    { from: convo.isGroup ? 'Tyler' : convo.with.name, me: false, text: convo.lastMsg, time: convo.time },
  ]);

  function sendMessage() {
    if (!message.trim()) return;
    setMsgs(prev => [...prev, { from: 'You', me: true, text: message, time: 'now' }]);
    setMessage('');
    setTimeout(() => {
      const replies = ['Haha nice 😂', 'I\'m in!', '💪', 'You\'re going down', 'Saturday works for me!'];
      setMsgs(prev => [...prev, { from: convo.isGroup ? 'Tyler' : convo.with.name, me: false, text: replies[Math.floor(Math.random() * replies.length)], time: 'now' }]);
    }, 1000);
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="header">
        <button className="icon-btn" onClick={onBack}><ChevronLeft size={20} /></button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>
            {convo.isGroup ? convo.name : convo.with.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>
            {convo.isGroup ? 'Group chat' : 'Active now'}
          </div>
        </div>
        <button className="icon-btn" onClick={() => showToast('Info')} style={{ visibility: 'visible' }}>
          ℹ️
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {msgs.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: msg.me ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
            {!msg.me && (
              <div className="avatar avatar-sm" style={{ background: 'var(--gray-200)', fontSize: 12 }}>
                {convo.isGroup ? msg.from[0] : (convo.with.initials)}
              </div>
            )}
            <div>
              {!msg.me && convo.isGroup && (
                <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 3, marginLeft: 4 }}>{msg.from}</div>
              )}
              <div style={{
                background: msg.me ? 'var(--green)' : 'var(--gray-100)',
                color: msg.me ? 'white' : 'var(--gray-800)',
                padding: '10px 14px',
                borderRadius: msg.me ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                fontSize: 14,
                maxWidth: 240,
              }}>
                {msg.text}
              </div>
              <div style={{ fontSize: 10, color: 'var(--gray-400)', marginTop: 3, textAlign: msg.me ? 'right' : 'left', paddingLeft: msg.me ? 0 : 4 }}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick replies */}
      <div style={{ padding: '8px 16px', overflowX: 'auto', display: 'flex', gap: 8, borderTop: '1px solid var(--gray-100)' }}>
        {['I\'m in!', '👍', 'Saturday works', '💪', 'You\'re on!'].map(r => (
          <button key={r} onClick={() => setMessage(r)}
            style={{ padding: '6px 14px', borderRadius: 20, border: '1.5px solid var(--gray-200)', background: 'var(--white)', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', color: 'var(--gray-700)' }}>
            {r}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '10px 16px 24px', display: 'flex', gap: 10, borderTop: '1px solid var(--gray-100)' }}>
        <input
          className="input"
          placeholder="Message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1 }}
        />
        <button
          className="btn btn-primary btn-sm"
          onClick={sendMessage}
          style={{ width: 42, padding: 0 }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

export default function MessagesScreen({ showToast, onBack }) {
  const [openChat, setOpenChat] = useState(null);

  if (openChat) {
    return (
      <div className="screen">
        <ChatView convo={openChat} onBack={() => setOpenChat(null)} showToast={showToast} />
      </div>
    );
  }

  return (
    <div className="screen fade-in">
      <div className="header">
        <button className="icon-btn" onClick={onBack}><ChevronLeft size={20} /></button>
        <span className="header-title">Messages</span>
        <button className="btn btn-secondary btn-sm" onClick={() => showToast('New message')}>New</button>
      </div>

      <div style={{ padding: '12px 20px' }}>
        <input className="input" placeholder="Search messages..." />
      </div>

      {MESSAGES.map(m => (
        <div key={m.id} className="message-row" onClick={() => setOpenChat(m)}>
          {m.isGroup ? (
            <div className="avatar avatar-md" style={{ background: 'var(--green-bg)', color: 'var(--green-dark)', fontSize: 20 }}>
              {m.icon}
            </div>
          ) : (
            <div className="avatar avatar-md" style={{ background: m.with.color + '22', color: m.with.color }}>
              {m.with.initials}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>
                {m.isGroup ? m.name : m.with.name}
              </span>
              <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{m.time}</span>
            </div>
            <div style={{
              fontSize: 13,
              color: m.unread ? 'var(--gray-700)' : 'var(--gray-400)',
              fontWeight: m.unread ? 600 : 400,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginTop: 2,
            }}>
              {m.lastMsg}
            </div>
          </div>
          {m.unread && <div className="unread-dot" />}
        </div>
      ))}
    </div>
  );
}
