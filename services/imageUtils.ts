export interface ImagePalette {
    bgColor: string;
    brandColor: string;
    strongColor: string;
    isDark: boolean;
}

const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s, l];
};

const hslToRgbString = (h: number, s: number, l: number) => {
    // Simple helper if needed, but we usually return hex or keep rgb from source
    // For this utility, we'll return standard CSS strings
    return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

const colorDistance = (rgb1: number[], rgb2: number[]) => {
    return Math.sqrt(
        Math.pow(rgb1[0] - rgb2[0], 2) +
        Math.pow(rgb1[1] - rgb2[1], 2) +
        Math.pow(rgb1[2] - rgb2[2], 2)
    );
};

export const analyzeImage = (file: File): Promise<ImagePalette> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return resolve({ bgColor: '#ffffff', brandColor: '#000000', strongColor: '#333333', isDark: false });
                }

                // Downscale for performance
                const w = 100;
                const h = 100;
                canvas.width = w;
                canvas.height = h;
                ctx.drawImage(img, 0, 0, w, h);

                const imageData = ctx.getImageData(0, 0, w, h).data;
                const pixelCount = w * h;
                
                // 1. Bucket colors to find dominant tones
                const colorBuckets: { [key: string]: { count: number, rgb: number[], hsl: number[] } } = {};
                const quantization = 5; // Group similar colors

                for (let i = 0; i < imageData.length; i += 4) {
                    const r = imageData[i];
                    const g = imageData[i + 1];
                    const b = imageData[i + 2];
                    const a = imageData[i + 3];

                    if (a < 128) continue; // Skip transparent

                    // Round to nearest bucket
                    const rB = Math.round(r / quantization) * quantization;
                    const gB = Math.round(g / quantization) * quantization;
                    const bB = Math.round(b / quantization) * quantization;
                    
                    const key = `${rB},${gB},${bB}`;
                    if (!colorBuckets[key]) {
                        colorBuckets[key] = { count: 0, rgb: [rB, gB, bB], hsl: rgbToHsl(rB, gB, bB) };
                    }
                    colorBuckets[key].count++;
                }

                const sortedBuckets = Object.values(colorBuckets).sort((a, b) => b.count - a.count);
                
                // 2. Identify Background (Usually the most frequent, or very light/dark)
                // We prioritize very light (>0.85) or very dark (<0.15) if they are reasonably frequent
                let bgBucket = sortedBuckets[0];
                let isDark = false;
                
                // Try to find a "better" background if the top one is mid-tone
                const potentialBg = sortedBuckets.find(b => {
                    const l = b.hsl[2];
                    return (l > 0.8 || l < 0.2) && b.count > pixelCount * 0.1; // at least 10%
                });
                
                if (potentialBg) {
                    bgBucket = potentialBg;
                }

                isDark = bgBucket.hsl[2] < 0.5;
                const bgColor = `rgb(${bgBucket.rgb[0]}, ${bgBucket.rgb[1]}, ${bgBucket.rgb[2]})`;

                // 3. Identify Brand Color (High saturation, distinct from BG)
                let brandBucket = sortedBuckets.find(b => {
                    // Distinct from BG
                    const dist = colorDistance(b.rgb, bgBucket.rgb);
                    if (dist < 50) return false; 
                    // Good saturation
                    return b.hsl[1] > 0.3; 
                });

                // Fallback if no saturated color found
                if (!brandBucket) {
                    brandBucket = sortedBuckets.find(b => colorDistance(b.rgb, bgBucket.rgb) > 80) || sortedBuckets[0];
                }

                const brandColor = `rgb(${brandBucket.rgb[0]}, ${brandBucket.rgb[1]}, ${brandBucket.rgb[2]})`;

                // 4. Identify Strong/Accent Color (Distinct from both)
                let strongBucket = sortedBuckets.find(b => {
                    const distBg = colorDistance(b.rgb, bgBucket.rgb);
                    const distBrand = colorDistance(b.rgb, brandBucket!.rgb);
                    return distBg > 80 && distBrand > 50;
                });

                if (!strongBucket) {
                    // If dark mode, default strong is white; if light, black
                    strongBucket = { 
                        count: 0, 
                        rgb: isDark ? [255, 255, 255] : [0, 0, 0], 
                        hsl: isDark ? [0, 0, 1] : [0, 0, 0] 
                    };
                }
                
                const strongColor = `rgb(${strongBucket.rgb[0]}, ${strongBucket.rgb[1]}, ${strongBucket.rgb[2]})`;

                resolve({
                    bgColor,
                    brandColor,
                    strongColor,
                    isDark
                });
            };
            img.onerror = () => reject(new Error("Image load failed"));
            img.src = event.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};