import { useState } from 'react';
import { Settings, Award, ChevronRight, TrendingDown } from 'lucide-react';
import { ME, FRIENDS } from '../data';

const BADGES = [
  { icon: '🦅', name: 'Eagle Club', desc: '5+ eagles', unlocked: true },
  { icon: '🐦', name: 'Birdie Machine', desc: '50+ birdies', unlocked: true },
  { icon: '🏌️', name: 'Iron Man', desc: '50 rounds', unlocked: false },
  { icon: '📉', name: 'Scratch Chaser', desc: 'Under 5 handicap', unlocked: false },
  { icon: '🔥', name: 'On Fire', desc: '5-win streak', unlocked: true },
  { icon: '⛳', name: 'Social Golfer', desc: '100 posts', unlocked: false },
];

const RECENT_ROUNDS = [
  { course: 'Pebble Beach', score: 82, vsPar: '+10', date: 'Mar 28', stats: { fairways: '43%', gir: '33%', putts: 35 } },
  { course: 'Torrey Pines', score: 84, vsPar: '+12', date: 'Mar 21', stats: { fairways: '50%', gir: '39%', putts: 33 } },
  { course: 'Augusta National', score: 79, vsPar: '+7', date: 'Mar 14', stats: { fairways: '64%', gir: '50%', putts: 30 } },
  { course: 'Pebble Beach', score: 86, vsPar: '+14', date: 'Mar 7', stats: { fairways: '36%', gir: '28%', putts: 36 } },
];

const HANDICAP_HISTORY = [14.2, 13.8, 13.5, 13.1, 12.8, 12.4];

function FriendProfile({ friend, onBack, showToast }) {
  return (
    <div className="screen fade-in">
      <div className="profile-cover">
        <button className="icon-btn" onClick={onBack}
          style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(255,255,255,0.2)', color: 'white' }}>←</button>
      </div>
      <div className="profile-avatar-wrap">
        <div className="avatar avatar-xl" style={{ background: friend.color + '22', color: friend.color }}>
          {friend.initials}
        </div>
      </div>
      <div style={{ padding: '56px 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--gray-900)' }}>{friend.name}</div>
            <div style={{ fontSize: 14, color: 'var(--gray-400)' }}>{friend.username}</div>
          </div>
          <button className="btn btn-gold btn-sm" onClick={() => showToast('Challenge sent! ⚡')}>⚡ Challenge</button>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => showToast('Following!')}>Follow</button>
          <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => showToast('Message sent!')}>Message</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          <div className="stat-pill">
            <div className="stat-pill-value">{friend.handicap}</div>
            <div className="stat-pill-label">HCP</div>
          </div>
          <div className="stat-pill">
            <div className="stat-pill-value">{friend.avgScore}</div>
            <div className="stat-pill-label">Avg Score</div>
          </div>
          <div className="stat-pill">
            <div className="stat-pill-value">{friend.roundsPlayed}</div>
            <div className="stat-pill-label">Rounds</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfileScreen({ showToast }) {
  const [tab, setTab] = useState('stats');
  const [viewingFriend, setViewingFriend] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  if (viewingFriend) {
    return <FriendProfile friend={viewingFriend} onBack={() => setViewingFriend(null)} showToast={showToast} />;
  }

  return (
    <div className="screen fade-in">
      {/* Cover photo */}
      <div className="profile-cover">
        <div className="profile-avatar-wrap">
          <div className="avatar avatar-xl" style={{ background: 'var(--green-bg)', color: 'var(--green-dark)' }}>YO</div>
        </div>
        <button className="icon-btn" onClick={() => setShowSettings(true)}
          style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.2)', color: 'white' }}>
          <Settings size={18} />
        </button>
      </div>

      {/* Profile info */}
      <div style={{ padding: '52px 20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--gray-900)' }}>{ME.name}</div>
            <div style={{ fontSize: 14, color: 'var(--gray-400)' }}>{ME.username}</div>
            <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>📍 {ME.homeCourse}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-green" style={{ fontSize: 13, padding: '5px 12px' }}>HCP {ME.handicap}</span>
            <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>↓ 1.8 this year</div>
          </div>
        </div>

        {/* Stat pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 16 }}>
          <div className="stat-pill">
            <div className="stat-pill-value">{ME.avgScore}</div>
            <div className="stat-pill-label">Avg Score</div>
          </div>
          <div className="stat-pill">
            <div className="stat-pill-value">{ME.bestScore}</div>
            <div className="stat-pill-label">Best Score</div>
          </div>
          <div className="stat-pill">
            <div className="stat-pill-value">{ME.roundsPlayed}</div>
            <div className="stat-pill-label">Rounds</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 20px' }}>
        <div className="pill-tabs">
          {['stats', 'rounds', 'friends', 'badges'].map(t => (
            <button key={t} className={`pill-tab ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)} style={{ textTransform: 'capitalize', fontSize: 12 }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        {/* Stats tab */}
        {tab === 'stats' && (
          <div className="fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Fairways Hit', value: `${ME.fairwayPct}%` },
                { label: 'Greens in Reg', value: `${ME.girPct}%` },
                { label: 'Avg Putts', value: ME.avgPutts },
                { label: 'Best Score', value: ME.bestScore },
              ].map(s => (
                <div key={s.label} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--green)' }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Handicap trend */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <TrendingDown size={16} color="var(--green)" />
                <span style={{ fontSize: 14, fontWeight: 700 }}>Handicap Trend</span>
                <span className="badge badge-green" style={{ marginLeft: 'auto', fontSize: 11 }}>↓ 1.8</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60 }}>
                {HANDICAP_HISTORY.map((h, i) => {
                  const max = Math.max(...HANDICAP_HISTORY);
                  const min = Math.min(...HANDICAP_HISTORY);
                  const height = ((h - min) / (max - min + 1)) * 40 + 20;
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                      <div style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 600 }}>{h}</div>
                      <div style={{ width: '100%', height: `${height}px`, background: i === HANDICAP_HISTORY.length - 1 ? 'var(--green)' : 'var(--gray-200)', borderRadius: 4 }} />
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: 11, color: 'var(--gray-400)', textAlign: 'center', marginTop: 8 }}>Last 6 rounds</div>
            </div>

            {/* Pro upsell */}
            <div className="card" style={{ marginTop: 12, background: 'linear-gradient(135deg, #1b4332, #2d6a4f)', color: 'white', border: 'none' }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>🏆 Unlock Pro Stats</div>
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 12 }}>Strokes gained, shot dispersion, full history, ad-free</div>
              <button className="btn btn-gold btn-sm" onClick={() => showToast('Golfr Pro — $7.99/mo!')}>
                Try Pro Free
              </button>
            </div>
          </div>
        )}

        {/* Rounds tab */}
        {tab === 'rounds' && (
          <div className="fade-in">
            {RECENT_ROUNDS.map((r, i) => (
              <div key={i} className="card" style={{ marginBottom: 10, cursor: 'pointer' }}
                onClick={() => showToast(`View round at ${r.course}`)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>📍 {r.course}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{r.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 24, fontWeight: 900 }}>{r.score}</div>
                    <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{r.vsPar}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {Object.entries(r.stats).map(([k, v]) => (
                    <span key={k} style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                      {k === 'fairways' ? 'FWY' : k === 'gir' ? 'GIR' : 'Putts'}: <strong>{v}</strong>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Friends tab */}
        {tab === 'friends' && (
          <div className="fade-in">
            <input className="input" placeholder="Search friends..." style={{ marginBottom: 14 }} />
            {FRIENDS.map(f => (
              <div key={f.id}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--gray-100)', cursor: 'pointer' }}
                onClick={() => setViewingFriend(f)}>
                <div className="avatar avatar-md" style={{ background: f.color + '22', color: f.color }}>{f.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{f.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{f.username} · HCP {f.handicap}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{f.avgScore}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>avg</div>
                </div>
                <ChevronRight size={14} color="var(--gray-300)" />
              </div>
            ))}
          </div>
        )}

        {/* Badges tab */}
        {tab === 'badges' && (
          <div className="fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {BADGES.map(b => (
                <div key={b.name} className="card" style={{
                  textAlign: 'center', padding: '16px 10px',
                  opacity: b.unlocked ? 1 : 0.4,
                }}>
                  <div style={{ fontSize: 32, marginBottom: 6 }}>{b.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-800)' }}>{b.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--gray-400)', marginTop: 3 }}>{b.desc}</div>
                  {b.unlocked && <div style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700, marginTop: 4 }}>✓ Earned</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Settings modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Settings</h2>
            {['Edit Profile', 'Notifications', 'Privacy', 'Golfr Pro', 'Invite Friends', 'Help & Support', 'Sign Out'].map(item => (
              <div key={item}
                style={{ padding: '14px 0', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontSize: 15 }}
                onClick={() => { showToast(item); setShowSettings(false); }}>
                <span style={{ color: item === 'Sign Out' ? 'var(--red)' : 'var(--gray-800)' }}>{item}</span>
                {item !== 'Sign Out' && <ChevronRight size={16} color="var(--gray-300)" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
