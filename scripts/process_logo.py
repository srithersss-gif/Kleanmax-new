from PIL import Image
import os

img_path = r'C:\Users\guna0\.gemini\antigravity-ide\brain\a4b133de-4102-405e-b7e8-6e48ea9627dd\media__1786348465377.png'
out_path = r'c:\Users\guna0\Downloads\kleanmax\assets\images\logo.png'

# Create dir if not exists
os.makedirs(os.path.dirname(out_path), exist_ok=True)

img = Image.open(img_path).convert('RGBA')
datas = img.getdata()

newData = []
# Make white pixels transparent
for item in datas:
    # If the pixel is white or very close to white, make it transparent
    if item[0] > 240 and item[1] > 240 and item[2] > 240:
        newData.append((255, 255, 255, 0))
    else:
        newData.append(item)

img.putdata(newData)

# Crop the image to remove empty space
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

img.save(out_path, 'PNG')
print(f'Saved transparent logo to {out_path}')

# Find dominant colors (simple approach)
colors = img.getcolors(maxcolors=1000000)
# Filter out transparent and grayish colors
valid_colors = [c for c in colors if c[1][3] > 200 and not (abs(c[1][0] - c[1][1]) < 10 and abs(c[1][1] - c[1][2]) < 10)]
# Sort by frequency
valid_colors.sort(key=lambda x: x[0], reverse=True)
for i in range(min(5, len(valid_colors))):
    r, g, b, a = valid_colors[i][1]
    hex_color = '#{:02x}{:02x}{:02x}'.format(r, g, b)
    print(f'Color {i}: {hex_color} (Count: {valid_colors[i][0]})')
