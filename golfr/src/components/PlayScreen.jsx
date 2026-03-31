import { useState } from 'react';
import { ChevronLeft, ChevronRight, Flag, CheckCircle } from 'lucide-react';
import { HOLE_DATA, COURSES } from '../data';

const STEPS = { SELECT_COURSE: 0, SETUP: 1, SCORING: 2, SUMMARY: 3 };

function getScoreLabel(score, par) {
  const d = score - par;
  if (d <= -2) return { label: 'Eagle 🦅', cls: 'score-eagle' };
  if (d === -1) return { label: 'Birdie 🐦', cls: 'score-birdie' };
  if (d === 0) return { label: 'Par', cls: 'score-par' };
  if (d === 1) return { label: 'Bogey', cls: 'score-bogey' };
  if (d === 2) return { label: 'Double', cls: 'score-double' };
  return { label: `+${d}`, cls: 'score-double' };
}

export default function PlayScreen({ showToast, onPostRound }) {
  const [step, setStep] = useState(STEPS.SELECT_COURSE);
  const [course, setCourse] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [currentHole, setCurrentHole] = useState(0);
  const [holeData, setHoleData] = useState(
    HOLE_DATA.map(h => ({ ...h, score: h.par, fairway: null, gir: null, putts: 2 }))
  );
  const [roundPosted, setRoundPosted] = useState(false);

  const filteredCourses = COURSES.filter(c => c.toLowerCase().includes(courseSearch.toLowerCase()));
  const hole = holeData[currentHole];
  const scoreInfo = getScoreLabel(hole.score, hole.par);
  const totalScore = holeData.reduce((sum, h) => sum + h.score, 0);
  const totalPar = HOLE_DATA.reduce((sum, h) => sum + h.par, 0);
  const vsPar = totalScore - totalPar;
  const vsParStr = vsPar === 0 ? 'E' : vsPar > 0 ? `+${vsPar}` : `${vsPar}`;

  function updateHole(field, val) {
    setHoleData(prev => prev.map((h, i) => i === currentHole ? { ...h, [field]: val } : h));
  }

  function goNext() {
    if (currentHole < 17) setCurrentHole(h => h + 1);
    else setStep(STEPS.SUMMARY);
  }

  function goPrev() {
    if (currentHole > 0) setCurrentHole(h => h - 1);
  }

  function postRound() {
    setRoundPosted(true);
    showToast('Round posted to your feed! 🏌️');
    setTimeout(() => {
      setStep(STEPS.SELECT_COURSE);
      setCurrentHole(0);
      setRoundPosted(false);
      setHoleData(HOLE_DATA.map(h => ({ ...h, score: h.par, fairway: null, gir: null, putts: 2 })));
      setCourse('');
      if (onPostRound) onPostRound({ course, score: totalScore, vsPar: vsParStr });
    }, 1200);
  }

  // Step 0: Course select
  if (step === STEPS.SELECT_COURSE) {
    return (
      <div className="screen fade-in">
        <div className="header">
          <span className="header-title">Start a Round</span>
        </div>
        <div style={{ padding: 20 }}>
          <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 16 }}>
            Where are you playing today?
          </p>
          <input
            className="input"
            placeholder="Search course..."
            value={courseSearch}
            onChange={e => setCourseSearch(e.target.value)}
            autoFocus
          />
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredCourses.map(c => (
              <button
                key={c}
                onClick={() => { setCourse(c); setStep(STEPS.SETUP); }}
                style={{
                  padding: '14px 16px', borderRadius: 'var(--radius)',
                  border: '1.5px solid var(--gray-200)', background: 'var(--white)',
                  textAlign: 'left', fontSize: 15, color: 'var(--gray-800)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}
              >
                <span style={{ fontSize: 20 }}>📍</span>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Setup
  if (step === STEPS.SETUP) {
    return (
      <div className="screen fade-in">
        <div className="header">
          <button className="icon-btn" onClick={() => setStep(STEPS.SELECT_COURSE)}>
            <ChevronLeft size={20} />
          </button>
          <span className="header-title">Round Setup</span>
          <div style={{ width: 38 }} />
        </div>
        <div style={{ padding: 20 }}>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 4 }}>Playing at</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)' }}>📍 {course}</div>
          </div>

          <div className="section-label">Format</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {['Stroke Play', 'Match Play', 'Skins', 'Stableford'].map(fmt => (
              <button
                key={fmt}
                onClick={() => showToast(`Format: ${fmt}`)}
                className="btn btn-outline"
                style={{ fontSize: 14 }}
              >
                {fmt}
              </button>
            ))}
          </div>

          <div className="section-label">Playing Partners</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            {['TB', 'JM', 'SL'].map((init, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div className="avatar avatar-md" style={{ background: 'var(--green-bg)', color: 'var(--green-dark)', cursor: 'pointer' }}
                  onClick={() => showToast('Partner added!')}>
                  {init}
                </div>
                <span style={{ fontSize: 11, color: 'var(--gray-500)' }}>+Add</span>
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <button
                className="avatar avatar-md"
                style={{ background: 'var(--gray-100)', color: 'var(--gray-400)', border: '2px dashed var(--gray-300)', cursor: 'pointer', fontSize: 20 }}
                onClick={() => showToast('Invite a friend')}
              >+</button>
              <span style={{ fontSize: 11, color: 'var(--gray-500)' }}>Invite</span>
            </div>
          </div>

          <button className="btn btn-primary btn-full" onClick={() => setStep(STEPS.SCORING)}>
            <Flag size={16} /> Start Round
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Scoring
  if (step === STEPS.SCORING) {
    return (
      <div className="screen fade-in">
        <div className="header">
          <button className="icon-btn" onClick={() => setStep(STEPS.SETUP)}>
            <ChevronLeft size={20} />
          </button>
          <div>
            <div style={{ fontSize: 13, color: 'var(--gray-500)', textAlign: 'center' }}>{course}</div>
            <div style={{ fontSize: 15, fontWeight: 800, textAlign: 'center', color: 'var(--gray-900)' }}>
              {vsParStr === 'E' ? 'Even' : vsParStr} · {currentHole + 1}/18
            </div>
          </div>
          <button className="btn btn-sm btn-secondary" onClick={() => setStep(STEPS.SUMMARY)}>
            Finish
          </button>
        </div>

        {/* Hole progress bar */}
        <div style={{ padding: '0 20px 16px' }}>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-fill" style={{ width: `${((currentHole + 1) / 18) * 100}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>Hole 1</span>
            <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>Hole 18</span>
          </div>
        </div>

        <div style={{ padding: '0 20px' }}>
          {/* Hole info */}
          <div className="card" style={{ marginBottom: 16, background: 'linear-gradient(135deg, var(--green-dark), var(--green))', color: 'white', border: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>Hole {hole.hole}</div>
                <div style={{ fontSize: 28, fontWeight: 900 }}>Par {hole.par}</div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>{hole.yards} yards</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, opacity: 0.7 }}>Your score</div>
                <div style={{ fontSize: 40, fontWeight: 900 }}>{hole.score}</div>
                <div style={{ fontSize: 13, opacity: 0.9 }} className={scoreInfo.cls}>{scoreInfo.label}</div>
              </div>
            </div>
          </div>

          {/* Score stepper */}
          <div className="score-input-row">
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-700)' }}>Score</span>
            <div className="score-stepper">
              <button className="stepper-btn" onClick={() => updateHole('score', Math.max(1, hole.score - 1))}>−</button>
              <span className="stepper-val">{hole.score}</span>
              <button className="stepper-btn" onClick={() => updateHole('score', hole.score + 1)}>+</button>
            </div>
          </div>

          {/* Fairway (par 4/5 only) */}
          {hole.par !== 3 && (
            <div className="score-input-row">
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-700)' }}>Fairway</span>
              <div className="toggle-group">
                <button className={`toggle-btn ${hole.fairway === true ? 'active-yes' : ''}`}
                  onClick={() => updateHole('fairway', true)}>Hit ✓</button>
                <button className={`toggle-btn ${hole.fairway === false ? 'active-no' : ''}`}
                  onClick={() => updateHole('fairway', false)}>Miss ✗</button>
              </div>
            </div>
          )}

          {/* GIR */}
          <div className="score-input-row">
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-700)' }}>GIR</span>
            <div className="toggle-group">
              <button className={`toggle-btn ${hole.gir === true ? 'active-yes' : ''}`}
                onClick={() => updateHole('gir', true)}>Hit ✓</button>
              <button className={`toggle-btn ${hole.gir === false ? 'active-no' : ''}`}
                onClick={() => updateHole('gir', false)}>Miss ✗</button>
            </div>
          </div>

          {/* Putts */}
          <div className="score-input-row">
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-700)' }}>Putts</span>
            <div className="score-stepper">
              <button className="stepper-btn" onClick={() => updateHole('putts', Math.max(0, hole.putts - 1))}>−</button>
              <span className="stepper-val">{hole.putts}</span>
              <button className="stepper-btn" onClick={() => updateHole('putts', hole.putts + 1)}>+</button>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button className="btn btn-outline" onClick={goPrev} disabled={currentHole === 0}
              style={{ flex: 1, opacity: currentHole === 0 ? 0.4 : 1 }}>
              <ChevronLeft size={16} /> Prev
            </button>
            <button className="btn btn-primary" onClick={goNext} style={{ flex: 2 }}>
              {currentHole < 17 ? <>Next <ChevronRight size={16} /></> : <><CheckCircle size={16} /> Finish</>}
            </button>
          </div>

          {/* Mini scorecard */}
          <div style={{ marginTop: 20, marginBottom: 16 }}>
            <div className="section-label">Scorecard</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    {['Hole','Par','Score'].map(h => (
                      <th key={h} style={{ padding: '4px 6px', color: 'var(--gray-400)', fontWeight: 600, textAlign: 'center', borderBottom: '1px solid var(--gray-100)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {holeData.slice(0, currentHole + 1).map((h, i) => {
                    const d = h.score - h.par;
                    let cls = 'score-par';
                    if (d <= -2) cls = 'score-eagle';
                    else if (d === -1) cls = 'score-birdie';
                    else if (d === 1) cls = 'score-bogey';
                    else if (d >= 2) cls = 'score-double';
                    return (
                      <tr key={i} style={{ background: i === currentHole ? 'var(--green-bg)' : '' }}>
                        <td style={{ padding: '4px 6px', textAlign: 'center', color: 'var(--gray-600)', fontWeight: i === currentHole ? 700 : 400 }}>{h.hole}</td>
                        <td style={{ padding: '4px 6px', textAlign: 'center', color: 'var(--gray-600)' }}>{h.par}</td>
                        <td style={{ padding: '4px 6px', textAlign: 'center' }} className={cls}>{h.score}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Summary
  return (
    <div className="screen fade-in">
      <div className="header">
        <button className="icon-btn" onClick={() => { setStep(STEPS.SCORING); setCurrentHole(17); }}>
          <ChevronLeft size={20} />
        </button>
        <span className="header-title">Round Complete!</span>
        <div style={{ width: 38 }} />
      </div>
      <div style={{ padding: 20 }}>
        {/* Big score card */}
        <div className="scorecard-preview" style={{ marginBottom: 16 }}>
          <div className="scorecard-course">📍 {course}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span className="scorecard-score">{totalScore}</span>
            <span className="scorecard-vs-par">{vsParStr}</span>
          </div>
          <div className="scorecard-stats">
            <div className="scorecard-stat">
              <span className="scorecard-stat-val">
                {Math.round(holeData.filter(h => h.fairway === true).length / holeData.filter(h => h.par !== 3).length * 100) || 0}%
              </span>
              <span className="scorecard-stat-lbl">Fairways</span>
            </div>
            <div className="scorecard-stat">
              <span className="scorecard-stat-val">
                {Math.round(holeData.filter(h => h.gir === true).length / 18 * 100) || 0}%
              </span>
              <span className="scorecard-stat-lbl">GIR</span>
            </div>
            <div className="scorecard-stat">
              <span className="scorecard-stat-val">{holeData.reduce((s, h) => s + h.putts, 0)}</span>
              <span className="scorecard-stat-lbl">Putts</span>
            </div>
          </div>
        </div>

        {/* Hole breakdown */}
        <div className="section-label">Hole by Hole</div>
        <div className="card" style={{ marginBottom: 16, padding: '8px 12px' }}>
          {holeData.map((h) => {
            const d = h.score - h.par;
            let cls = 'score-par';
            if (d <= -2) cls = 'score-eagle';
            else if (d === -1) cls = 'score-birdie';
            else if (d === 1) cls = 'score-bogey';
            else if (d >= 2) cls = 'score-double';
            return (
              <div key={h.hole} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: h.hole < 18 ? '1px solid var(--gray-100)' : 'none' }}>
                <span style={{ fontSize: 13, color: 'var(--gray-500)', width: 52 }}>Hole {h.hole}</span>
                <span style={{ fontSize: 13, color: 'var(--gray-400)' }}>Par {h.par}</span>
                <span className={cls} style={{ fontSize: 15 }}>{h.score}</span>
                <span style={{ fontSize: 11, color: 'var(--gray-400)', width: 40, textAlign: 'right' }}>{d === 0 ? 'E' : d > 0 ? `+${d}` : d}</span>
              </div>
            );
          })}
        </div>

        {roundPosted ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: 48 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-dark)', marginTop: 8 }}>Posted to feed!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn btn-primary btn-full" onClick={postRound}>
              📤 Post to Feed
            </button>
            <button className="btn btn-gold btn-full" onClick={() => showToast('Challenge sent! ⚡')}>
              ⚡ Challenge a Friend to Beat This
            </button>
            <button className="btn btn-outline btn-full" onClick={() => { setStep(STEPS.SELECT_COURSE); setCurrentHole(0); setHoleData(HOLE_DATA.map(h => ({ ...h, score: h.par, fairway: null, gir: null, putts: 2 }))); setCourse(''); }}>
              Discard Round
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
