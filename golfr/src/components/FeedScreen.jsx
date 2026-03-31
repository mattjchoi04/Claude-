import { useState } from 'react';
import { Heart, MessageCircle, Zap, MoreHorizontal, Camera } from 'lucide-react';
import { FEED_POSTS, FRIENDS } from '../data';

const STORIES = [
  { id: 'add', isAdd: true },
  { id: 1, initials: 'TB', name: 'Tyler', seen: false, color: '#2d6a4f' },
  { id: 3, initials: 'SL', name: 'Sam', seen: false, color: '#0369a1' },
  { id: 2, initials: 'JM', name: 'Jake', seen: true, color: '#7c3aed' },
  { id: 5, initials: 'AR', name: 'Alex', seen: false, color: '#be185d' },
  { id: 4, initials: 'CP', name: 'Chris', seen: true, color: '#b45309' },
];

function getUser(id) {
  return FRIENDS.find(f => f.id === id);
}

function ScoreVsPar(vsPar) {
  if (vsPar === 'E') return <span className="score-par">E</span>;
  if (vsPar?.startsWith('-')) return <span className="score-birdie">{vsPar}</span>;
  const n = parseInt(vsPar);
  if (n <= -2) return <span className="score-eagle">{vsPar}</span>;
  if (n === 1) return <span className="score-bogey">{vsPar}</span>;
  if (n >= 2) return <span className="score-double">{vsPar}</span>;
  return <span className="score-par">{vsPar}</span>;
}

export default function FeedScreen({ showToast, onNavigate }) {
  const [posts, setPosts] = useState(FEED_POSTS);
  const [storyViewed, setStoryViewed] = useState({});

  function toggleLike(id) {
    setPosts(posts.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  }

  function toggleChallenge(post) {
    setPosts(posts.map(p =>
      p.id === post.id ? { ...p, challenged: !p.challenged } : p
    ));
    const user = getUser(post.userId);
    if (!post.challenged) showToast(`Challenge sent to ${user?.name}! ⚡`);
  }

  function addReaction(postId, emoji) {
    setPosts(posts.map(p => {
      if (p.id !== postId) return p;
      const reactions = { ...p.reactions };
      reactions[emoji] = (reactions[emoji] || 0) + 1;
      return { ...p, reactions };
    }));
    showToast(`Reacted with ${emoji}`);
  }

  function viewStory(s) {
    if (s.isAdd) { showToast('Story posted! 📸'); return; }
    setStoryViewed(prev => ({ ...prev, [s.id]: true }));
    const user = getUser(s.id);
    showToast(`Viewing ${user?.name || s.name}'s story`);
  }

  return (
    <div className="screen fade-in">
      {/* Header */}
      <div className="header">
        <span className="header-logo">Golfr⛳</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="icon-btn" onClick={() => onNavigate('messages')}>
            <MessageCircle size={18} />
          </button>
          <button className="icon-btn" onClick={() => showToast('Notifications')}>
            <div className="relative">
              <span style={{ fontSize: 18 }}>🔔</span>
              <div className="notif-dot" />
            </div>
          </button>
        </div>
      </div>

      {/* Stories */}
      <div className="stories-bar">
        {STORIES.map(s => (
          <div key={s.id} className="story-item" onClick={() => viewStory(s)}>
            {s.isAdd ? (
              <>
                <div style={{
                  width: 62, height: 62, borderRadius: '50%',
                  background: 'var(--gray-100)', border: '2px dashed var(--gray-300)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--green)', fontSize: 24
                }}>+</div>
                <span className="story-name">Add</span>
              </>
            ) : (
              <>
                <div className={`story-ring ${storyViewed[s.id] ? 'seen' : ''}`}>
                  <div className="story-avatar" style={{ background: s.color + '22', color: s.color }}>
                    {s.initials}
                  </div>
                </div>
                <span className="story-name">{s.name}</span>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="divider" style={{ margin: 0 }} />

      {/* Post composer */}
      <div style={{ padding: '12px 20px', display: 'flex', gap: 10, alignItems: 'center', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="avatar avatar-sm" style={{ background: 'var(--green-bg)', color: 'var(--green-dark)' }}>YO</div>
        <div
          style={{
            flex: 1, background: 'var(--gray-100)', borderRadius: 20, padding: '10px 16px',
            fontSize: 14, color: 'var(--gray-400)', cursor: 'pointer'
          }}
          onClick={() => showToast('Post composer coming soon!')}
        >
          Share a round or swing...
        </div>
        <button className="icon-btn" onClick={() => showToast('Photo upload!')}>
          <Camera size={18} />
        </button>
      </div>

      {/* Posts */}
      {posts.map(post => {
        const user = getUser(post.userId);
        return (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div
                className="avatar avatar-md"
                style={{ background: user?.color + '22', color: user?.color, cursor: 'pointer' }}
                onClick={() => showToast(`View ${user?.name}'s profile`)}
              >
                {user?.initials}
              </div>
              <div className="post-meta">
                <div className="post-username">{user?.name}</div>
                <div className="post-time">{user?.username} · {post.time}</div>
              </div>
              <button className="icon-btn" onClick={() => showToast('More options')}>
                <MoreHorizontal size={16} />
              </button>
            </div>

            {post.caption && (
              <p style={{ fontSize: 14, color: 'var(--gray-700)', marginBottom: 10, lineHeight: 1.5 }}>
                {post.caption}
              </p>
            )}

            {post.type === 'round' && (
              <div className="scorecard-preview">
                <div className="scorecard-course">📍 {post.course}</div>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span className="scorecard-score">{post.score}</span>
                  <span className="scorecard-vs-par">{post.vsPar}</span>
                </div>
                <div className="scorecard-stats">
                  <div className="scorecard-stat">
                    <span className="scorecard-stat-val">{post.stats.fairways}</span>
                    <span className="scorecard-stat-lbl">Fairways</span>
                  </div>
                  <div className="scorecard-stat">
                    <span className="scorecard-stat-val">{post.stats.gir}</span>
                    <span className="scorecard-stat-lbl">GIR</span>
                  </div>
                  <div className="scorecard-stat">
                    <span className="scorecard-stat-val">{post.stats.putts}</span>
                    <span className="scorecard-stat-lbl">Putts</span>
                  </div>
                </div>
              </div>
            )}

            {post.type === 'photo' && (
              <div style={{
                background: 'var(--gray-100)', borderRadius: 'var(--radius)',
                height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 64, marginBottom: 12, cursor: 'pointer'
              }} onClick={() => showToast('View full photo')}>
                {post.image}
              </div>
            )}

            {/* Emoji reactions */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
              {Object.entries(post.reactions).map(([emoji, count]) => (
                <button key={emoji} className="emoji-reaction-btn" onClick={() => addReaction(post.id, emoji)}>
                  {emoji} <span>{count}</span>
                </button>
              ))}
            </div>

            <div className="post-actions">
              <button
                className={`react-btn ${post.liked ? 'liked' : ''}`}
                onClick={() => toggleLike(post.id)}
              >
                <Heart size={14} fill={post.liked ? 'currentColor' : 'none'} />
                {post.likes}
              </button>
              <button className="react-btn" onClick={() => showToast('Comments')}>
                <MessageCircle size={14} />
                {post.comments}
              </button>
              {post.type === 'round' && (
                <button
                  className={`react-btn ${post.challenged ? 'challenged' : ''}`}
                  onClick={() => toggleChallenge(post)}
                  style={{ marginLeft: 'auto' }}
                >
                  <Zap size={14} />
                  {post.challenged ? 'Challenged!' : 'Challenge'}
                </button>
              )}
            </div>
          </div>
        );
      })}

      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--gray-400)', fontSize: 13 }}>
        You're all caught up 🏌️
      </div>
    </div>
  );
}
