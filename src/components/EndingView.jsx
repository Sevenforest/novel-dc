import React from 'react';

const EndingView = ({ onReboot }) => {
  return (
    <div className="h-screen w-screen bg-black text-green-500 font-mono flex flex-col items-center justify-center text-center p-10">
      <h2 className="text-3xl mb-8 italic text-white">「観測は終了しました」</h2>
      <div className="max-w-md text-sm opacity-60 leading-loose mb-12">
        宇宙の演算は一時停止されました。<br />
        すべてのログはアーカイブされ、次の起動を待機しています。
      </div>
      <button 
        onClick={onReboot}
        className="text-green-500 border-b border-green-500 hover:text-white transition-colors"
      >
        RETURN_TO_CONSCIOUSNESS
      </button>
    </div>
  );
};

export default EndingView;