import React from 'react';

const TitleView = ({ onNewGame, onOpenLoad, hasSave }) => {
  return (
    <div className="h-screen w-screen bg-black text-green-500 font-mono flex flex-col items-center justify-center p-4">
      <div className="border border-green-900 p-12 text-center relative">
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-green-500"></div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-green-500"></div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-[0.3em] mb-4 animate-pulse">
          DIGITAL COSMOLOGY
        </h1>
        <p className="text-[10px] opacity-50 mb-12 uppercase">Universe OS // Deployment Phase</p>

        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={onNewGame}
            className="group relative px-8 py-3 bg-green-900/20 border border-green-500 hover:bg-green-500 hover:text-black transition-all duration-300 w-64"
          >
            <span className="relative z-10 font-bold">[ INITIATE NEW BOOT ]</span>
          </button>

          {hasSave && (
            <button
              onClick={onOpenLoad}
              className="px-8 py-3 border border-green-700 text-green-700 hover:border-green-400 hover:text-green-400 transition-all w-64 text-sm"
            >
              [ RESUME SESSION ]
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TitleView;