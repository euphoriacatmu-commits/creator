import { Theme, CSSStyleSet, ThemeMetadata } from '../types';
import { THEMES } from '../constants';
import { ImagePalette } from './imageUtils';

// --- UTILITIES ---

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// HSL Helper
const hsl = (h: number, s: number, l: number) => `hsl(${h}, ${s}%, ${l}%)`;
const alpha = (color: string, opacity: number) => {
    if (!color) return 'transparent';
    if (color.startsWith('hsl')) {
        return color.replace(')', `, ${opacity})`).replace('hsl', 'hsla');
    }
    if (color.startsWith('rgb')) {
        return color.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
    }
    // Hex to RGB for alpha (Simple approximation)
    if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color; 
};

const isColorDark = (color: string) => {
    let r = 0, g = 0, b = 0;
    if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        if (hex.length === 3) {
            r = parseInt(hex[0]+hex[0], 16);
            g = parseInt(hex[1]+hex[1], 16);
            b = parseInt(hex[2]+hex[2], 16);
        } else {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }
    } else if (color.startsWith('rgb')) {
        const nums = color.match(/\d+/g);
        if (nums && nums.length >= 3) {
            [r, g, b] = nums.map(Number);
        }
    } else if (color.startsWith('hsl')) {
         const parts = color.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
         if (parts) {
             return parseInt(parts[3]) < 50;
         }
         return false;
    } else {
        return false; 
    }
    
    // HSP equation for brightness
    const hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
    );
    return hsp < 127.5;
};

// --- ASSETS & CONSTANTS (Exported for UI) ---

export const FONTS = {
    sans: { name: "无衬线 (Sans)", value: "'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif" },
    serif: { name: "衬线体 (Serif)", value: "'Noto Serif SC', 'Songti SC', serif" },
    mono: { name: "等宽 (Mono)", value: "'JetBrains Mono', 'Courier New', monospace" },
    round: { name: "圆体 (Round)", value: "'Varela Round', 'Noto Sans SC', sans-serif" }
};

export const H2_STYLES = {
    capsule: "胶囊 (Capsule)",
    marker: "高光笔 (Marker)",
    underline: "下划线 (Underline)",
    'left-border': "侧边 (Border)",
    bracket: "方括号 (Bracket)",
    gradient: "渐变字 (Gradient)",
    clean: "极简 (Clean)"
};

export const TEXTURES = {
    none: "纯色 (Pure)",
    rice_paper: "宣纸 (Rice Paper)",
    magazine: "微粒 (Noise)",
    grid_dotted: "点阵 (Dotted)",
    lines: "斜纹 (Lines)",
    canvas: "画布 (Canvas)"
};

const SVGs = {
    // 杂志/微粒: Very fine, high-frequency noise
    magazine: (opacity = 0.03) => `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='${opacity}'/%3E%3C/svg%3E")`,
    
    // 宣纸: Organic fiber texture
    rice_paper: (opacity = 0.15) => `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='${opacity}'/%3E%3C/svg%3E")`,
    
    // 点阵: Minimalist architectural dots
    grid_dotted: (color: string) => `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='${encodeURIComponent(color)}' fill-opacity='0.2'/%3E%3C/svg%3E")`,
    
    // 斜纹: Subtle professional diagonal lines
    lines: (color: string) => `url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-1 11L11 -1' stroke='${encodeURIComponent(color)}' stroke-width='0.5' stroke-opacity='0.15'/%3E%3C/svg%3E")`,
    
    // 画布: Cross-hatch
    canvas: (color: string) => `url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 8L8 0M-2 2L2 -2M6 10L10 6' stroke='${encodeURIComponent(color)}' stroke-width='0.5' stroke-opacity='0.1'/%3E%3Cpath d='M0 0L8 8M-2 6L2 10M6 -2L10 2' stroke='${encodeURIComponent(color)}' stroke-width='0.5' stroke-opacity='0.1'/%3E%3C/svg%3E")`
};

// --- DESIGN ARCHETYPES ---

type ArchetypeID = 'modern_tech' | 'classic_elegant' | 'natural_fresh' | 'business_clean' | 'art_pop';

interface ArchetypeConfig {
    id: ArchetypeID;
    fonts: string[];
    h2Styles: string[];
    textures: string[];
    saturationRange: [number, number];
    lightnessRange: [number, number];
    bgModePreference: 'light' | 'dark' | 'paper' | 'any';
}

const ARCHETYPES: Record<ArchetypeID, ArchetypeConfig> = {
    modern_tech: { // 科技、互联网
        id: 'modern_tech',
        fonts: ['sans', 'mono'],
        h2Styles: ['left-border', 'clean', 'gradient', 'bracket'],
        textures: ['none', 'lines', 'grid_dotted'],
        saturationRange: [70, 100],
        lightnessRange: [45, 65],
        bgModePreference: 'any'
    },
    classic_elegant: { // 文学、历史
        id: 'classic_elegant',
        fonts: ['serif'],
        h2Styles: ['underline', 'left-border', 'bracket'],
        textures: ['rice_paper', 'canvas', 'magazine'],
        saturationRange: [30, 60],
        lightnessRange: [30, 50],
        bgModePreference: 'paper'
    },
    natural_fresh: { // 生活、健康
        id: 'natural_fresh',
        fonts: ['round', 'sans'],
        h2Styles: ['marker', 'capsule', 'underline'],
        textures: ['magazine', 'none', 'rice_paper'],
        saturationRange: [50, 80],
        lightnessRange: [40, 70],
        bgModePreference: 'light'
    },
    business_clean: { // 资讯、公告
        id: 'business_clean',
        fonts: ['sans'],
        h2Styles: ['clean', 'left-border', 'bracket'],
        textures: ['none', 'grid_dotted'],
        saturationRange: [60, 90],
        lightnessRange: [30, 45],
        bgModePreference: 'light'
    },
    art_pop: { // 展览、活动
        id: 'art_pop',
        fonts: ['sans', 'serif'],
        h2Styles: ['marker', 'gradient', 'capsule'],
        textures: ['magazine', 'lines', 'canvas'],
        saturationRange: [80, 100],
        lightnessRange: [40, 60],
        bgModePreference: 'any'
    }
};

// --- SEMANTIC ANALYSIS ---

interface SemanticMatch {
    archetype: ArchetypeID;
    hueStart?: number;
}

const KEYWORD_RULES: { keywords: string[], match: SemanticMatch }[] = [
    { keywords: ['tech', 'cyber', 'code', 'future', 'ai', 'data', 'web', '科技', '数码', '未来', '赛博', '代码'], match: { archetype: 'modern_tech', hueStart: 200 } },
    { keywords: ['book', 'history', 'poem', 'love', 'story', 'retro', '文学', '历史', '诗歌', '情感', '小说', '复古', '宋代'], match: { archetype: 'classic_elegant' } },
    { keywords: ['nature', 'food', 'travel', 'life', 'green', 'sky', 'cat', 'dog', '生活', '自然', '美食', '旅游', '宠物', '日记'], match: { archetype: 'natural_fresh' } },
    { keywords: ['news', 'report', 'work', 'job', 'finance', 'money', '新闻', '周报', '工作', '金融', '招聘', '通知'], match: { archetype: 'business_clean', hueStart: 210 } },
    { keywords: ['art', 'fashion', 'sale', 'music', 'party', 'show', '艺术', '时尚', '促销', '活动', '展览', '设计'], match: { archetype: 'art_pop' } },
];

// --- STYLE GENERATORS ---

const createH2Style = (type: string, brand: string, textHead: string, font: string): CSSStyleSet => {
    const onBrandText = '#ffffff'; 
    const base: CSSStyleSet = {
        margin: '40px 0 24px',
        fontWeight: 'bold',
        fontFamily: font,
        lineHeight: '1.4',
        display: 'block'
    };

    switch (type) {
        case 'capsule': 
            return { ...base, display: 'inline-block', backgroundColor: brand, color: onBrandText, padding: '6px 16px', borderRadius: '50px', boxShadow: `0 4px 10px ${alpha(brand, 0.3)}` };
        case 'marker':
            return { ...base, display: 'inline', background: `linear-gradient(180deg, transparent 60%, ${alpha(brand, 0.35)} 60%)`, color: textHead, padding: '0 4px' };
        case 'gradient':
            return { ...base, background: `linear-gradient(135deg, ${brand} 0%, ${alpha(brand, 0.6)} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' };
        case 'bracket':
             return { ...base, display: 'inline-block', borderLeft: `3px solid ${brand}`, borderRight: `3px solid ${brand}`, padding: '0 12px', color: textHead };
        case 'underline': 
            return { ...base, borderBottom: `2px solid ${brand}`, display: 'inline-block', paddingBottom: '6px', color: textHead };
        case 'left-border': 
            return { ...base, borderLeft: `4px solid ${brand}`, paddingLeft: '12px', color: textHead };
        case 'clean':
            return { ...base, color: textHead, fontSize: '24px', borderBottom: `1px solid ${alpha(brand, 0.1)}`, paddingBottom: '12px' };
        default:
            return { ...base, color: textHead };
    }
};

const createBlockquoteStyle = (archetype: ArchetypeID, brand: string, containerColor: string): CSSStyleSet => {
    // Ensure text is dark enough against background
    const textColor = '#555555';
    
    const base: CSSStyleSet = {
        margin: '24px 0',
        padding: '16px 20px',
        fontSize: '15px',
        lineHeight: '1.7',
        color: textColor 
    };

    if (archetype === 'classic_elegant') {
         return { ...base, backgroundColor: 'transparent', borderLeft: 'none', borderTop: `1px solid ${alpha(brand, 0.4)}`, borderBottom: `1px solid ${alpha(brand, 0.4)}`, textAlign: 'center', fontStyle: 'italic', padding: '24px 10px', color: brand };
    }
    
    if (archetype === 'modern_tech' || archetype === 'business_clean') {
        return { ...base, backgroundColor: alpha(brand, 0.05), borderLeft: `4px solid ${brand}`, color: textColor };
    }

    if (archetype === 'art_pop') {
         return { ...base, backgroundColor: '#fff', borderRadius: '8px', boxShadow: `4px 4px 0px ${alpha(brand, 0.2)}`, border: `1px solid ${brand}`, color: '#222' };
    }

    // Default (Natural) - Clean card
    return { ...base, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: `1px solid ${alpha(brand, 0.15)}`, color: textColor };
};

const getTexture = (type: string, brand: string): string => {
    switch (type) {
        case 'magazine': return SVGs.magazine();
        case 'rice_paper': return SVGs.rice_paper();
        case 'grid_dotted': return SVGs.grid_dotted(brand);
        case 'lines': return SVGs.lines(brand);
        case 'canvas': return SVGs.canvas(brand);
        default: return 'none';
    }
};

// --- DOMAIN MIMICRY LOGIC ---

const WEB_PRESETS: Record<string, Partial<ThemeMetadata>> = {
    'github': {
        bgColor: '#0d1117',
        brandColor: '#58a6ff',
        strongColor: '#c9d1d9',
        fontId: 'mono',
        h2StyleId: 'clean',
        textureId: 'lines'
    },
    'medium': {
        bgColor: '#ffffff',
        brandColor: '#000000',
        strongColor: '#242424',
        fontId: 'serif',
        h2StyleId: 'clean',
        textureId: 'none'
    },
    'notion': {
        bgColor: '#ffffff',
        brandColor: '#e16259', // Notion red accent
        strongColor: '#37352f',
        fontId: 'sans',
        h2StyleId: 'clean',
        textureId: 'none'
    },
    'apple': {
        bgColor: '#fbfbfd',
        brandColor: '#0066cc',
        strongColor: '#1d1d1f',
        fontId: 'sans',
        h2StyleId: 'clean',
        textureId: 'none'
    },
    'weixin': {
        bgColor: '#fcfcfc',
        brandColor: '#07c160',
        strongColor: '#333333',
        fontId: 'sans',
        h2StyleId: 'left-border',
        textureId: 'none'
    }
};

// --- MAIN FUNCTIONS ---

export const updateMagicTheme = (base: Theme, settings: ThemeMetadata): Theme => {
    const { brandColor, bgColor, strongColor, fontId, h2StyleId, textureId } = settings;
    
    const fontValue = FONTS[fontId as keyof typeof FONTS]?.value || FONTS.sans.value;
    const bgImage = getTexture(textureId, brandColor);
    
    const theme: Theme = JSON.parse(JSON.stringify(base));
    theme.metadata = settings;

    // Detect dark mode
    const isBgDark = isColorDark(bgColor);
    const bodyTextColor = isBgDark ? '#e5e5e5' : '#333333';
    const mutedTextColor = isBgDark ? '#a3a3a3' : '#666666';

    // Container
    theme.container.backgroundColor = bgColor;
    theme.container.backgroundImage = bgImage;
    theme.container.fontFamily = fontValue;
    
    // Update body text visibility
    theme.p.color = bodyTextColor;
    theme.li.color = bodyTextColor;
    theme.ul.color = bodyTextColor;
    theme.ol.color = bodyTextColor;

    // Headings
    theme.h1.color = brandColor;
    // Use strongColor as textHead for high contrast (it is usually white/light in dark themes)
    theme.h2 = createH2Style(h2StyleId, brandColor, strongColor, fontValue);
    theme.h3.color = isBgDark ? '#d4d4d4' : brandColor; // H3 often brand color, but if dark brand on dark bg, use light grey
    theme.h3.borderLeft = `3px solid ${alpha(brandColor, 0.5)}`;

    // Elements
    theme.strong.color = strongColor;
    if (String(theme.strong.backgroundImage).includes('gradient')) {
        theme.strong.backgroundImage = `linear-gradient(120deg, ${alpha(brandColor, 0.2)} 0%, ${alpha(brandColor, 0.2)} 100%)`;
    }

    // Re-apply blockquote color logic for update
    theme.blockquote.borderLeftColor = brandColor;
    theme.blockquote.borderTopColor = alpha(brandColor, 0.4);
    theme.blockquote.borderBottomColor = alpha(brandColor, 0.4);
    
    const bqBg = String(theme.blockquote.backgroundColor);
    const isBqCard = bqBg === '#ffffff' || bqBg === '#fff' || bqBg === 'white';

    if (bqBg !== 'transparent' && !isBqCard) {
         theme.blockquote.backgroundColor = alpha(brandColor, 0.05);
    }
    
    // Fix text visibility in blockquote
    if (isBqCard) {
        theme.blockquote.color = '#555555'; // Keep dark text on white card
    } else {
        // Transparent or tinted bg: adapt to global text color
        theme.blockquote.color = mutedTextColor;
    }

    // Specific override for art_pop style blockquote border
    if (theme.blockquote.boxShadow && String(theme.blockquote.boxShadow).includes('4px 4px')) {
        theme.blockquote.borderColor = brandColor;
        theme.blockquote.boxShadow = `4px 4px 0px ${alpha(brandColor, 0.2)}`;
    }
    
    theme.hr.backgroundColor = alpha(brandColor, 0.2);
    theme.image.boxShadow = `0 8px 24px ${alpha(brandColor, 0.15)}`;
    
    if (h2StyleId === 'capsule') {
        theme.h2.color = '#ffffff';
    }

    return theme;
};

export const generateMagicTheme = async (
    input: string | File, 
    type: 'text' | 'image' | 'url',
    extraData?: any // Can be palette object or extra strings
): Promise<Theme> => {
    
    let keyword = '';
    if (typeof input === 'string') {
        keyword = input.length > 20 ? input.slice(0, 15) : input;
    } else {
        keyword = input.name.split('.')[0];
    }
    const lowerKey = keyword.toLowerCase();

    // -- LOGIC FOR WEB URL MIMICRY --
    if (type === 'url') {
        let presetKey = '';
        if (lowerKey.includes('github')) presetKey = 'github';
        else if (lowerKey.includes('medium')) presetKey = 'medium';
        else if (lowerKey.includes('notion')) presetKey = 'notion';
        else if (lowerKey.includes('apple')) presetKey = 'apple';
        else if (lowerKey.includes('qq') || lowerKey.includes('weixin')) presetKey = 'weixin';

        const baseTheme: Theme = JSON.parse(JSON.stringify(THEMES.minimal));
        baseTheme.id = `web-${Date.now()}`;
        
        let metadata: ThemeMetadata;

        if (presetKey && WEB_PRESETS[presetKey]) {
            baseTheme.name = `${presetKey.charAt(0).toUpperCase() + presetKey.slice(1)} Style`;
            baseTheme.description = `Replica of ${presetKey} design system`;
            const p = WEB_PRESETS[presetKey];
            metadata = {
                fontId: p.fontId || 'sans',
                h2StyleId: p.h2StyleId || 'clean',
                textureId: p.textureId || 'none',
                brandColor: p.brandColor || '#333',
                bgColor: p.bgColor || '#fff',
                strongColor: p.strongColor || '#000'
            };
        } else {
            // Generic Modern SaaS / Web 3.0
            baseTheme.name = "Modern Web";
            baseTheme.description = "Generated SaaS style for web content";
            // Hash the url to pick a color
            let hash = 0;
            for (let i = 0; i < lowerKey.length; i++) hash = lowerKey.charCodeAt(i) + ((hash << 5) - hash);
            const hue = Math.abs(hash % 360);
            
            metadata = {
                fontId: 'sans',
                h2StyleId: 'left-border',
                textureId: 'grid_dotted',
                brandColor: hsl(hue, 70, 50),
                bgColor: '#ffffff',
                strongColor: '#111827'
            };
        }
        
        // Special URL overrides (card styles)
        let theme = updateMagicTheme(baseTheme, metadata);
        // Web styles usually have specific blockquote looks (e.g. Callouts)
        if (presetKey === 'github') {
            theme.blockquote = { margin: '16px 0', padding: '16px', borderLeft: '4px solid #30363d', backgroundColor: '#161b22', color: '#8b949e', borderRadius: '6px' };
            theme.code = { backgroundColor: 'rgba(110,118,129,0.4)', padding: '0.2em 0.4em', borderRadius: '6px', fontSize: '85%', fontFamily: 'monospace', color: '#c9d1d9' };
        } else if (presetKey === 'notion') {
             theme.blockquote = { margin: '16px 0', padding: '16px', borderLeft: '4px solid #333', backgroundColor: '#f1f1ef', color: '#37352f', borderRadius: '3px' };
        }

        return theme;
    }

    // -- LOGIC FOR IMAGES (PALETTE BASED) --
    if (type === 'image' && extraData && typeof extraData === 'object') {
        const palette = extraData as ImagePalette;
        const baseTheme: Theme = JSON.parse(JSON.stringify(THEMES.minimal));
        baseTheme.id = `img-${Date.now()}`;
        baseTheme.name = "Image Inspired";
        baseTheme.description = "Extracted from your uploaded image";

        // Determine vibe based on dark/light
        const h2Style = palette.isDark ? 'gradient' : 'left-border';
        const texture = palette.isDark ? 'magazine' : 'rice_paper';

        const metadata: ThemeMetadata = {
            fontId: 'sans',
            h2StyleId: h2Style,
            textureId: texture,
            brandColor: palette.brandColor,
            bgColor: palette.bgColor,
            strongColor: palette.strongColor
        };
        
        return updateMagicTheme(baseTheme, metadata);
    }

    // -- LOGIC FOR KEYWORDS (FALLBACK ORIGINAL) --

    // 1. Determine Archetype
    let archetype: ArchetypeConfig = ARCHETYPES.natural_fresh; 
    let baseHue = randomInt(0, 360);

    // Analysis by Keyword
    for (const rule of KEYWORD_RULES) {
        if (rule.keywords.some(k => lowerKey.includes(k))) {
            archetype = ARCHETYPES[rule.match.archetype];
            if (rule.match.hueStart !== undefined) {
                baseHue = rule.match.hueStart + randomInt(-20, 20);
            }
            break;
        }
    }

    // 2. Resolve Colors
    const h = baseHue;
    const s = randomInt(archetype.saturationRange[0], archetype.saturationRange[1]);
    const l = randomInt(archetype.lightnessRange[0], archetype.lightnessRange[1]);

    const brand = hsl(h, s, l);
    
    // Background Logic
    let bg = '#ffffff';
    let containerColor = '#333333';
    
    const modeRoll = Math.random();
    let effectiveBgMode = 'light';

    if (archetype.bgModePreference === 'dark' || (archetype.bgModePreference === 'any' && modeRoll > 0.8)) {
        effectiveBgMode = 'dark';
        bg = hsl(h, 20, 10);
        containerColor = '#e0e0e0';
    } else if (archetype.bgModePreference === 'paper' || (archetype.bgModePreference === 'any' && modeRoll > 0.5)) {
        effectiveBgMode = 'paper';
        bg = '#f9f9f7'; 
        containerColor = '#2c2c2c';
    }

    // Text Head Logic
    let textHead = brand;
    if (effectiveBgMode === 'light' || effectiveBgMode === 'paper') {
         if (l > 60) textHead = hsl(h, s, 35);
    } else {
        textHead = hsl(h, s, 85);
    }

    // 3. Structure
    const fontKey = pick(archetype.fonts);
    const h2Key = pick(archetype.h2Styles);
    
    let textureKey = pick(archetype.textures);
    if (effectiveBgMode === 'paper' && textureKey === 'none') {
        textureKey = Math.random() > 0.5 ? 'rice_paper' : 'canvas'; // Prefer rice_paper for paper mode
    }
    
    // 4. Metadata
    const metadata: ThemeMetadata = {
        fontId: fontKey,
        h2StyleId: h2Key,
        textureId: textureKey,
        brandColor: brand,
        bgColor: bg,
        strongColor: textHead 
    };

    // 5. Build
    const baseTheme: Theme = JSON.parse(JSON.stringify(THEMES.minimal));
    baseTheme.id = `magic-${Date.now()}`;
    const archetypeNames: Record<string, string> = {
        'modern_tech': 'Future',
        'classic_elegant': 'Classic',
        'natural_fresh': 'Breeze',
        'business_clean': 'Focus',
        'art_pop': 'Vivid'
    };
    baseTheme.name = `${keyword} ${archetypeNames[archetype.id]}`;
    baseTheme.description = `Generated ${archetype.id.replace('_', ' ')} style for ${keyword}`;
    baseTheme.container.color = containerColor;

    let theme = updateMagicTheme(baseTheme, metadata);
    theme.blockquote = createBlockquoteStyle(archetype.id, brand, containerColor);

    return theme;
};