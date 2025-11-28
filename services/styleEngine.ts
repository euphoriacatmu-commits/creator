import { Theme, CSSStyleSet } from '../types';
import { marked } from 'marked';

/**
 * Converts camelCase CSS properties to kebab-case (e.g., backgroundColor -> background-color)
 */
const toKebabCase = (str: string) => str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);

/**
 * Converts a CSS style object into a string (e.g., {color: 'red'} -> "color: red;")
 */
export const styleObjectToString = (styles: CSSStyleSet): string => {
    return Object.entries(styles)
        .map(([key, value]) => `${toKebabCase(key)}: ${value}`)
        .join('; ') + ';';
};

/**
 * The core engine.
 * 1. Parses MD to HTML.
 * 2. Creates a virtual DOM.
 * 3. Traverses DOM and injects inline styles based on the Theme.
 * 4. Returns the innerHTML string.
 */
export const processMarkdown = async (markdown: string, theme: Theme): Promise<string> => {
    // 1. Parse Markdown
    const rawHtml = await marked.parse(markdown);

    // 2. Create a temporary container (Virtual DOM)
    const wrapper = document.createElement('div');
    wrapper.innerHTML = rawHtml;

    // Apply container styles to the wrapper's children mainly for consistency, 
    // but the wrapper itself isn't copied. We usually want a wrapper div for Wechat
    // but Wechat is quirky. The best way is to wrap everything in a section.
    
    const containerSection = document.createElement('section');
    containerSection.innerHTML = wrapper.innerHTML;
    containerSection.setAttribute('style', styleObjectToString(theme.container));
    
    // 3. Traverse and Inject
    const injectStyles = (element: Element) => {
        const tagName = element.tagName.toLowerCase();
        let styleToApply: CSSStyleSet | undefined;

        switch (tagName) {
            case 'h1': styleToApply = theme.h1; break;
            case 'h2': styleToApply = theme.h2; break;
            case 'h3': styleToApply = theme.h3; break;
            case 'h4': 
            case 'h5': 
            case 'h6': styleToApply = theme.h3; break; // Fallback
            case 'p': styleToApply = theme.p; break;
            case 'strong': 
            case 'b': styleToApply = theme.strong; break;
            case 'em': 
            case 'i': styleToApply = theme.em; break;
            case 'blockquote': styleToApply = theme.blockquote; break;
            case 'ul': styleToApply = theme.ul; break;
            case 'ol': styleToApply = theme.ol; break;
            case 'li': styleToApply = theme.li; break;
            case 'hr': styleToApply = theme.hr; break;
            case 'code': 
                // Check if inside pre
                if (element.parentElement?.tagName.toLowerCase() === 'pre') {
                    // Pre styling handles the block
                } else {
                    styleToApply = theme.code; 
                }
                break;
            case 'pre': styleToApply = theme.pre; break;
            case 'a': styleToApply = theme.link; break;
            case 'img': styleToApply = theme.image; break;
        }

        if (styleToApply) {
            const existingStyle = element.getAttribute('style') || '';
            const newStyle = styleObjectToString(styleToApply);
            element.setAttribute('style', existingStyle + newStyle);
        }

        // Recursively process children
        Array.from(element.children).forEach(child => injectStyles(child));
    };

    Array.from(containerSection.children).forEach(child => injectStyles(child));

    // Return the HTML of the section
    return containerSection.outerHTML;
};