export interface CSSStyleSet {
    [key: string]: string | number;
}

export interface ThemeMetadata {
    fontId: string;
    h2StyleId: string;
    textureId: string;
    brandColor: string;
    bgColor: string;
    strongColor: string;
}

export interface Theme {
    id: string;
    name: string;
    description: string;
    isPinned?: boolean;
    isPreset?: boolean;
    metadata?: ThemeMetadata; // Configuration state for the generator UI
    // Base container styles
    container: CSSStyleSet;
    // Typography elements
    h1: CSSStyleSet;
    h2: CSSStyleSet;
    h3: CSSStyleSet;
    p: CSSStyleSet;
    strong: CSSStyleSet;
    em: CSSStyleSet;
    blockquote: CSSStyleSet;
    ul: CSSStyleSet;
    ol: CSSStyleSet;
    li: CSSStyleSet;
    hr: CSSStyleSet;
    code: CSSStyleSet;
    pre: CSSStyleSet;
    link: CSSStyleSet;
    image: CSSStyleSet;
}

export type ThemeType = 'minimal' | 'neon' | 'editorial' | 'soft' | 'custom';