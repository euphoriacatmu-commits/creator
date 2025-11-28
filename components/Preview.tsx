import React, { useEffect, useState } from 'react';
import { Copy, Check, Smartphone } from 'lucide-react';
import { processMarkdown } from '../services/styleEngine';
import { Theme } from '../types';

interface PreviewProps {
    markdown: string;
    theme: Theme;
}

export const Preview: React.FC<PreviewProps> = ({ markdown, theme }) => {
    const [htmlContent, setHtmlContent] = useState('');
    const [copied, setCopied] = useState(false);
    const [isCopying, setIsCopying] = useState(false);

    useEffect(() => {
        let mounted = true;
        processMarkdown(markdown, theme).then(html => {
            if (mounted) setHtmlContent(html);
        });
        return () => { mounted = false; };
    }, [markdown, theme]);

    const handleCopy = async () => {
        setIsCopying(true);
        try {
            // We need to write a Blob to support proper HTML pasting in Wechat
            const blob = new Blob([htmlContent], { type: 'text/html' });
            // Also provide plain text fallback
            const textBlob = new Blob([markdown], { type: 'text/plain' });
            
            const item = new ClipboardItem({
                'text/html': blob,
                'text/plain': textBlob
            });
            
            await navigator.clipboard.write([item]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            console.error('Copy failed', err);
            alert('复制失败，请检查浏览器权限。');
        } finally {
            setIsCopying(false);
        }
    };

    return (
        <div className="h-full bg-gray-100 flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 pattern-grid opacity-5 pointer-events-none"></div>
            
            {/* Phone Frame */}
            <div className="relative w-[375px] h-[812px] bg-white rounded-[40px] shadow-2xl border-[8px] border-gray-900 flex flex-col overflow-hidden shrink-0 transform scale-90 sm:scale-100 transition-transform">
                {/* Dynamic Island / Notch Mockup */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-20"></div>
                
                {/* Status Bar Mockup */}
                <div className="h-12 bg-white flex items-center justify-between px-6 pt-2 shrink-0 select-none z-10 border-b border-gray-50">
                   <span className="text-xs font-semibold text-gray-900">9:41</span>
                   <div className="flex gap-1">
                       <div className="w-4 h-2.5 bg-gray-900 rounded-[1px]"></div>
                       <div className="w-0.5 h-2.5 bg-gray-900 rounded-[1px]"></div>
                   </div>
                </div>

                {/* Content Area */}
                <div 
                    className="flex-1 overflow-y-auto no-scrollbar bg-white"
                >
                    {/* Render the computed HTML safely */}
                    <div 
                        dangerouslySetInnerHTML={{ __html: htmlContent }} 
                    />
                    
                    {/* Extra padding at bottom for scroll */}
                    <div className="h-20"></div>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full pointer-events-none"></div>
            
                {/* Floating Copy Button */}
                <div className="absolute bottom-6 right-6 z-30">
                    <button
                        onClick={handleCopy}
                        disabled={isCopying}
                        className={`
                            flex items-center gap-2 px-5 py-3 rounded-full shadow-lg font-medium text-white transition-all transform hover:scale-105 active:scale-95
                            ${copied ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}
                        `}
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        {copied ? '已复制！' : '复制到公众号'}
                    </button>
                </div>
            </div>
            
            <div className="mt-4 text-gray-400 text-xs flex items-center gap-1">
                <Smartphone size={14} />
                <span>iPhone 13 / 375px Preview</span>
            </div>
        </div>
    );
};
