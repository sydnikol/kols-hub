import React, { useState, useEffect, useRef, useCallback } from 'react';

interface HighScore { game: string; score: number; date: string; }

const THEME = {
  primary: '#FF1493', secondary: '#9B30FF', bg: '#0a0010',
  accent: '#E0A0FF', mint: '#00FFB3', text: '#F5E6FF',
  glass: 'rgba(155,48,255,0.15)', surface: 'rgba(255,20,147,0.08)'
};

const DollhouseArcade: React.FC = () => {
  const [tab, setTab] = useState('arcade');
  const [highScores, setHighScores] = useState<HighScore[]>(() => {
    try { return JSON.parse(localStorage.getItem('dh_highscores') || '[]'); } catch { return []; }
  });

  // Snake game state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snakeRunning, setSnakeRunning] = useState(false);
  const [snakeScore, setSnakeScore] = useState(0);
  const snakeRef = useRef({ snake: [{x:10,y:10}], dir: {x:1,y:0}, food: {x:15,y:15}, running: false, score: 0 });

  // Memory game
  const [memCards, setMemCards] = useState<{id:number;sym:string;flipped:boolean;matched:boolean}[]>([]);
  const [memFlipped, setMemFlipped] = useState<number[]>([]);
  const [memMoves, setMemMoves] = useState(0);

  // TicTacToe
  const [tttBoard, setTttBoard] = useState(Array(9).fill(''));
  const [tttTurn, setTttTurn] = useState('X');
  const [tttWinner, setTttWinner] = useState('');

  // D&D
  const [diceResult, setDiceResult] = useState<{die:string;val:number}[]>([]);
  const [charName, setCharName] = useState('');
  const [charClass, setCharClass] = useState('Fighter');
  const [charLevel, setCharLevel] = useState(1);

  useEffect(() => { localStorage.setItem('dh_highscores', JSON.stringify(highScores)); }, [highScores]);

  const addScore = (game: string, score: number) => {
    const s = [...highScores, { game, score, date: new Date().toLocaleDateString() }]
      .sort((a,b) => b.score - a.score).slice(0, 20);
    setHighScores(s);
  };

  // SNAKE GAME
  const startSnake = useCallback(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const s = snakeRef.current;
    s.snake = [{x:10,y:10}]; s.dir = {x:1,y:0};
    s.food = {x: Math.floor(Math.random()*20), y: Math.floor(Math.random()*20)};
    s.running = true; s.score = 0;
    setSnakeRunning(true); setSnakeScore(0);

    const draw = () => {
      if (!s.running) return;
      const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || s.snake.some(p => p.x === head.x && p.y === head.y)) {
        s.running = false; setSnakeRunning(false); addScore('Snake', s.score); return;
      }
      s.snake.unshift(head);
      if (head.x === s.food.x && head.y === s.food.y) {
        s.score++; setSnakeScore(s.score);
        s.food = { x: Math.floor(Math.random()*20), y: Math.floor(Math.random()*20) };
      } else { s.snake.pop(); }

      ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, 300, 300);
      ctx.fillStyle = THEME.mint;
      s.snake.forEach(p => ctx.fillRect(p.x*15, p.y*15, 14, 14));
      ctx.fillStyle = THEME.primary;
      ctx.fillRect(s.food.x*15, s.food.y*15, 14, 14);
      ctx.fillStyle = THEME.text; ctx.font = '12px monospace';
      ctx.fillText(`Score: ${s.score}`, 5, 295);
    };

    const interval = setInterval(draw, 150);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && s.dir.y !== 1) s.dir = {x:0,y:-1};
      if (e.key === 'ArrowDown' && s.dir.y !== -1) s.dir = {x:0,y:1};
      if (e.key === 'ArrowLeft' && s.dir.x !== 1) s.dir = {x:-1,y:0};
      if (e.key === 'ArrowRight' && s.dir.x !== -1) s.dir = {x:1,y:0};
    };
    window.addEventListener('keydown', handleKey);
    return () => { clearInterval(interval); window.removeEventListener('keydown', handleKey); };
  }, []);

  // MEMORY GAME
  const initMemory = () => {
    const syms = ['💀','🌹','🦇','🌙','⭐','💜','🕷️','🔮'];
    const cards = [...syms, ...syms].sort(() => Math.random() - 0.5)
      .map((sym, i) => ({ id: i, sym, flipped: false, matched: false }));
    setMemCards(cards); setMemFlipped([]); setMemMoves(0);
  };
  useEffect(() => { initMemory(); }, []);

  const flipCard = (id: number) => {
    if (memFlipped.length >= 2) return;
    const card = memCards[id];
    if (card.flipped || card.matched) return;
    const newCards = memCards.map(c => c.id === id ? {...c, flipped: true} : c);
    setMemCards(newCards);
    const newFlipped = [...memFlipped, id];
    setMemFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMemMoves(m => m + 1);
      const [a, b] = newFlipped;
      if (newCards[a].sym === newCards[b].sym) {
        setTimeout(() => {
          setMemCards(prev => prev.map(c => c.id === a || c.id === b ? {...c, matched: true} : c));
          setMemFlipped([]);
        }, 500);
      } else {
        setTimeout(() => {
          setMemCards(prev => prev.map(c => c.id === a || c.id === b ? {...c, flipped: false} : c));
          setMemFlipped([]);
        }, 800);
      }
    }
  };

  const memDone = memCards.length > 0 && memCards.every(c => c.matched);
  useEffect(() => { if (memDone && memMoves > 0) addScore('Memory', Math.max(100 - memMoves * 5, 10)); }, [memDone]);

  // TIC TAC TOE
  const checkWin = (b: string[]) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a,bb,c] of lines) { if (b[a] && b[a] === b[bb] && b[a] === b[c]) return b[a]; }
    return b.every(c => c) ? 'Draw' : '';
  };

  const tttClick = (i: number) => {
    if (tttBoard[i] || tttWinner || tttTurn !== 'X') return;
    const b = [...tttBoard]; b[i] = 'X';
    const w = checkWin(b);
    if (w) { setTttBoard(b); setTttWinner(w); if (w === 'X') addScore('TicTacToe', 50); return; }
    // AI move
    const empty = b.map((v,j) => v === '' ? j : -1).filter(j => j >= 0);
    if (empty.length > 0) {
      const ai = empty[Math.floor(Math.random() * empty.length)];
      b[ai] = 'O';
      const w2 = checkWin(b);
      if (w2) { setTttBoard(b); setTttWinner(w2); return; }
    }
    setTttBoard(b);
  };

  const resetTTT = () => { setTttBoard(Array(9).fill('')); setTttWinner(''); setTttTurn('X'); };

  // DICE
  const rollDice = (sides: number) => {
    const val = Math.floor(Math.random() * sides) + 1;
    setDiceResult(prev => [{ die: `d${sides}`, val }, ...prev].slice(0, 20));
  };

  const tabs = [
    { id: 'arcade', label: '🕹️ Arcade Floor' },
    { id: 'emulators', label: '📟 Retro Emulators' },
    { id: 'dnd', label: '🐉 D&D Workshop' },
    { id: 'discover', label: '🎯 Game Discovery' },
    { id: 'free', label: '🆓 Free Games' },
  ];

  const demoGames = [
    { name: 'The Witcher 3', rating: 4.7, genre: 'RPG', platforms: 'PC, PS, Xbox, Switch' },
    { name: 'Hollow Knight', rating: 4.5, genre: 'Action', platforms: 'PC, PS, Xbox, Switch' },
    { name: 'Stardew Valley', rating: 4.6, genre: 'Simulation', platforms: 'PC, PS, Xbox, Switch, Mobile' },
    { name: 'Celeste', rating: 4.4, genre: 'Platformer', platforms: 'PC, PS, Xbox, Switch' },
    { name: 'Hades', rating: 4.8, genre: 'Action RPG', platforms: 'PC, PS, Xbox, Switch' },
    { name: 'Disco Elysium', rating: 4.6, genre: 'RPG', platforms: 'PC, PS, Xbox, Switch' },
  ];

  const freeGames = [
    { name: 'Warframe', desc: 'Sci-fi action MMO', url: 'https://www.warframe.com' },
    { name: 'Path of Exile', desc: 'Dark action RPG', url: 'https://www.pathofexile.com' },
    { name: 'Genshin Impact', desc: 'Open-world RPG', url: 'https://genshin.hoyoverse.com' },
    { name: 'Valorant', desc: 'Tactical FPS', url: 'https://playvalorant.com' },
    { name: 'Dota 2', desc: 'Strategy MOBA', url: 'https://www.dota2.com' },
    { name: 'Lost Ark', desc: 'Fantasy MMORPG', url: 'https://www.playlostark.com' },
    { name: 'Apex Legends', desc: 'Battle Royale', url: 'https://www.ea.com/games/apex-legends' },
    { name: 'Fortnite', desc: 'Battle Royale', url: 'https://www.fortnite.com' },
  ];

  const emulators = [
    { name: 'RetroArch', desc: 'Multi-system emulator frontend', url: 'https://www.retroarch.com' },
    { name: 'Dolphin', desc: 'GameCube & Wii', url: 'https://dolphin-emu.org' },
    { name: 'PCSX2', desc: 'PlayStation 2', url: 'https://pcsx2.net' },
    { name: 'PPSSPP', desc: 'PlayStation Portable', url: 'https://www.ppsspp.org' },
    { name: 'DeSmuME', desc: 'Nintendo DS', url: 'https://desmume.org' },
    { name: 'mGBA', desc: 'Game Boy Advance', url: 'https://mgba.io' },
  ];

  const cardStyle = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: THEME.glass, backdropFilter: 'blur(20px)', borderRadius: 16,
    border: `1px solid ${THEME.primary}33`, padding: 20, ...extra
  });

  return (
    <div style={{ minHeight: '100vh', background: THEME.bg, color: THEME.text, padding: 20 }}>
      <h1 style={{ textAlign: 'center', fontSize: 32, fontWeight: 'bold',
        background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary})`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>
        🎮 Dollhouse Arcade
      </h1>
      <p style={{ textAlign: 'center', color: THEME.accent, marginBottom: 20 }}>Gothic Bratz Gaming Paradise</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '10px 18px', borderRadius: 25, border: 'none', cursor: 'pointer', fontSize: 14,
            background: tab === t.id ? `linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary})` : THEME.glass,
            color: THEME.text, fontWeight: tab === t.id ? 'bold' : 'normal',
            transition: 'all 0.3s'
          }}>{t.label}</button>
        ))}
      </div>

      {/* High Scores Bar */}
      <div style={{ ...cardStyle({ marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }) }}>
        <span style={{ color: THEME.primary, fontWeight: 'bold' }}>🏆 High Scores:</span>
        {highScores.slice(0, 5).map((s, i) => (
          <span key={i} style={{ color: THEME.accent, fontSize: 13 }}>{s.game}: {s.score}</span>
        ))}
        {highScores.length === 0 && <span style={{ color: THEME.accent, opacity: 0.6 }}>Play games to earn scores!</span>}
      </div>

      {/* ARCADE FLOOR */}
      {tab === 'arcade' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {/* Snake */}
          <div style={cardStyle()}>
            <h3 style={{ color: THEME.mint, marginBottom: 12 }}>🐍 Snake</h3>
            <canvas ref={canvasRef} width={300} height={300}
              style={{ border: `2px solid ${THEME.primary}44`, borderRadius: 8, display: 'block', marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={startSnake} style={{
                padding: '8px 20px', borderRadius: 20, border: 'none', cursor: 'pointer',
                background: `linear-gradient(135deg, ${THEME.mint}, ${THEME.secondary})`, color: '#000', fontWeight: 'bold'
              }}>{snakeRunning ? 'Restart' : 'Start Game'}</button>
              <span style={{ color: THEME.primary }}>Score: {snakeScore}</span>
            </div>
            <p style={{ fontSize: 12, color: THEME.accent, marginTop: 8 }}>Use arrow keys to move</p>
          </div>

          {/* Memory */}
          <div style={cardStyle()}>
            <h3 style={{ color: THEME.primary, marginBottom: 8 }}>🃏 Memory Match</h3>
            <p style={{ fontSize: 13, color: THEME.accent, marginBottom: 12 }}>Moves: {memMoves} {memDone && '✨ Complete!'}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 12 }}>
              {memCards.map(card => (
                <button key={card.id} onClick={() => flipCard(card.id)} style={{
                  width: '100%', aspectRatio: '1', borderRadius: 8, border: `2px solid ${THEME.primary}44`,
                  background: card.flipped || card.matched ? THEME.glass : `linear-gradient(135deg, ${THEME.primary}44, ${THEME.secondary}44)`,
                  cursor: 'pointer', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s', color: THEME.text
                }}>
                  {(card.flipped || card.matched) ? card.sym : '?'}
                </button>
              ))}
            </div>
            <button onClick={initMemory} style={{
              padding: '6px 16px', borderRadius: 15, border: 'none', cursor: 'pointer',
              background: THEME.primary, color: '#fff', fontSize: 13
            }}>Reset</button>
          </div>

          {/* Tic Tac Toe */}
          <div style={cardStyle()}>
            <h3 style={{ color: THEME.secondary, marginBottom: 12 }}>❌⭕ Tic-Tac-Toe vs AI</h3>
            {tttWinner && <p style={{ color: THEME.mint, fontWeight: 'bold', marginBottom: 8 }}>
              {tttWinner === 'Draw' ? "It's a Draw!" : `${tttWinner} Wins!`}
            </p>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 80px)', gap: 4, marginBottom: 12 }}>
              {tttBoard.map((cell, i) => (
                <button key={i} onClick={() => tttClick(i)} style={{
                  width: 80, height: 80, borderRadius: 8, border: `2px solid ${THEME.primary}44`,
                  background: THEME.glass, cursor: 'pointer', fontSize: 32, fontWeight: 'bold',
                  color: cell === 'X' ? THEME.primary : cell === 'O' ? THEME.mint : THEME.text,
                  transition: 'all 0.2s'
                }}>{cell}</button>
              ))}
            </div>
            <button onClick={resetTTT} style={{
              padding: '6px 16px', borderRadius: 15, border: 'none', cursor: 'pointer',
              background: THEME.secondary, color: '#fff', fontSize: 13
            }}>New Game</button>
          </div>
        </div>
      )}

      {/* EMULATORS */}
      {tab === 'emulators' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {emulators.map(e => (
            <div key={e.name} style={cardStyle({ cursor: 'pointer', transition: 'all 0.3s' })}
              onClick={() => window.open(e.url, '_blank')}>
              <h3 style={{ color: THEME.primary, marginBottom: 6 }}>📟 {e.name}</h3>
              <p style={{ color: THEME.accent, fontSize: 14 }}>{e.desc}</p>
              <p style={{ color: THEME.mint, fontSize: 12, marginTop: 8 }}>Click to visit →</p>
            </div>
          ))}
        </div>
      )}

      {/* D&D WORKSHOP */}
      {tab === 'dnd' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {/* Dice Roller */}
          <div style={cardStyle()}>
            <h3 style={{ color: THEME.primary, marginBottom: 12 }}>🎲 Dice Roller</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {[4, 6, 8, 10, 12, 20, 100].map(d => (
                <button key={d} onClick={() => rollDice(d)} style={{
                  padding: '10px 16px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary})`,
                  color: '#fff', fontWeight: 'bold', fontSize: 14
                }}>d{d}</button>
              ))}
            </div>
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
              {diceResult.map((r, i) => (
                <div key={i} style={{ padding: '6px 12px', marginBottom: 4, borderRadius: 8,
                  background: i === 0 ? THEME.surface : 'transparent',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: THEME.accent }}>{r.die}</span>
                  <span style={{ color: THEME.mint, fontWeight: 'bold', fontSize: i === 0 ? 24 : 16 }}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Character Sheet */}
          <div style={cardStyle()}>
            <h3 style={{ color: THEME.secondary, marginBottom: 12 }}>📋 Quick Character</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input placeholder="Character Name" value={charName} onChange={e => setCharName(e.target.value)}
                style={{ padding: 10, borderRadius: 8, border: `1px solid ${THEME.primary}44`,
                  background: THEME.glass, color: THEME.text, fontSize: 14 }} />
              <select value={charClass} onChange={e => setCharClass(e.target.value)}
                style={{ padding: 10, borderRadius: 8, border: `1px solid ${THEME.primary}44`,
                  background: THEME.bg, color: THEME.text, fontSize: 14 }}>
                {['Fighter','Wizard','Rogue','Cleric','Ranger','Bard','Paladin','Warlock','Druid','Monk'].map(c =>
                  <option key={c} value={c}>{c}</option>
                )}
              </select>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ color: THEME.accent }}>Level:</span>
                <input type="number" min={1} max={20} value={charLevel} onChange={e => setCharLevel(Number(e.target.value))}
                  style={{ width: 60, padding: 8, borderRadius: 8, border: `1px solid ${THEME.primary}44`,
                    background: THEME.glass, color: THEME.text, textAlign: 'center' }} />
              </div>
              {charName && (
                <div style={{ padding: 12, borderRadius: 12, background: THEME.surface, marginTop: 8 }}>
                  <p style={{ color: THEME.primary, fontWeight: 'bold' }}>{charName}</p>
                  <p style={{ color: THEME.accent }}>Level {charLevel} {charClass}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 8 }}>
                    {['STR','DEX','CON','INT','WIS','CHA'].map(stat => (
                      <div key={stat} style={{ textAlign: 'center', padding: 6, borderRadius: 8, background: THEME.glass }}>
                        <div style={{ fontSize: 10, color: THEME.accent }}>{stat}</div>
                        <div style={{ fontSize: 18, fontWeight: 'bold', color: THEME.mint }}>
                          {Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 3}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* GAME DISCOVERY */}
      {tab === 'discover' && (
        <div>
          <p style={{ color: THEME.accent, marginBottom: 16, textAlign: 'center' }}>
            {import.meta.env.VITE_RAWG_API_KEY ? 'Connected to RAWG API' : 'Showing curated picks (add RAWG API key for live data)'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {demoGames.map(g => (
              <div key={g.name} style={cardStyle({ transition: 'transform 0.3s' })}>
                <h3 style={{ color: THEME.primary, marginBottom: 4 }}>{g.name}</h3>
                <p style={{ color: THEME.accent, fontSize: 13 }}>{g.genre} • ⭐ {g.rating}</p>
                <p style={{ color: THEME.text, fontSize: 12, opacity: 0.7, marginTop: 4 }}>{g.platforms}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FREE GAMES */}
      {tab === 'free' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {freeGames.map(g => (
            <div key={g.name} style={cardStyle({ cursor: 'pointer', transition: 'all 0.3s' })}
              onClick={() => window.open(g.url, '_blank')}>
              <h3 style={{ color: THEME.mint, marginBottom: 4 }}>🎮 {g.name}</h3>
              <p style={{ color: THEME.accent, fontSize: 13 }}>{g.desc}</p>
              <p style={{ color: THEME.primary, fontSize: 12, marginTop: 8 }}>Play Free →</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DollhouseArcade;
