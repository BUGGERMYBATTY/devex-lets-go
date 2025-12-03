
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Return only the base64 part, without the data URL prefix
          resolve(reader.result.split(',')[1]);
        } else {
          reject(new Error('Failed to read file as base64 string.'));
        }
      };
      reader.onerror = error => reject(error);
    });
};

export const removeBackground = (base64: string): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) { resolve(base64); return; }
            
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const width = canvas.width;
            const height = canvas.height;
            
            // 1. Determine Background Color
            // Check corners. If they are bright, assume Pure White to be safe against compression artifacts.
            let bgR = data[0], bgG = data[1], bgB = data[2];
            if (bgR > 200 && bgG > 200 && bgB > 200) {
                bgR = 255; bgG = 255; bgB = 255;
            }

            const tolerance = 60; // Increased tolerance for better removal

            const isSimilar = (r: number, g: number, b: number) => {
                return Math.abs(r - bgR) < tolerance && 
                       Math.abs(g - bgG) < tolerance && 
                       Math.abs(b - bgB) < tolerance;
            };

            const stack: number[] = [];
            const visited = new Uint8Array(width * height);
            
            const checkAndAdd = (x: number, y: number) => {
                if (x < 0 || x >= width || y < 0 || y >= height) return;
                const idx = y * width + x;
                if (visited[idx]) return;
                
                const r = data[idx * 4];
                const g = data[idx * 4 + 1];
                const b = data[idx * 4 + 2];
                
                if (isSimilar(r, g, b)) {
                    visited[idx] = 1;
                    stack.push(idx);
                }
            };

            // Start flood fill from all 4 corners to catch background even if character touches an edge
            const corners = [
                [0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]
            ];
            
            corners.forEach(([x, y]) => checkAndAdd(x, y));

            // Flood Fill
            while (stack.length > 0) {
                const idx = stack.pop()!;
                const dataIdx = idx * 4;
                
                // Set alpha to 0 (Transparent)
                data[dataIdx + 3] = 0; 

                const x = idx % width;
                const y = Math.floor(idx / width);

                checkAndAdd(x + 1, y);
                checkAndAdd(x - 1, y);
                checkAndAdd(x, y + 1);
                checkAndAdd(x, y - 1);
            }
            
            // 2. Halo / Edge Cleanup (Erosion)
            // This step removes light-colored pixels that are on the edge of the transparency.
            // It effectively "erodes" the white halo often left by simple flood fills.
            const pixelsToRemove: number[] = [];
            
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const idx = y * width + x;
                    const dataIdx = idx * 4;
                    
                    // If the pixel is still visible (alpha > 0)
                    if (data[dataIdx + 3] > 0) {
                        // Check if it borders a transparent pixel
                        let hasTransparentNeighbor = false;
                        const neighbors = [[x+1, y], [x-1, y], [x, y+1], [x, y-1]];
                        
                        for (const [nx, ny] of neighbors) {
                            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                const nIdx = (ny * width + nx) * 4;
                                if (data[nIdx + 3] === 0) {
                                    hasTransparentNeighbor = true;
                                    break;
                                }
                            }
                        }

                        // If it's an edge pixel, check if it's "light" (the halo)
                        if (hasTransparentNeighbor) {
                            const r = data[dataIdx];
                            const g = data[dataIdx + 1];
                            const b = data[dataIdx + 2];
                            const brightness = (r + g + b) / 3;
                            
                            // If it's a light pixel (white halo/antialiasing), remove it. 
                            // Keep dark pixels (the black outline).
                            if (brightness > 150) { 
                                pixelsToRemove.push(dataIdx);
                            }
                        }
                    }
                }
            }

            // Apply erosion
            for (const dataIdx of pixelsToRemove) {
                data[dataIdx + 3] = 0;
            }
            
            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(base64);
        img.src = base64;
    });
};
