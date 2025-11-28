import React, { useState, useMemo, useEffect } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Toolbar } from './components/Toolbar';
import { StyleLibrary } from './components/StyleLibrary';
import { ThemeSidebar } from './components/ThemeSidebar';
import { StyleGenerator } from './components/StyleGenerator'; // New Import
import { Theme } from './types';
import { THEMES, DEFAULT_MARKDOWN } from './constants';

const App: React.FC = () => {
    const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
    
    // Initialize themes
    const [themes, setThemes] = useState<Theme[]>(() => {
        try {
            const saved = localStorage.getItem('penscape_themes');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const hasPenScape = parsed.some(t => t.id === 'penscape');
                    if (!hasPenScape) {
                         return [THEMES.penscape, ...parsed];
                    }
                    return parsed;
                }
            }
        } catch (e) {
            console.warn('Failed to load themes from local storage', e);
        }
        return Object.values(THEMES);
    });

    const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
        return themes.find(t => t.id === 'penscape') || themes[0] || THEMES.minimal;
    });

    const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
    const [isGeneratorOpen, setIsGeneratorOpen] = useState<boolean>(false); // New State

    useEffect(() => {
        localStorage.setItem('penscape_themes', JSON.stringify(themes));
    }, [themes]);

    const sortedThemes = useMemo(() => {
        return [...themes].sort((a, b) => {
            if (a.isPinned !== b.isPinned) {
                return a.isPinned ? -1 : 1;
            }
            return 0; 
        });
    }, [themes]);

    const handleThemeSelect = (theme: Theme) => {
        setCurrentTheme(theme);
        setIsLibraryOpen(false); 
    };

    const handleGeneratorApply = (newTheme: Theme) => {
        setThemes(prevThemes => [newTheme, ...prevThemes]);
        setCurrentTheme(newTheme);
        setIsGeneratorOpen(false);
    };

    const toggleLibrary = () => {
        setIsLibraryOpen(prev => !prev);
    };

    const goHome = () => {
        const defaultTheme = themes.find(t => t.id === 'penscape') || themes.find(t => t.id === 'minimal') || themes[0];
        setCurrentTheme(defaultTheme);
        setMarkdown(DEFAULT_MARKDOWN);
        setIsLibraryOpen(false);
    };

    const handleTogglePin = (e: React.MouseEvent, themeId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setThemes(prev => prev.map(t => 
            t.id === themeId ? { ...t, isPinned: !t.isPinned } : t
        ));
    };

    const handleDeleteTheme = (e: React.MouseEvent, themeId: string) => {
        e.preventDefault(); 
        e.stopPropagation(); 

        if (window.confirm('确定要删除这个风格吗？')) {
            const newThemes = themes.filter(t => t.id !== themeId);
            setThemes(newThemes);

            if (currentTheme.id === themeId) {
                const fallback = newThemes.find(t => t.id === 'penscape') || newThemes[0] || THEMES.minimal;
                
                if (newThemes.length === 0) {
                     const defaults = Object.values(THEMES);
                     setThemes(defaults);
                     setCurrentTheme(THEMES.penscape);
                } else {
                     setCurrentTheme(fallback);
                }
            }
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50 text-gray-900 font-sans">
            <Toolbar 
                onOpenGenerator={() => setIsGeneratorOpen(true)}
                onToggleLibrary={toggleLibrary}
                onGoHome={goHome}
                isLibraryOpen={isLibraryOpen}
            />
            
            <div className="flex-1 flex overflow-hidden relative">
                <div className="flex-1 min-w-0 border-r border-gray-200 shadow-[inset_-10px_0_20px_-10px_rgba(0,0,0,0.1)] z-10 relative">
                    <Editor value={markdown} onChange={setMarkdown} />
                </div>

                <div className="w-64 border-r border-gray-200 bg-white flex-shrink-0 hidden md:flex flex-col shadow-sm z-20">
                    <ThemeSidebar 
                        themes={sortedThemes}
                        currentTheme={currentTheme}
                        onSelect={setCurrentTheme}
                        onTogglePin={handleTogglePin}
                        onDelete={handleDeleteTheme}
                    />
                </div>

                <div className="flex-1 min-w-0 bg-gray-100 relative">
                    <Preview markdown={markdown} theme={currentTheme} />
                </div>

                {/* Library Overlay */}
                {isLibraryOpen && (
                    <div className="absolute inset-0 z-50 bg-white">
                        <StyleLibrary 
                            themes={sortedThemes}
                            currentTheme={currentTheme}
                            onSelect={handleThemeSelect}
                            onClose={() => setIsLibraryOpen(false)}
                            onTogglePin={handleTogglePin}
                            onDelete={handleDeleteTheme}
                        />
                    </div>
                )}

                {/* Generator Overlay */}
                {isGeneratorOpen && (
                    <StyleGenerator 
                        onClose={() => setIsGeneratorOpen(false)}
                        onApply={handleGeneratorApply}
                    />
                )}
            </div>
        </div>
    );
};

export default App;