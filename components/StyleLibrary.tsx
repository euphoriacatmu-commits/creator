import React from 'react';
import { Theme } from '../types';
import { Check, X, Palette, Pin, PinOff, Trash2 } from 'lucide-react';

interface StyleLibraryProps {
    themes: Theme[];
    currentTheme: Theme;
    onSelect: (theme: Theme) => void;
    onClose: () => void;
    onTogglePin: (e: React.MouseEvent, id: string) => void;
    onDelete: (e: React.MouseEvent, id: string) => void;
}

const renderPreview = (theme: Theme) => {
    const cardStyle = {
        ...theme.container,
        width: '100%',
        height: '100%',
        padding: '16px',
        overflow: 'hidden',
        position: 'relative' as const,
        fontSize: '10px',
        borderRadius: '0',
        border: 'none',
        display: 'flex',
        flexDirection: 'column' as const,
    };

    return (
        <div style={cardStyle as any}>
            <div style={{...theme.h1 as any, marginTop: '0', marginBottom: '8px', fontSize: '16px' }}>PenScape</div>
            <div style={{...theme.h2 as any, marginTop: '4px', fontSize: '12px' }}>排版风格预览</div>
            <p style={{...theme.p as any, margin: '8px 0', fontSize: '10px', flex: 1 }}>
                这是一段示例文本。用于展示当前主题的段落间距、字体颜色以及行高设置。
            </p>
            <div style={{...theme.blockquote as any, margin: '4px 0', padding: '8px', fontSize: '9px' }}>
                引用样式的展示效果。
            </div>
        </div>
    );
};

interface ThemeCardProps {
    theme: Theme;
    isActive: boolean;
    onSelect: (theme: Theme) => void;
    onTogglePin: (e: React.MouseEvent, id: string) => void;
    onDelete: (e: React.MouseEvent, id: string) => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, isActive, onSelect, onTogglePin, onDelete }) => (
    <div 
        onClick={() => onSelect(theme)}
        className={`group relative flex flex-col w-full bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border hover:-translate-y-1 ${
            isActive 
                ? 'border-purple-600 ring-2 ring-purple-100 shadow-xl' 
                : 'border-gray-200 hover:border-purple-300 hover:shadow-lg'
        }`}
    >
        <div className="aspect-[4/5] w-full bg-gray-50 overflow-hidden relative border-b border-gray-100">
            <div className="absolute inset-0 w-full h-full pointer-events-none select-none origin-top transform scale-[0.8] sm:scale-100">
                {renderPreview(theme)}
            </div>
            
            <div className={`absolute inset-0 transition-colors flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-black/5 z-10`}>
                <div className="absolute top-2 right-2 flex gap-2 z-50">
                    <div
                        role="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.nativeEvent.stopImmediatePropagation();
                            onTogglePin(e, theme.id);
                        }}
                        className={`p-2 rounded-full shadow-md transition-all hover:scale-110 cursor-pointer flex items-center justify-center ${theme.isPinned ? 'bg-purple-600 text-white' : 'bg-white text-gray-500 hover:text-purple-600'}`}
                        title={theme.isPinned ? "取消置顶" : "置顶风格"}
                    >
                        {theme.isPinned ? <PinOff size={16} className="pointer-events-none" /> : <Pin size={16} className="pointer-events-none" />}
                    </div>
                    
                    {!theme.isPreset && (
                        <div
                            role="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                                onDelete(e, theme.id);
                            }}
                            className="p-2 bg-white rounded-full shadow-md text-gray-500 hover:text-red-500 transition-all hover:scale-110 cursor-pointer flex items-center justify-center"
                            title="删除风格"
                        >
                            <Trash2 size={16} className="pointer-events-none" />
                        </div>
                    )}
                </div>

                {isActive && (
                    <div className="bg-white rounded-full p-2 shadow-md pointer-events-none">
                        <Check size={24} className="text-purple-600" />
                    </div>
                )}
            </div>

            {theme.isPinned && (
                <div className="absolute top-2 left-2 bg-purple-600 text-white p-1 rounded-md shadow-md pointer-events-none z-20">
                    <Pin size={12} fill="currentColor" />
                </div>
            )}
        </div>

        <div className="p-4 bg-white flex flex-col gap-1">
            <div className="flex items-center justify-between">
                <h3 className={`font-bold truncate ${isActive ? 'text-purple-700' : 'text-gray-800'}`}>
                    {theme.name}
                </h3>
                {theme.id.startsWith('magic-') && (
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">AI</span>
                )}
            </div>
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{theme.description}</p>
        </div>
    </div>
);

export const StyleLibrary: React.FC<StyleLibraryProps> = ({ themes, currentTheme, onSelect, onClose, onTogglePin, onDelete }) => {
    return (
        <div className="h-full w-full flex flex-col bg-gray-50/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm flex-shrink-0 sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                        <Palette size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">风格库</h2>
                        <p className="text-xs text-gray-500">选择或管理你的排版风格</p>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
                    {themes.map((theme) => (
                        <ThemeCard 
                            key={theme.id} 
                            theme={theme} 
                            isActive={currentTheme.id === theme.id}
                            onSelect={onSelect}
                            onTogglePin={onTogglePin}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};