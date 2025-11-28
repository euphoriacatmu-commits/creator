import { Theme } from './types';

export const DEFAULT_MARKDOWN = `# PenScape 排版引擎

这里是**PenScape**，一个专为微信公众号设计的 Markdown 编辑器。

## 为什么选择 PenScape？

> "简约而不简单，让文字更有力量。"

1. **实时预览**：左侧写作，右侧实时查看手机效果。
2. **内联样式**：彻底告别排版错乱，一键复制完美粘贴。
3. **多款主题**：从极简到赛博，满足不同场景需求。
4. **AI 灵感**：输入关键词，自动生成专属风格。

### 代码演示

\`console.log("Hello Wechat!");\`

无论是*斜体*还是**加粗**，或者是[链接](https://github.com)，都能完美渲染。

---

开始你的创作吧！
`;

const BASE_BLOCKQUOTE = {
    margin: '20px 0',
    padding: '16px',
    borderLeft: '4px solid #ddd',
    backgroundColor: '#f8f8f8',
    color: '#666',
    fontSize: '15px',
    lineHeight: '1.6'
};

const BASE_IMAGE = {
    display: 'block',
    maxWidth: '100%',
    height: 'auto',
    margin: '20px auto',
    borderRadius: '8px'
};

export const THEMES: Record<string, Theme> = {
    penscape: {
        id: 'penscape',
        name: '笔境 (PenScape)',
        description: '沉浸式书房风格，羊皮纸质感与朱砂红点缀',
        isPreset: true,
        container: { backgroundColor: '#F5F5F0', padding: '20px', fontFamily: "'Noto Sans SC', sans-serif", color: '#2C3E50' },
        h1: { fontSize: '26px', fontWeight: 'bold', color: '#2C3E50', margin: '30px 0 20px 0', textAlign: 'center', fontFamily: "'Noto Serif SC', serif", letterSpacing: '1px' },
        h2: { fontSize: '20px', fontWeight: 'bold', color: '#2C3E50', margin: '30px 0 16px 0', borderLeft: '4px solid #C0392B', paddingLeft: '12px', lineHeight: '1.4', fontFamily: "'Noto Serif SC', serif', backgroundColor: 'transparent" },
        h3: { fontSize: '18px', fontWeight: '600', color: '#2C3E50', margin: '20px 0 8px 0', fontFamily: "'Noto Serif SC', serif" },
        p: { fontSize: '16px', lineHeight: '1.8', color: '#2C3E50', margin: '16px 0', textAlign: 'justify' },
        strong: { fontWeight: 'bold', color: '#C0392B' },
        em: { fontStyle: 'italic', color: '#5D6D7E', fontFamily: "'Noto Serif SC', serif" },
        blockquote: { margin: '24px 0', padding: '16px 20px', borderLeft: '6px solid #C0392B', backgroundColor: '#EAEAE5', color: '#2C3E50', borderRadius: '4px', fontStyle: 'normal', fontSize: '15px', lineHeight: '1.7' },
        ul: { paddingLeft: '20px', margin: '16px 0' },
        ol: { paddingLeft: '20px', margin: '16px 0' },
        li: { margin: '8px 0', color: '#2C3E50', fontSize: '16px', lineHeight: '1.6' },
        hr: { border: 'none', borderTop: '1px solid #D6D6D0', margin: '40px 0', height: '1px' },
        code: { backgroundColor: '#EAEAE5', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '14px', color: '#C0392B' },
        pre: { backgroundColor: '#2C3E50', padding: '16px', borderRadius: '8px', overflowX: 'auto', fontSize: '13px', lineHeight: '1.5', margin: '20px 0', color: '#F5F5F0' },
        link: { color: '#C0392B', textDecoration: 'none', borderBottom: '1px solid #C0392B' },
        image: { display: 'block', maxWidth: '100%', height: 'auto', margin: '24px auto', borderRadius: '6px', boxShadow: '0 4px 12px rgba(44, 62, 80, 0.1)' }
    },
    minimal: {
        id: 'minimal',
        name: '极简 (Minimal)',
        description: '黑白灰，大留白，苹果风',
        isPreset: true,
        container: { backgroundColor: '#ffffff', padding: '16px', fontFamily: "'Noto Sans SC', sans-serif" },
        h1: { fontSize: '24px', fontWeight: 'bold', color: '#111', margin: '24px 0 16px 0', lineHeight: '1.4' },
        h2: { fontSize: '20px', fontWeight: '600', color: '#333', margin: '20px 0 12px 0', borderBottom: '1px solid #eee', paddingBottom: '8px' },
        h3: { fontSize: '18px', fontWeight: '600', color: '#444', margin: '16px 0 8px 0' },
        p: { fontSize: '16px', lineHeight: '1.8', color: '#333', margin: '16px 0', textAlign: 'justify' },
        strong: { fontWeight: 'bold', color: '#000' },
        em: { fontStyle: 'italic', color: '#666' },
        blockquote: { ...BASE_BLOCKQUOTE, borderLeft: '4px solid #000', backgroundColor: '#f9f9f9' },
        ul: { paddingLeft: '20px', margin: '10px 0' },
        ol: { paddingLeft: '20px', margin: '10px 0' },
        li: { margin: '8px 0', color: '#333', fontSize: '16px', lineHeight: '1.6' },
        hr: { border: 'none', borderTop: '1px solid #eee', margin: '30px 0' },
        code: { backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '14px', color: '#d63384' },
        pre: { backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '8px', overflowX: 'auto', fontSize: '13px', lineHeight: '1.5', margin: '16px 0' },
        link: { color: '#0066cc', textDecoration: 'none', borderBottom: '1px solid #0066cc' },
        image: { ...BASE_IMAGE }
    },
    neon: {
        id: 'neon',
        name: '赛博 (Neon)',
        description: '高对比度，科技感边框',
        isPreset: true,
        container: { backgroundColor: '#0a0a0a', padding: '16px', fontFamily: "'Inter', sans-serif" },
        h1: { fontSize: '24px', fontWeight: 'bold', color: '#00ff9d', margin: '24px 0 16px 0', textShadow: '0 0 5px rgba(0,255,157,0.3)' },
        h2: { fontSize: '20px', fontWeight: '600', color: '#00ff9d', margin: '20px 0 12px 0', borderLeft: '4px solid #00ff9d', paddingLeft: '10px' },
        h3: { fontSize: '18px', fontWeight: '600', color: '#fff', margin: '16px 0 8px 0' },
        p: { fontSize: '16px', lineHeight: '1.8', color: '#e0e0e0', margin: '16px 0', textAlign: 'justify' },
        strong: { fontWeight: 'bold', color: '#fff', backgroundColor: '#333', padding: '0 4px' },
        em: { fontStyle: 'italic', color: '#aaa' },
        blockquote: { ...BASE_BLOCKQUOTE, backgroundColor: '#111', borderLeft: '4px solid #00ff9d', color: '#bbb' },
        ul: { paddingLeft: '20px', margin: '10px 0' },
        ol: { paddingLeft: '20px', margin: '10px 0' },
        li: { margin: '8px 0', color: '#e0e0e0', fontSize: '16px', lineHeight: '1.6' },
        hr: { border: 'none', borderTop: '1px solid #333', margin: '30px 0' },
        code: { backgroundColor: '#222', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '14px', color: '#00ff9d' },
        pre: { backgroundColor: '#111', padding: '16px', borderRadius: '8px', border: '1px solid #333', overflowX: 'auto', margin: '16px 0', color: '#ccc' },
        link: { color: '#00ff9d', textDecoration: 'underline' },
        image: { ...BASE_IMAGE, border: '1px solid #333' }
    },
    editorial: {
        id: 'editorial',
        name: '杂志 (Editorial)',
        description: '衬线标题，首字下沉感，高饱和',
        isPreset: true,
        container: { backgroundColor: '#ffffff', padding: '16px', fontFamily: "'Noto Serif SC', serif" },
        h1: { fontSize: '28px', fontWeight: '800', color: '#b91c1c', margin: '24px 0 16px 0', textAlign: 'center', letterSpacing: '1px' },
        h2: { fontSize: '22px', fontWeight: '700', color: '#111', margin: '24px 0 16px 0', display: 'inline-block', borderBottom: '3px solid #b91c1c', paddingBottom: '4px' },
        h3: { fontSize: '18px', fontWeight: '600', color: '#444', margin: '16px 0 8px 0' },
        p: { fontSize: '16px', lineHeight: '1.9', color: '#2d2d2d', margin: '16px 0', textAlign: 'justify', fontFamily: "'Noto Sans SC', sans-serif" },
        strong: { fontWeight: 'bold', color: '#b91c1c' },
        em: { fontStyle: 'italic', color: '#666', fontFamily: "'Noto Serif SC', serif" },
        blockquote: { margin: '24px 0', padding: '20px', backgroundColor: '#fff1f2', borderLeft: 'none', borderTop: '2px solid #b91c1c', borderBottom: '2px solid #b91c1c', color: '#881337', textAlign: 'center', fontStyle: 'italic' },
        ul: { paddingLeft: '20px', margin: '10px 0' },
        ol: { paddingLeft: '20px', margin: '10px 0' },
        li: { margin: '8px 0', color: '#2d2d2d', fontSize: '16px', lineHeight: '1.7' },
        hr: { border: 'none', borderTop: '2px solid #000', margin: '30px auto', width: '50px' },
        code: { backgroundColor: '#fef2f2', padding: '2px 6px', borderRadius: '0', fontFamily: 'monospace', fontSize: '14px', color: '#b91c1c' },
        pre: { backgroundColor: '#1c1917', padding: '16px', borderRadius: '0', overflowX: 'auto', margin: '16px 0', color: '#f5f5f5' },
        link: { color: '#b91c1c', textDecoration: 'none', borderBottom: '1px solid #b91c1c', fontWeight: '500' },
        image: { ...BASE_IMAGE, borderRadius: '0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
    },
    soft: {
        id: 'soft',
        name: '温润 (Soft)',
        description: '莫兰迪色系，圆角，信纸质感',
        isPreset: true,
        container: { backgroundColor: '#fafaf9', padding: '16px', fontFamily: "'Noto Sans SC', sans-serif" },
        h1: { fontSize: '24px', fontWeight: 'normal', color: '#57534e', margin: '24px 0 16px 0', textAlign: 'center' },
        h2: { fontSize: '18px', fontWeight: 'bold', color: '#fff', margin: '20px 0 12px 0', backgroundColor: '#a8a29e', display: 'inline-block', padding: '4px 12px', borderRadius: '20px' },
        h3: { fontSize: '17px', fontWeight: '600', color: '#78716c', margin: '16px 0 8px 0' },
        p: { fontSize: '16px', lineHeight: '1.8', color: '#57534e', margin: '16px 0', textAlign: 'justify' },
        strong: { fontWeight: '600', color: '#78716c', borderBottom: '2px solid #d6d3d1' },
        em: { fontStyle: 'italic', color: '#a8a29e' },
        blockquote: { ...BASE_BLOCKQUOTE, backgroundColor: '#fff', borderLeft: '4px solid #e7e5e4', color: '#78716c', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
        ul: { paddingLeft: '20px', margin: '10px 0' },
        ol: { paddingLeft: '20px', margin: '10px 0' },
        li: { margin: '8px 0', color: '#57534e', fontSize: '16px', lineHeight: '1.6' },
        hr: { border: 'none', borderTop: '1px dashed #d6d3d1', margin: '30px 0' },
        code: { backgroundColor: '#e7e5e4', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '14px', color: '#57534e' },
        pre: { backgroundColor: '#fff', padding: '16px', borderRadius: '12px', overflowX: 'auto', margin: '16px 0', border: '1px solid #e7e5e4', color: '#57534e' },
        link: { color: '#a8a29e', textDecoration: 'none', borderBottom: '1px dashed #a8a29e' },
        image: { ...BASE_IMAGE, borderRadius: '12px' }
    }
};