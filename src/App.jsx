import React, { useState, useEffect, useRef } from 'react';
import SCENARIO from './data/scenario.json';

// --- タイピングコンポーネント（安定版） ---
const Typewriter = ({ text, speed = 40, onComplete, isForceShow }) => {
  const [displayedText, setDisplayedText] = useState("");
  const timerRef = useRef(null); // タイマーを保持する参照

  useEffect(() => {
    // 1. 全表示フラグが立っている場合
    if (isForceShow) {
      setDisplayedText(text);
      onComplete();
      return;
    }

    // 2. タイピング処理
    let i = 0;
    setDisplayedText(""); // 初期化
    
    // 以前のタイマーがあれば掃除
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      // 安全策：textが存在することを確認
      if (!text) return;
      
      setDisplayedText(text.substring(0, i + 1));
      i++;

      if (i >= text.length) {
        clearInterval(timerRef.current);
        onComplete();
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, isForceShow]); // textかisForceShowが変わったら再始動

  return <span>{displayedText}</span>;
};

function App() {
  const [index, setIndex] = useState(-1);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isForceShow, setIsForceShow] = useState(false);
  const [ending, setEnding] = useState(null);

  const handleInteraction = () => {
    if (index === -1 || ending || SCENARIO[index]?.isChoice) return;

    if (!isTypingComplete) {
      setIsForceShow(true);
    } else {
      setIndex(prev => prev + 1);
      setIsTypingComplete(false);
      setIsForceShow(false);
    }
  };

  return (

      // Appコンポーネントの return 部分
      <div 
        onContextMenu={(e) => e.preventDefault()} // 右クリックを無効化
        onClick={handleInteraction}
        style={{ 
          backgroundColor: '#000', 
          color: '#0f0', 
          height: '100vh', 
          width: '100vw', 
          fontFamily: 'monospace', 
          padding: '40px', 
          cursor: 'pointer', 
          overflow: 'hidden',
    
          // --- ↓ これを追加！ ---
          userSelect: 'none',           // 標準
          WebkitUserSelect: 'none',     // Safari用
          msUserSelect: 'none',         // 旧IE用
          // -----------------------
        }}
      >
    
      {index === -1 && (
        <div style={{ margin: 'auto', textAlign: 'center' }}>
          <h1>DIGITAL COSMOLOGY</h1>
          <button onClick={(e) => { e.stopPropagation(); setIndex(0); }} style={buttonStyle}>
            [ INITIATE SYSTEM BOOT ]
          </button>
        </div>
      )}

      {index >= 0 && !ending && (
        <div key={index}> {/* ← 【重要】keyにindexを渡すことで、行が変わるたびにコンポーネントを新品にする */}
          <div style={{ opacity: 0.5, marginBottom: '10px' }}>{SCENARIO[index].speaker}</div>
          <div style={{ fontSize: '1.8rem', lineHeight: '1.4' }}>
            <Typewriter 
              text={SCENARIO[index].text} 
              onComplete={() => setIsTypingComplete(true)} 
              isForceShow={isForceShow}
            />
          </div>
          
          {isTypingComplete && SCENARIO[index].isChoice && (
            <div style={{ marginTop: '50px', display: 'flex', gap: '20px' }}>
              <button onClick={(e) => { e.stopPropagation(); setEnding('A'); }} style={choiceButtonStyle}>A: 維持</button>
              <button onClick={(e) => { e.stopPropagation(); setEnding('B'); }} style={choiceButtonStyle}>B: ハック</button>
            </div>
          )}
        </div>
      )}

      {ending && (
        <div key="ending">
          <h2>{ending === 'A' ? "END: REPETITION" : "END: UNKNOWN FUTURE"}</h2>
          <button onClick={(e) => { e.stopPropagation(); setIndex(-1); setEnding(null); }} style={buttonStyle}>REBOOT</button>
        </div>
      )}
    </div>
  );
}

const buttonStyle = { backgroundColor: 'transparent', color: '#0f0', border: '1px solid #0f0', padding: '15px 30px', cursor: 'pointer', fontFamily: 'monospace' };
const choiceButtonStyle = { backgroundColor: '#0f0', color: '#000', border: 'none', padding: '20px', cursor: 'pointer', fontWeight: 'bold' };

export default App;