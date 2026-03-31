import { useState } from 'react';
import { Plus, Trophy, Zap, Calendar } from 'lucide-react';
import { LEADERBOARD_DATA, CHALLENGES, FRIENDS } from '../data';

function LeaderboardTab({ data, showToast }) {
  return (
    <div>
      {data.map((player, i) => {
        const rank = i + 1;
        let rankCls = 'rank-other';
        if (player.isMe) rankCls = 'rank-you';
        else if (rank === 1) rankCls = 'rank-1';
        else if (rank === 2) rankCls = 'rank-2';
        else if (rank === 3) rankCls = 'rank-3';

        return (
          <div key={player.id} className="leaderboard-row"
            onClick={() => showToast(player.isMe ? 'That\'s you! 🏌️' : `View ${player.name}'s profile`)}>
            <div className={`leaderboard-rank ${rankCls}`}>
              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
            </div>
            <div
              className="avatar avatar-sm"
              style={{
                background: player.isMe ? 'var(--green-bg)' : player.color + '22',
                color: player.isMe ? 'var(--green-dark)' : player.color
              }}
            >
              {player.initials}
            </div>
            <div className="leaderboard-info">
              <div className="leaderboard-name">
                {player.name}
                {player.isMe && <span className="badge badge-green" style={{ marginLeft: 6, fontSize: 10 }}>You</span>}
              </div>
              <div className="leaderboard-sub">{player.rounds} rounds this week</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="leaderboard-score">{player.score}</div>
              <div className="leaderboard-score-sub">avg</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChallengesTab({ showToast }) {
  const [challenges, setChallenges] = useState(CHALLENGES);
  const [showCreate, setShowCreate] = useState(false);

  function acceptChallenge(id) {
    setChallenges(chs => chs.map(c => c.id === id ? { ...c, type: 'active' } : c));
    showToast('Challenge accepted! Game on 🔥');
  }

  if (showCreate) {
    return <CreateChallenge onBack={() => setShowCreate(false)} showToast={showToast} />;
  }

  return (
    <div>
      <button className="btn btn-primary btn-full" style={{ marginBottom: 20 }} onClick={() => setShowCreate(true)}>
        <Plus size={16} /> Create Challenge
      </button>

      <div className="section-label">Active</div>
      {challenges.filter(c => c.type === 'active').map(ch => (
        <ChallengeCard key={ch.id} challenge={ch} showToast={showToast} />
      ))}

      <div className="section-label" style={{ marginTop: 16 }}>Pending</div>
      {challenges.filter(c => c.type === 'pending').map(ch => (
        <div key={ch.id} className="challenge-card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{ch.title}</div>
              <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>{ch.stakes}</div>
            </div>
            <span className="badge badge-gray">Pending</span>
          </div>
          <div className="challenge-vs">
            <div className="challenge-player">
              <div className="avatar avatar-sm" style={{ background: ch.opponent.color + '22', color: ch.opponent.color }}>
                {ch.opponent.initials}
              </div>
              <span className="challenge-player-name">{ch.opponent.name}</span>
              <span className="challenge-player-score">{ch.theirScore}</span>
            </div>
            <span className="vs-divider">VS</span>
            <div className="challenge-player">
              <div className="avatar avatar-sm" style={{ background: 'var(--green-bg)', color: 'var(--green-dark)' }}>YO</div>
              <span className="challenge-player-name">You</span>
              <span className="challenge-player-score">{ch.myScore ?? '—'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => acceptChallenge(ch.id)}>Accept</button>
            <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => showToast('Challenge declined')}>Decline</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChallengeCard({ challenge: ch, showToast }) {
  return (
    <div className="challenge-card" style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{ch.title}</div>
          <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>{ch.stakes}</div>
        </div>
        <span className={`badge ${ch.leading ? 'badge-green' : 'badge-red'}`}>
          {ch.leading ? '⬆ Leading' : '⬇ Behind'}
        </span>
      </div>
      <div className="challenge-vs">
        <div className="challenge-player">
          <div className="avatar avatar-sm" style={{ background: ch.opponent.color + '22', color: ch.opponent.color }}>
            {ch.opponent.initials}
          </div>
          <span className="challenge-player-name">{ch.opponent.name}</span>
          <span className={`challenge-player-score ${!ch.leading ? 'leading' : ''}`}>
            {ch.theirScore ?? '—'}
          </span>
        </div>
        <span className="vs-divider">VS</span>
        <div className="challenge-player">
          <div className="avatar avatar-sm" style={{ background: 'var(--green-bg)', color: 'var(--green-dark)' }}>YO</div>
          <span className="challenge-player-name">You</span>
          <span className={`challenge-player-score ${ch.leading ? 'leading' : ''}`}>
            {ch.myScore ?? '—'}
          </span>
        </div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 8 }}>
        ⏱ {ch.deadline} remaining · {ch.metric}
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: ch.leading ? '62%' : '38%' }} />
      </div>
      <button className="btn btn-outline btn-sm btn-full" style={{ marginTop: 10 }}
        onClick={() => showToast('Trash talk: "You\'re going down!" 🗣️')}>
        💬 Trash Talk
      </button>
    </div>
  );
}

function CreateChallenge({ onBack, showToast }) {
  const [challengeType, setChallengeType] = useState('');
  const [stakes, setStakes] = useState('');
  const [opponent, setOpponent] = useState(null);

  const types = [
    { id: 'lowest_round', label: 'Lowest single round score', icon: '🏌️' },
    { id: 'lowest_week', label: 'Lowest score this week', icon: '📅' },
    { id: 'most_rounds', label: 'Most rounds this month', icon: '🔄' },
    { id: 'handicap', label: 'Handicap improvement race', icon: '📉' },
    { id: 'fairways', label: 'Most fairways hit', icon: '🎯' },
  ];

  const stakeOptions = ['Loser buys dinner 🍕', '$20 bet 💵', 'Bragging rights 🏆', 'Loser buys beer 🍺'];

  return (
    <div style={{ animation: 'fadeIn 0.2s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button className="icon-btn" onClick={onBack}>←</button>
        <h2 style={{ fontSize: 18, fontWeight: 800 }}>Create Challenge</h2>
      </div>

      <div className="section-label">Challenge Type</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {types.map(t => (
          <button key={t.id}
            onClick={() => setChallengeType(t.id)}
            style={{
              padding: '12px 16px', borderRadius: 'var(--radius)',
              border: `1.5px solid ${challengeType === t.id ? 'var(--green)' : 'var(--gray-200)'}`,
              background: challengeType === t.id ? 'var(--green-bg)' : 'var(--white)',
              textAlign: 'left', fontSize: 14,
              color: challengeType === t.id ? 'var(--green-dark)' : 'var(--gray-700)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
              fontWeight: challengeType === t.id ? 700 : 400,
            }}>
            <span style={{ fontSize: 18 }}>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="section-label">Stakes</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {stakeOptions.map(s => (
          <button key={s}
            onClick={() => setStakes(s)}
            style={{
              padding: '10px 16px', borderRadius: 'var(--radius-sm)',
              border: `1.5px solid ${stakes === s ? 'var(--gold)' : 'var(--gray-200)'}`,
              background: stakes === s ? '#fef3c7' : 'var(--white)',
              textAlign: 'left', fontSize: 14,
              color: stakes === s ? '#92400e' : 'var(--gray-700)',
              cursor: 'pointer', fontWeight: stakes === s ? 700 : 400,
            }}>
            {s}
          </button>
        ))}
        <input className="input" placeholder="Custom stakes..." style={{ marginTop: 4 }} />
      </div>

      <div className="section-label">Challenge Who?</div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {FRIENDS.map(f => (
          <div key={f.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', flexShrink: 0 }}
            onClick={() => setOpponent(f.id)}>
            <div className="avatar avatar-md"
              style={{
                background: f.color + '22', color: f.color,
                border: opponent === f.id ? `3px solid ${f.color}` : '3px solid transparent',
              }}>
              {f.initials}
            </div>
            <span style={{ fontSize: 11, color: 'var(--gray-600)', maxWidth: 50, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {f.name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>

      <button
        className="btn btn-gold btn-full"
        onClick={() => { showToast('Challenge sent! ⚡🔥'); onBack(); }}
        disabled={!challengeType || !stakes}
        style={{ opacity: !challengeType || !stakes ? 0.5 : 1 }}
      >
        <Zap size={16} /> Send Challenge
      </button>
    </div>
  );
}

function TournamentsTab({ showToast }) {
  const tournaments = [
    { id: 1, name: 'Spring Club Championship', date: 'Apr 12', course: 'Pebble Beach', players: 24, status: 'upcoming' },
    { id: 2, name: 'Weekend Warriors Cup', date: 'Apr 5', course: 'Torrey Pines', players: 6, status: 'live' },
    { id: 3, name: 'March Madness Golf', date: 'Mar 28', course: 'Augusta Nat\'l', players: 18, status: 'completed' },
  ];

  return (
    <div>
      <button className="btn btn-primary btn-full" style={{ marginBottom: 20 }}
        onClick={() => showToast('Tournament creator coming soon!')}>
        <Plus size={16} /> Create Tournament
      </button>

      {tournaments.map(t => (
        <div key={t.id} className="card" style={{ marginBottom: 12, cursor: 'pointer' }}
          onClick={() => showToast(`View ${t.name}`)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{t.name}</div>
              <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>📍 {t.course}</div>
            </div>
            <span className={`badge ${t.status === 'live' ? 'badge-red' : t.status === 'upcoming' ? 'badge-blue' : 'badge-gray'}`}>
              {t.status === 'live' ? '🔴 LIVE' : t.status === 'upcoming' ? '📅 Upcoming' : '✅ Done'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>📅 {t.date}</span>
            <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>👥 {t.players} players</span>
          </div>
          {t.status !== 'completed' && (
            <button className="btn btn-secondary btn-sm btn-full" style={{ marginTop: 10 }}
              onClick={(e) => { e.stopPropagation(); showToast('Joined tournament!'); }}>
              Join
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default function CompeteScreen({ showToast }) {
  const [mainTab, setMainTab] = useState('leaderboard');
  const [lbFilter, setLbFilter] = useState('friends');
  const [timeFilter, setTimeFilter] = useState('week');

  return (
    <div className="screen fade-in">
      <div className="header">
        <span className="header-title">Compete</span>
      </div>

      {/* Main tabs */}
      <div style={{ padding: '0 20px 0' }}>
        <div className="pill-tabs">
          <button className={`pill-tab ${mainTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setMainTab('leaderboard')}>
            <Trophy size={12} style={{ display: 'inline', marginRight: 4 }} />Boards
          </button>
          <button className={`pill-tab ${mainTab === 'challenges' ? 'active' : ''}`} onClick={() => setMainTab('challenges')}>
            <Zap size={12} style={{ display: 'inline', marginRight: 4 }} />Challenges
          </button>
          <button className={`pill-tab ${mainTab === 'tournaments' ? 'active' : ''}`} onClick={() => setMainTab('tournaments')}>
            <Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />Events
          </button>
        </div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        {mainTab === 'leaderboard' && (
          <>
            {/* Scope filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto', paddingBottom: 4 }}>
              {['friends', 'school', 'club'].map(f => (
                <button key={f}
                  className={`btn btn-sm ${lbFilter === f ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setLbFilter(f)}
                  style={{ textTransform: 'capitalize', flexShrink: 0 }}>
                  {f === 'friends' ? '👥' : f === 'school' ? '🎓' : '🏌️'} {f}
                </button>
              ))}
            </div>

            {/* Time filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {['week', 'month', 'all'].map(t => (
                <button key={t}
                  onClick={() => setTimeFilter(t)}
                  style={{
                    padding: '6px 12px', borderRadius: 20, border: '1.5px solid',
                    borderColor: timeFilter === t ? 'var(--green)' : 'var(--gray-200)',
                    background: timeFilter === t ? 'var(--green-bg)' : 'var(--white)',
                    color: timeFilter === t ? 'var(--green-dark)' : 'var(--gray-500)',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>
                  {t === 'week' ? 'This Week' : t === 'month' ? 'This Month' : 'All Time'}
                </button>
              ))}
            </div>

            <div className="card" style={{ padding: '8px 0' }}>
              <LeaderboardTab
                data={LEADERBOARD_DATA[lbFilter] || LEADERBOARD_DATA.friends}
                showToast={showToast}
              />
            </div>
          </>
        )}

        {mainTab === 'challenges' && <ChallengesTab showToast={showToast} />}
        {mainTab === 'tournaments' && <TournamentsTab showToast={showToast} />}
      </div>
    </div>
  );
}
