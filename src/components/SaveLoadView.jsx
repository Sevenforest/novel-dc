import React from 'react';

const NUM_SLOTS = 5;

const SaveLoadView = ({ mode, onSave, onLoad, onClose, onReturnTitle, savedData }) => {
    // mode: 'save' or 'load'

    return (
        <div className="h-screen w-screen bg-black/90 text-green-500 font-mono p-4 md:p-12 absolute top-0 left-0 z-50 flex flex-col backdrop-blur-sm">
            <div className="flex justify-between items-center border-b border-green-900 pb-4 mb-8">
                <h2 className="text-2xl md:text-4xl tracking-widest font-bold">
                    {mode === 'save' ? 'SYSTEM_BACKUP' : 'SYSTEM_RESTORE'}
                </h2>
                <div className="flex gap-4">
                    {onReturnTitle && (
                        <button
                            onClick={() => {
                                if (window.confirm("進行状況が失われます。タイトルに戻りますか？")) {
                                    onReturnTitle();
                                }
                            }}
                            className="text-xl px-4 py-2 border border-green-900 text-red-500 hover:bg-red-900/50 hover:border-red-500 transition-colors"
                        >
                            [ RETURN_TO_TITLE ]
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="text-xl px-4 py-2 border border-green-900 hover:bg-green-900/50 transition-colors"
                    >
                        [ CLOSE ]
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-4 custom-scrollbar">
                {Array.from({ length: NUM_SLOTS }).map((_, i) => {
                    const slotId = `slot_${i + 1}`;
                    const data = savedData[slotId];

                    return (
                        <div
                            key={slotId}
                            className={`p-4 border ${data ? 'border-green-700 hover:border-green-400 bg-green-900/10' : 'border-green-900/50 opacity-50'} flex justify-between items-center transition-all cursor-pointer`}
                            onClick={() => {
                                if (mode === 'save') {
                                    onSave(slotId);
                                } else if (mode === 'load' && data) {
                                    onLoad(slotId, data);
                                }
                            }}
                        >
                            <div className="flex flex-col">
                                <span className="text-xl font-bold mb-1">SLOT {i + 1}</span>
                                {data ? (
                                    <span className="text-sm opacity-80">
                                        {data.chapterId} - Index: {data.index} <br />
                                        <span className="text-xs opacity-50">{new Date(data.timestamp).toLocaleString()}</span>
                                    </span>
                                ) : (
                                    <span className="text-sm opacity-50">NO_DATA</span>
                                )}
                            </div>

                            <div className="text-right">
                                {mode === 'save' ? (
                                    <span className="text-sm border border-green-700 px-3 py-1 bg-green-900/20 group-hover:bg-green-700">SAVE</span>
                                ) : (
                                    data && <span className="text-sm border border-green-700 px-3 py-1 bg-green-900/20 group-hover:bg-green-700">LOAD</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SaveLoadView;
