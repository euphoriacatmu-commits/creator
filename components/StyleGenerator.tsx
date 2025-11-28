import React, { useState, useRef, useEffect } from 'react';
import { Wand2, X, Image as ImageIcon, Type, Globe, Upload, Loader2, ArrowRight, Palette, Layout, Settings2, RotateCcw, Check } from 'lucide-react';
import { Theme, ThemeMetadata } from '../types';
import { generateMagicTheme, updateMagicTheme, FONTS, H2_STYLES, TEXTURES } from '../services/magicService';
import { analyzeImage } from '../services/imageUtils';

interface StyleGeneratorProps {
    onClose: () => void;
    onApply: (theme: Theme) => void;
}

type Step = 'input' | 'analyzing' | 'preview';
type Mode = 'text' | 'image' | 'url';

// Curated palette presets for better UX
const PRESET_PALETTES = [
    { name: '莫兰迪 (Morandi)', bg: '#f7f4f0', brand: '#8c887d', strong: '#5c5c5a' },
    { name: '阅读 (Reader)', bg: '#fcfcfc', brand: '#2c3e50', strong: '#e74c3c' },
    { name: '暗夜 (Dark)', bg: '#1a1a1a', brand: '#d4af37', strong: '#ffffff' },
    { name: '薄荷 (Mint)', bg: '#f0f9f4', brand: '#2d8a6e', strong: '#1b4d3e' },
    { name: '蜜桃 (Peach)', bg: '#fff0f3', brand: '#d63384', strong: '#a61e4d' },
    { name: '商务 (Business)', bg: '#ffffff', brand: '#0f4c81', strong: '#000000' },
];

export const StyleGenerator: React.FC<StyleGeneratorProps> = ({ onClose, onApply }) => {
    const [step, setStep] = useState<Step>('input');
    const [mode, setMode] = useState<Mode>('text');
    const [inputValue, setInputValue] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [generatedTheme, setGeneratedTheme] = useState<Theme | null>(null);
    
    // Customization State
    const [config, setConfig] = useState<ThemeMetadata | null>(null);
    const [initialConfig, setInitialConfig] = useState<ThemeMetadata | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [analysisLog, setAnalysisLog] = useState<string[]>([]);
    
    const handleGenerate = async () => {
        if (mode === 'text' && !inputValue) return;
        if (mode === 'image' && !selectedFile) return;

        setStep('analyzing');
        setAnalysisLog([]);

        const addLog = (msg: string) => setAnalysisLog(prev => [...prev, msg]);

        addLog("正在连接视觉分析引擎...");
        await new Promise(r => setTimeout(r, 600));

        let theme: Theme;
        if (mode === 'image' && selectedFile) {
            addLog("扫描像素色块...");
            try {
                // Advanced palette extraction
                const palette = await analyzeImage(selectedFile);
                
                addLog(`识别背景: ${palette.isDark ? '暗色系' : '亮色系'}`);
                addLog(`提取主色: ${palette.brandColor}`);
                
                await new Promise(r => setTimeout(r, 600));
                theme = await generateMagicTheme(selectedFile, 'image', palette);
            } catch (e) {
                console.error(e);
                theme = await generateMagicTheme("Random", 'text');
            }
        } else if (mode === 'url') {
             addLog("解析域名特征...");
             await new Promise(r => setTimeout(r, 500));
             addLog("匹配设计系统 (Design System)...");
             theme = await generateMagicTheme(inputValue, 'url');
        } else {
            addLog(`解析语义关键词...`);
            await new Promise(r => setTimeout(r, 400));
            addLog("构建色彩空间...");
            theme = await generateMagicTheme(inputValue, 'text');
        }

        setGeneratedTheme(theme);
        if (theme.metadata) {
            setConfig(theme.metadata);
            setInitialConfig(theme.metadata);
        }
        
        await new Promise(r => setTimeout(r, 400));
        setStep('preview');
    };

    const handleConfigChange = (key: keyof ThemeMetadata, value: string) => {
        if (!config || !generatedTheme) return;
        const newConfig = { ...config, [key]: value };
        setConfig(newConfig);
        
        // Live update the theme
        const updatedTheme = updateMagicTheme(generatedTheme, newConfig);
        setGeneratedTheme(updatedTheme);
    };

    const handlePresetApply = (preset: typeof PRESET_PALETTES[0]) => {
        if (!config || !generatedTheme) return;
        const newConfig = {
            ...config,
            bgColor: preset.bg,
            brandColor: preset.brand,
            strongColor: preset.strong
        };
        setConfig(newConfig);
        const updatedTheme = updateMagicTheme(generatedTheme, newConfig);
        setGeneratedTheme(updatedTheme);
    };

    const handleResetColors = () => {
        if (!config || !initialConfig || !generatedTheme) return;
        
        const newConfig = {
            ...config,
            bgColor: initialConfig.bgColor,
            brandColor: initialConfig.brandColor,
            strongColor: initialConfig.strongColor
        };
        
        setConfig(newConfig);
        const updatedTheme = updateMagicTheme(generatedTheme, newConfig);
        setGeneratedTheme(updatedTheme);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setInputValue(e.target.files[0].name);
        }
    };

    const renderPreviewCard = (theme: Theme) => {
        return (
            <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-[500px]">
                <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center px-3 gap-1 flex-shrink-0">
                     <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 overflow-y-auto" style={theme.container as any}>
                    <div style={theme.h1 as any}>Generated Style</div>
                    <div style={theme.p as any}>
                        PenScape AI 已经根据您的输入生成了这套专属排版。您可以根据需要在左侧微调配色。
                    </div>
                    <div style={theme.h2 as any}>Section Header</div>
                    <div style={theme.p as any}>
                        我们会自动分析色彩、情感倾向以及适合的阅读结构。这是<span style={theme.strong as any}>强调文字</span>的效果展示。
                    </div>
                    <div style={theme.blockquote as any}>
                        "优秀的设计是可见的智慧。"
                    </div>
                    <div style={theme.ul as any}>
                         <div style={theme.li as any}>• 智能配色方案</div>
                         <div style={theme.li as any}>• 结构化排版</div>
                         <div style={theme.li as any}>• 微信完美兼容</div>
                    </div>
                    <div style={theme.h2 as any}>Visual Elements</div>
                     <div style={{...theme.image as any, height: '120px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', border: '2px dashed #ddd'}}>
                        Image Placeholder
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 shrink-0 bg-white z-20">
                    <div className="flex items-center gap-2">
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                            <Wand2 size={20} />
                        </div>
                        <span className="font-bold text-lg text-gray-800">AI 风格设计师</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6 md:p-8 flex flex-col">
                    
                    {step === 'input' && (
                        <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300 py-10">
                            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">你想创作什么风格？</h2>
                            <p className="text-center text-gray-500 mb-8">选择一种输入方式，让 AI 提取设计 DNA</p>

                            <div className="flex justify-center gap-4 mb-8">
                                <button 
                                    onClick={() => setMode('text')}
                                    className={`flex flex-col items-center gap-2 p-4 w-32 rounded-xl border-2 transition-all ${mode === 'text' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 bg-white hover:border-purple-200 text-gray-600'}`}
                                >
                                    <Type size={24} />
                                    <span className="text-sm font-medium">关键词</span>
                                </button>
                                <button 
                                    onClick={() => setMode('image')}
                                    className={`flex flex-col items-center gap-2 p-4 w-32 rounded-xl border-2 transition-all ${mode === 'image' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 bg-white hover:border-purple-200 text-gray-600'}`}
                                >
                                    <ImageIcon size={24} />
                                    <span className="text-sm font-medium">图片提取</span>
                                </button>
                                <button 
                                    onClick={() => setMode('url')}
                                    className={`flex flex-col items-center gap-2 p-4 w-32 rounded-xl border-2 transition-all ${mode === 'url' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 bg-white hover:border-purple-200 text-gray-600'}`}
                                >
                                    <Globe size={24} />
                                    <span className="text-sm font-medium">文章链接</span>
                                </button>
                            </div>

                            <div className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                {mode === 'text' && (
                                    <div className="flex flex-col gap-3">
                                        <label className="text-sm font-semibold text-gray-700">描述风格</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                                            placeholder="例如：科技感、赛博朋克、夏日清新、极简黑白..."
                                            value={inputValue}
                                            onChange={e => setInputValue(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                                        />
                                    </div>
                                )}

                                {mode === 'image' && (
                                    <div className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-200 rounded-xl p-8 bg-gray-50 hover:bg-purple-50/50 hover:border-purple-200 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        {selectedFile ? (
                                            <div className="text-center">
                                                <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-3 overflow-hidden shadow-sm">
                                                    <img src={URL.createObjectURL(selectedFile)} className="w-full h-full object-cover" alt="preview" />
                                                </div>
                                                <p className="font-medium text-purple-700">{selectedFile.name}</p>
                                                <p className="text-xs text-gray-400 mt-1">点击更换</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="bg-white p-3 rounded-full shadow-sm text-purple-600">
                                                    <Upload size={24} />
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-medium text-gray-700">点击上传图片</p>
                                                    <p className="text-xs text-gray-400 mt-1">支持 PNG, JPG</p>
                                                </div>
                                            </>
                                        )}
                                        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </div>
                                )}

                                {mode === 'url' && (
                                    <div className="flex flex-col gap-3">
                                        <label className="text-sm font-semibold text-gray-700">文章链接 / 网站首页</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                                            placeholder="https://github.com..."
                                            value={inputValue}
                                            onChange={e => setInputValue(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                                        />
                                        <p className="text-xs text-gray-400 px-1">支持识别 GitHub, Medium, Notion, Apple 等流行设计风格</p>
                                    </div>
                                )}

                                <button 
                                    onClick={handleGenerate}
                                    disabled={(mode !== 'image' && !inputValue) || (mode === 'image' && !selectedFile)}
                                    className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-200"
                                >
                                    <Wand2 size={20} />
                                    开始生成设计
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'analyzing' && (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                                <div className="bg-white p-6 rounded-2xl shadow-xl relative z-10">
                                    <Loader2 size={48} className="text-purple-600 animate-spin" />
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-800 mb-6">正在构建排版系统...</h3>
                            
                            <div className="w-full max-w-md space-y-3">
                                {analysisLog.map((log, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-gray-600 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></div>
                                        <span>{log}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'preview' && generatedTheme && config && (
                        <div className="w-full h-full flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Left: Customization Panel */}
                            <div className="w-full md:w-80 flex flex-col gap-6 flex-shrink-0">
                                
                                {/* Quick Presets */}
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                                     <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
                                        <Palette size={16} className="text-purple-500"/> 
                                        推荐配色
                                    </h3>
                                    <div className="grid grid-cols-6 gap-2">
                                        {PRESET_PALETTES.map((preset, idx) => (
                                            <div 
                                                key={idx}
                                                onClick={() => handlePresetApply(preset)}
                                                className="group relative cursor-pointer"
                                                title={preset.name}
                                            >
                                                <div 
                                                    className="w-full aspect-square rounded-full shadow-sm border border-gray-200 overflow-hidden transform transition-transform hover:scale-110"
                                                    style={{ background: `linear-gradient(135deg, ${preset.brand} 50%, ${preset.bg} 50%)` }}
                                                ></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Custom Color Controls */}
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-wide">
                                            <Settings2 size={16} className="text-gray-500"/> 
                                            自定义颜色
                                        </h3>
                                        <button 
                                            onClick={handleResetColors}
                                            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
                                            title="恢复初始配色"
                                        >
                                            <RotateCcw size={12} />
                                            恢复
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm border border-gray-200 group cursor-pointer hover:scale-110 transition-transform">
                                                <input 
                                                    type="color" 
                                                    className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer opacity-0 z-20"
                                                    value={config.bgColor}
                                                    onChange={e => handleConfigChange('bgColor', e.target.value)}
                                                />
                                                <div className="absolute inset-0 z-10 pointer-events-none" style={{backgroundColor: config.bgColor}}></div>
                                            </div>
                                            <span className="text-[10px] text-gray-500 font-medium">背景</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm border border-gray-200 group cursor-pointer hover:scale-110 transition-transform">
                                                <input 
                                                    type="color" 
                                                    className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer opacity-0 z-20"
                                                    value={config.brandColor}
                                                    onChange={e => handleConfigChange('brandColor', e.target.value)}
                                                />
                                                <div className="absolute inset-0 z-10 pointer-events-none" style={{backgroundColor: config.brandColor}}></div>
                                            </div>
                                            <span className="text-[10px] text-gray-500 font-medium">主色</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm border border-gray-200 group cursor-pointer hover:scale-110 transition-transform">
                                                <input 
                                                    type="color" 
                                                    className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer opacity-0 z-20"
                                                    value={config.strongColor}
                                                    onChange={e => handleConfigChange('strongColor', e.target.value)}
                                                />
                                                <div className="absolute inset-0 z-10 pointer-events-none" style={{backgroundColor: config.strongColor}}></div>
                                            </div>
                                            <span className="text-[10px] text-gray-500 font-medium">强调</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Layout Controls */}
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex-1">
                                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                        <Layout size={16} className="text-blue-500"/> 
                                        排版特征
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-500">字体家族</label>
                                            <select 
                                                value={config.fontId}
                                                onChange={e => handleConfigChange('fontId', e.target.value)}
                                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all"
                                            >
                                                {Object.entries(FONTS).map(([key, font]) => (
                                                    <option key={key} value={key}>{font.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-500">标题风格</label>
                                            <select 
                                                value={config.h2StyleId}
                                                onChange={e => handleConfigChange('h2StyleId', e.target.value)}
                                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all"
                                            >
                                                {Object.entries(H2_STYLES).map(([key, label]) => (
                                                    <option key={key} value={key}>{label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-500">纹理材质</label>
                                            <select 
                                                value={config.textureId}
                                                onChange={e => handleConfigChange('textureId', e.target.value)}
                                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all"
                                            >
                                                {Object.entries(TEXTURES).map(([key, label]) => (
                                                    <option key={key} value={key}>{label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Preview & Actions */}
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="flex-1 bg-gray-100 rounded-2xl p-4 md:p-8 flex items-center justify-center border border-gray-200 shadow-inner">
                                    <div className="w-full max-w-[400px]">
                                         {renderPreviewCard(generatedTheme)}
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 h-14">
                                    <button 
                                        onClick={() => { setStep('input'); setAnalysisLog([]); }}
                                        className="w-32 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        重新生成
                                    </button>
                                    <button 
                                        onClick={() => onApply(generatedTheme)}
                                        className="flex-1 rounded-xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 flex items-center justify-center gap-2"
                                    >
                                        <Check />
                                        应用当前设计
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};