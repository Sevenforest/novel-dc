import React, { useState, useEffect } from 'react';
import TitleView from './components/TitleView';
import GameView from './components/GameView';
import EndingView from './components/EndingView';
import SaveLoadView from './components/SaveLoadView';
import { CHAPTERS, INITIAL_CHAPTER } from './data/chapters';

const SAVE_KEY_PREFIX = "DIGITAL_COSMOLOGY_SAVE_v2_";

function App() {
  // --- State Management ---
  const [gameState, setGameState] = useState('title'); // title, playing, ending
  const [currentChapterId, setCurrentChapterId] = useState(INITIAL_CHAPTER);
  const [index, setIndex] = useState(0);

  // Save/Load Modal
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const [saveLoadMode, setSaveLoadMode] = useState('load'); // 'save' or 'load'
  const [savedData, setSavedData] = useState({});

  // Noise glitch state
  const [isGlitching, setIsGlitching] = useState(false);

  // Load available save data into memory
  useEffect(() => {
    refreshSavedData();
  }, [showSaveLoad]);

  const refreshSavedData = () => {
    const data = {};
    for (let i = 1; i <= 5; i++) {
      const saved = localStorage.getItem(`${SAVE_KEY_PREFIX}slot_${i}`);
      if (saved) {
        try {
          data[`slot_${i}`] = JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse save data for slot", i);
        }
      }
    }
    setSavedData(data);
  };

  const hasAnySave = Object.keys(savedData).length > 0;

  // --- Actions ---
  const triggerGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 300);
  };

  const startGame = (chapId = INITIAL_CHAPTER, idx = 0) => {
    setCurrentChapterId(chapId);
    setIndex(idx);
    setGameState('playing');
  };

  const handleNext = () => {
    const chapterData = CHAPTERS[currentChapterId];
    if (!chapterData) {
      console.error("Chapter not found:", currentChapterId);
      setGameState('ending');
      return;
    }

    const currentLine = chapterData[index];

    if (currentLine.triggerAction) {
      handleAction(currentLine);
      const exitActions = ['go_to_ending', 'go_to_title'];
      if (exitActions.includes(currentLine.triggerAction)) {
        return;
      }
    }

    if (index < chapterData.length - 1) {
      setIndex(index + 1);
    } else if (currentLine.nextChapter) {
      startGame(currentLine.nextChapter, 0);
    } else {
      setGameState('ending');
    }
  };

  const handleAction = (actionData) => {
    if (actionData.triggerAction === 'go_to_ending') {
      setIndex(0);
      setGameState('ending');
    } else if (actionData.triggerAction === 'go_to_title') {
      setIndex(0);
      setGameState('title');
    }
    else if (actionData.nextChapter) {
      startGame(actionData.nextChapter, 0);
    }
  };

  const handleSave = (slotId) => {
    const data = {
      chapterId: currentChapterId,
      index: index,
      timestamp: Date.now()
    };
    localStorage.setItem(`${SAVE_KEY_PREFIX}${slotId}`, JSON.stringify(data));
    triggerGlitch();
    refreshSavedData();
    setShowSaveLoad(false);
  };

  const handleLoad = (slotId, data) => {
    triggerGlitch();
    startGame(data.chapterId, data.index);
    setShowSaveLoad(false);
  };

  // --- Render ---
  return (
    <div className={`relative min-h-screen bg-black overflow-hidden select-none ${isGlitching ? 'animate-glitch' : ''}`}
      onContextMenu={(e) => e.preventDefault()}>

      {gameState === 'title' && (
        <TitleView
          onNewGame={() => startGame(INITIAL_CHAPTER, 0)}
          onOpenLoad={() => {
            refreshSavedData();
            setSaveLoadMode('load');
            setShowSaveLoad(true);
          }}
          hasSave={hasAnySave}
        />
      )}

      {gameState === 'playing' && (
        <>
          {/* MENU BUTTON */}
          <button
            onClick={() => {
              setSaveLoadMode('save');
              setShowSaveLoad(true);
            }}
            className="absolute top-4 right-4 z-40 text-xs px-4 py-2 border border-green-900 text-green-500 bg-black/80 hover:bg-green-900/50 backdrop-blur"
          >
            [ SYSTEM MENU ]
          </button>

          <GameView
            data={CHAPTERS[currentChapterId]}
            index={index}
            onNext={handleNext}
            onAction={handleAction}
          />
        </>
      )}

      {gameState === 'ending' && (
        <EndingView onReboot={() => setGameState('title')} />
      )}

      {showSaveLoad && (
        <SaveLoadView
          mode={saveLoadMode}
          savedData={savedData}
          onSave={handleSave}
          onLoad={handleLoad}
          onClose={() => setShowSaveLoad(false)}
          onReturnTitle={() => {
            setShowSaveLoad(false);
            setGameState('title');
          }}
        />
      )}
    </div>
  );
}

export default App;