import React, { useState, useEffect, useRef } from 'react';
import { CHARACTERS } from '../data/characters';

// 内部用Typewriter
const Typewriter = ({ text, speed = 30, onComplete, isForceShow }) => {
  const [displayedText, setDisplayedText] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    if (isForceShow) {
      setDisplayedText(text);
      onComplete();
      return;
    }
    let i = 0;
    setDisplayedText("");
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(timerRef.current);
        onComplete();
      }
    }, speed);
    return () => clearInterval(timerRef.current);
  }, [text, isForceShow]);

  return <span>{displayedText}</span>;
};

const GameView = ({ data, index, onNext, onAction }) => {
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isForceShow, setIsForceShow] = useState(false);

  const line = data[index];
  const charData = CHARACTERS[line.speaker] || CHARACTERS["SYSTEM"];
  // 【例】JSONに "glitch": true と書かれているか、鈴木の発言の時に揺らす
  //const shouldGlitch = line.glitch || line.speaker === "鈴木";
  const shouldGlitch = line.glitch

  // 行が変わったらタイピング状態をリセット
  useEffect(() => {
    setIsTypingComplete(false);
    setIsForceShow(false);
  }, [index, data]);

  const handleContainerClick = () => {
    if (line.isChoice) return;
    if (!isTypingComplete) {
      setIsForceShow(true);
    } else {
      onNext();
    }
  };

  return (
    <div onClick={handleContainerClick} className="h-screen w-screen bg-black text-green-400 font-mono p-6 md:p-12 flex flex-col cursor-pointer overflow-hidden select-none">
      {/* ヘッダー */}
      <div className="flex justify-between text-[10px] border-b border-green-900/50 pb-2 mb-8 opacity-50">
        <div>CONNECTING...</div>
        <div>IDX: {index.toString().padStart(4, '0')}</div>
      </div>

      {/* --- メインコンテンツ（横並びレイアウトに変更）--- */}
      <div className="flex-1 flex gap-8 max-w-5xl mx-auto w-full items-start">

        {/* 【追加】サイバーアバター表示エリア */}
        {line.speaker !== "SYSTEM" && ( // SYSTEM以外の時だけ表示
          <div className="shrink-0 mt-2 hidden md:block"> {/* スマホでは隠す例 */}
            <div className={`w-24 h-24 rounded-full border-2 flex items-center justify-center bg-black/50 backdrop-blur shadow-[0_0_15px_currentColor] overflow-hidden ${charData.colorClass}`}>
              {charData.avatarSrc ? (
                <img src={charData.avatarSrc} alt={charData.initial} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold">{charData.initial}</span>
              )}
            </div>
            {/* 下部のスキャンライン装飾 */}
            <div className={`w-24 h-1 mt-2 bg-current opacity-50 animate-pulse ${charData.colorClass}`}></div>
          </div>
        )}

        {/* テキストエリア */}
        <div className="flex-1">
          <div className={`text-xs mb-2 uppercase tracking-tighter font-bold ${charData.colorClass}`}>
            {charData.displayName}
          </div>
          {/* 本文エリア：条件に応じて animate-text-glitch を付与 */}
          <div
            key={index} // 行が変わるたびにアニメーションを再実行させるために key を指定
            className={`text-xl md:text-3xl leading-relaxed min-h-32 whitespace-pre-wrap ${shouldGlitch ? 'animate-text-glitch' : ''
              }`}
          >
            <Typewriter
              text={line.text}
              onComplete={() => setIsTypingComplete(true)}
              isForceShow={isForceShow}
            />
          </div>

          {/* 選択肢表示 */}
          {isTypingComplete && line.isChoice && (
            <div className="mt-12 flex flex-col gap-3 animate-in fade-in duration-500">
              {line.choices.map((c, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction(c);
                  }}
                  className={`
                    text-left border p-4 transition-all duration-300
                    hover:text-black  /* 文字は黒に */
                    ${charData.colorClass} 
                    ${charData.hoverBgClass}
                  `}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* --- メインコンテンツ終了 --- */}

      <div className="text-[10px] opacity-30 text-right">
        {isTypingComplete && !line.isChoice && ">> AWAITING_INPUT"}
      </div>
    </div>
  );
};

export default GameView;