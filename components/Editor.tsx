import React from 'react';

interface EditorProps {
    value: string;
    onChange: (val: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
    return (
        <div className="h-full w-full bg-[#1e1e1e] flex flex-col">
            <div className="px-4 py-2 bg-[#2d2d2d] text-xs text-gray-400 font-mono border-b border-[#333]">
                MARKDOWN INPUT
            </div>
            <textarea
                className="flex-1 w-full bg-[#1e1e1e] text-gray-300 p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                spellCheck={false}
                placeholder="# 开始写作..."
            />
        </div>
    );
};
