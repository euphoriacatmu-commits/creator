import React from 'react';
import { Theme } from '../types';
import { Check, Pin, Trash2, PinOff } from 'lucide-react';

interface ThemeSidebarProps {
    themes: Theme[];
    currentTheme: Theme;
    onSelect: (theme: Theme) => void;
    onTogglePin: (e: React.MouseEvent, id: string) => void;
    onDelete: (e: React.MouseEvent, id: string) => void;
}

const renderSidebarPreview = (theme: Theme) => {
    const cardStyle = {
        ...theme.container,
        width: '100%',
        height: '100%',
        padding: '12px',
        overflow: 'hidden',
        position: 'relative' as const,
        fontSize: '8px',
        borderRadius: '0',
        border: 'none',
        display: 'flex',
        flexDirection: 'column' as const,
        pointerEvents: 'none' as const, 
    };

    return (
        <div style={cardStyle as any}>
            <div style={{...theme.h1 as any, marginTop: '0', marginBottom: '4px', fontSize: '12px', lineHeight: '1.2' }}>PenScape</div>
            <div style={{...theme.h2 as any, marginTop: '2px', fontSize: '9px', marginBottom: '4px' }}>排版风格</div>
            <p style={{...theme.p as any, margin: '4px 0', fontSize: '8px', lineHeight: '1.4' }}>
                预览示例文本。
            </p>
            <div style={{...theme.blockquote as any, margin: '2px 0', padding: '4px', fontSize: '7px' }}>
                引用样式展示。
            </div>
        </div>
    );
};

export const ThemeSidebar: React.FC<ThemeSidebarProps> = ({ themes, currentTheme, onSelect, onTogglePin, onDelete }) => {
    return (
        <div className="h-full w-full bg-white flex flex-col">
            <div className="p-4 border-b border-gray-100 flex-shrink-0 bg-white z-10">
                <h3 className="font-bold text-gray-800 text-sm">选择风格</h3>
                <p className="text-xs text-gray-400 mt-1">点击即可应用</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {themes.map(theme => {
                    const isActive = currentTheme.id === theme.id;
                    return (
                        <div 
                            key={theme.id}
                            onClick={() => onSelect(theme)}
                            className={`
                                group relative w-full rounded-lg overflow-hidden cursor-pointer transition-all duration-200 border
                                ${isActive 
                                    ? 'border-purple-600 ring-1 ring-purple-600 shadow-md' 
                                    : 'border-gray-200 hover:border-purple-300 hover:shadow-sm'
                                }
                            `}
                        >
                            <div className="h-24 w-full bg-gray-50 overflow-hidden relative">
                                <div className="absolute inset-0 w-full h-full transform scale-[1] origin-top-left pointer-events-none">
                                    {renderSidebarPreview(theme)}
                                </div>
                                {isActive && (
                                    <div className="absolute inset-0 bg-purple-900/5 flex items-center justify-center pointer-events-none z-10">
                                        <div className="bg-purple-600 text-white rounded-full p-1 shadow-sm">
                                            <Check size={14} />
                                        </div>
                                    </div>
                                )}
                                
                                {/* Actions Overlay */}
                                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                                    <div 
                                        role="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.nativeEvent.stopImmediatePropagation();
                                            onTogglePin(e, theme.id);
                                        }}
                                        className={`p-1.5 rounded-full shadow-sm text-xs transition-colors cursor-pointer flex items-center justify-center ${theme.isPinned ? 'bg-purple-100 text-purple-600' : 'bg-white text-gray-400 hover:text-gray-600'}`}
                                        title={theme.isPinned ? "取消置顶" : "置顶风格"}
                                    >
                                        {theme.isPinned ? <PinOff size={12} className="pointer-events-none"/> : <Pin size={12} className="pointer-events-none"/>}
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
                                            className="p-1.5 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors cursor-pointer flex items-center justify-center"
                                            title="删除风格"
                                        >
                                            <Trash2 size={12} className="pointer-events-none" />
                                        </div>
                                    )}
                                </div>

                                {theme.isPinned && (
                                    <div className="absolute top-1 left-1 bg-purple-100 text-purple-700 p-0.5 rounded-sm shadow-sm pointer-events-none z-20">
                                        <Pin size={10} fill="currentColor" />
                                    </div>
                                )}
                            </div>

                            <div className={`px-3 py-2 ${isActive ? 'bg-purple-50' : 'bg-white'}`}>
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs font-semibold truncate ${isActive ? 'text-purple-700' : 'text-gray-700'}`}>
                                        {theme.name}
                                    </span>
                                    {theme.id.startsWith('magic-') && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};