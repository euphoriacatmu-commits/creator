import React from 'react';
import { LayoutTemplate, Wand2, Grid } from 'lucide-react';

interface ToolbarProps {
    onOpenGenerator: () => void;
    onToggleLibrary: () => void;
    onGoHome: () => void;
    isLibraryOpen: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
    onOpenGenerator, 
    onToggleLibrary, 
    onGoHome,
    isLibraryOpen 
}) => {
    return (
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shadow-sm z-20 relative flex-shrink-0">
            {/* Left: Logo */}
            <div 
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={onGoHome}
                title="重置视图"
            >
                <div className="bg-black text-white p-1.5 rounded-lg shadow-md">
                    <LayoutTemplate size={20} />
                </div>
                <h1 className="font-bold text-xl tracking-tight text-gray-800 hidden sm:block">PenScape</h1>
            </div>

            {/* Center: AI Trigger Button */}
            <div className="flex-1 flex justify-center max-w-xl px-4">
                <button
                    onClick={onOpenGenerator}
                    className="group relative flex items-center gap-2 px-6 py-2.5 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-200 rounded-full transition-all text-gray-500 hover:text-purple-700 shadow-sm hover:shadow-md w-full sm:w-auto"
                >
                    <Wand2 size={18} className="group-hover:animate-pulse text-purple-500" />
                    <span className="font-medium text-sm">AI 风格设计师</span>
                    <span className="text-xs text-gray-400 font-normal border-l border-gray-300 pl-2 ml-1">
                         输入文字 或 上传图片
                    </span>
                </button>
            </div>

            {/* Right: Library Toggle */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleLibrary}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isLibraryOpen 
                            ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-inner' 
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm'
                    }`}
                >
                    <Grid size={18} />
                    <span className="hidden sm:inline">风格库</span>
                </button>
            </div>
        </div>
    );
};