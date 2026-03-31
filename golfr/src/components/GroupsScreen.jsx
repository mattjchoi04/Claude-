import { useState } from 'react';
import { Plus, ChevronRight, Users, MessageSquare, Trophy } from 'lucide-react';
import { GROUPS, FRIENDS } from '../data';

function GroupDetail({ group, onBack, showToast }) {
  const [tab, setTab] = useState('feed');

  const members = [
    { initials: 'YO', name: 'You', isMe: true, score: 84, color: '#2d6a4f' },
    ...FRIENDS.slice(0, group.members > 6 ? 5 : group.members - 1).map(f => ({
      initials: f.initials, name: f.name.split(' ')[0], score: f.avgScore, color: f.color
    }))
  ];

  return (
    <div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Group header */}
      <div style={{
        background: group.bg,
        padding: '20px 20px 24px',
        position: 'relative',
      }}>
        <button className="icon-btn" onClick={onBack} style={{ marginBottom: 12, background: 'rgba(255,255,255,0.7)' }}>←</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="group-icon" style={{ background: 'white', width: 60, height: 60, fontSize: 28, borderRadius: 18 }}>
            {group.icon}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: group.color }}>{group.name}</div>
            <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>{group.type} · {group.members} members</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 20px', marginTop: 12 }}>
        <div className="pill-tabs">
          {['feed', 'leaderboard', 'chat'].map(t => (
            <button key={t} className={`pill-tab ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>
              {t === 'feed' ? '📰' : t === 'leaderboard' ? '🏆' : '💬'} {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 80px' }}>
        {tab === 'feed' && (
          <div>
            <button className="btn btn-secondary btn-sm btn-full" style={{ marginBottom: 16 }}
              onClick={() => showToast('Post to group!')}>
              + Post to group
            </button>
            {[
              { text: '🔥 Tyler just shot 76 — new group record!', time: '1h' },
              { text: '📅 Saturday round booked — Pebble Beach, 8am. Who\'s in?', time: '3h' },
              { text: '🏆 Weekly winner: Sam Lee with avg 77!', time: '1d' },
            ].map((p, i) => (
              <div key={i} className="card" style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.5 }}>{p.text}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 6 }}>{p.time} ago</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'leaderboard' && (
          <div className="card" style={{ padding: '8px 0' }}>
            {members.sort((a, b) => a.score - b.score).map((m, i) => (
              <div key={i} className="leaderboard-row">
                <div className={`leaderboard-rank ${m.isMe ? 'rank-you' : i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other'}`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </div>
                <div className="avatar avatar-sm" style={{ background: m.color + '22', color: m.color }}>{m.initials}</div>
                <div className="leaderboard-info">
                  <div className="leaderboard-name">{m.name} {m.isMe && <span className="badge badge-green" style={{ fontSize: 10, marginLeft: 4 }}>You</span>}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="leaderboard-score">{m.score}</div>
                  <div className="leaderboard-score-sub">avg</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'chat' && (
          <div>
            {[
              { from: 'Tyler', initials: 'TB', msg: 'Saturday still on?', time: '10m', color: '#2d6a4f', me: false },
              { from: 'You', initials: 'YO', msg: 'Yeah I\'m in!', time: '8m', color: '#64748b', me: true },
              { from: 'Jake', initials: 'JM', msg: 'Same, need to fix my iron game lol', time: '5m', color: '#7c3aed', me: false },
              { from: 'Tyler', initials: 'TB', msg: 'Haha no chance you fix that in 3 days 😂', time: '2m', color: '#2d6a4f', me: false },
            ].map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 12, flexDirection: msg.me ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
                {!msg.me && (
                  <div className="avatar avatar-sm" style={{ background: msg.color + '22', color: msg.color, flexShrink: 0 }}>{msg.initials}</div>
                )}
                <div style={{
                  background: msg.me ? 'var(--green)' : 'var(--gray-100)',
                  color: msg.me ? 'white' : 'var(--gray-800)',
                  padding: '10px 14px', borderRadius: msg.me ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  fontSize: 14, maxWidth: '70%',
                }}>
                  {!msg.me && <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 2, opacity: 0.7 }}>{msg.from}</div>}
                  {msg.msg}
                  <div style={{ fontSize: 10, opacity: 0.6, marginTop: 3, textAlign: 'right' }}>{msg.time}</div>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <input className="input" placeholder="Type a message..." style={{ flex: 1 }} />
              <button className="btn btn-primary btn-sm" onClick={() => showToast('Message sent!')}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GroupsScreen({ showToast }) {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showDiscover, setShowDiscover] = useState(false);

  if (selectedGroup) {
    return (
      <div className="screen">
        <GroupDetail group={selectedGroup} onBack={() => setSelectedGroup(null)} showToast={showToast} />
      </div>
    );
  }

  const discoverGroups = [
    { id: 10, name: 'City Golf League', type: 'Public League', icon: '🌆', color: '#0369a1', members: 124, bg: '#dbeafe' },
    { id: 11, name: 'Scratch Golfers Only', type: 'Competitive', icon: '🏅', color: '#7c3aed', members: 47, bg: '#ede9fe' },
    { id: 12, name: 'Senior Tuesday Group', type: 'Club', icon: '☀️', color: '#b45309', members: 32, bg: '#fef3c7' },
  ];

  return (
    <div className="screen fade-in">
      <div className="header">
        <span className="header-title">Groups</span>
        <button className="btn btn-primary btn-sm" onClick={() => showToast('Create group!')}>
          <Plus size={14} /> Create
        </button>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <div className="section-label">My Groups</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {GROUPS.map(g => (
            <div key={g.id} className="group-card" onClick={() => setSelectedGroup(g)}>
              <div className="group-icon" style={{ background: g.bg, fontSize: 24 }}>{g.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>{g.name}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>
                  <span className={`badge badge-${g.type === 'College Team' ? 'blue' : g.type === 'Golf Club' ? 'gold' : 'green'}`} style={{ fontSize: 10, marginRight: 6 }}>{g.type}</span>
                  👥 {g.members} members
                </div>
              </div>
              <ChevronRight size={16} color="var(--gray-300)" />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div className="section-label" style={{ margin: 0 }}>Discover Groups</div>
          <button style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }}
            onClick={() => setShowDiscover(!showDiscover)}>
            {showDiscover ? 'Hide' : 'Show all'}
          </button>
        </div>

        {(showDiscover ? discoverGroups : discoverGroups.slice(0, 2)).map(g => (
          <div key={g.id} className="group-card" style={{ marginBottom: 10 }}>
            <div className="group-icon" style={{ background: g.bg, fontSize: 24 }}>{g.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>{g.name}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>
                {g.type} · {g.members} members
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => showToast(`Joined ${g.name}!`)}>
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
