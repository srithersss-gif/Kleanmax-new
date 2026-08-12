const Jimp = require('jimp');
const path = require('path');

const imgPath = String.raw`C:\Users\guna0\.gemini\antigravity-ide\brain\a4b133de-4102-405e-b7e8-6e48ea9627dd\media__1786348465377.png`;
const outPath = path.join(process.cwd(), 'assets', 'images', 'logo.png');

Jimp.read(imgPath)
    .then(image => {
        let greenCounts = {};

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            
            // Remove white background (and close to white)
            if (r > 240 && g > 240 && b > 240) {
                this.bitmap.data[idx + 3] = 0; // alpha to 0
            } else if (this.bitmap.data[idx + 3] > 0) {
                // Collect colors that are 'greenish' (G > R and G > B) to find the primary brand color
                if (g > r + 20 && g > b + 20) {
                    const hex = '#' + [r, g, b].map(x => {
                        const h = x.toString(16);
                        return h.length === 1 ? '0' + h : h;
                    }).join('');
                    
                    greenCounts[hex] = (greenCounts[hex] || 0) + 1;
                }
            }
        });

        // Autocrop transparent borders
        image.autocrop();

        // Save
        image.write(outPath, () => {
            console.log('Saved transparent logo to', outPath);
            
            // Find most common green
            let maxCount = 0;
            let bestHex = null;
            for (const [hex, count] of Object.entries(greenCounts)) {
                if (count > maxCount) {
                    maxCount = count;
                    bestHex = hex;
                }
            }
            console.log('Primary brand green found:', bestHex);
        });
    })
    .catch(err => {
        console.error(err);
    });
