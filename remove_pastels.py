import json
import re
import os

def is_pastel_or_light_color(hex_color):
    """Check if a color is pastel (high lightness) or contains yellow/pink"""
    if not hex_color:
        return False
    hex_color = hex_color.lstrip('#')
    if len(hex_color) != 6:
        return False
    
    try:
        # Convert hex to RGB
        r = int(hex_color[0:2], 16)
        g = int(hex_color[2:4], 16)
        b = int(hex_color[4:6], 16)
        
        # Calculate lightness
        max_val = max(r, g, b) / 255
        min_val = min(r, g, b) / 255
        lightness = (max_val + min_val) / 2
        
        # Check for yellow
        is_yellow = r > 180 and g > 180 and b < 150
        
        # Check for pink
        is_pink = r > 180 and g < 180 and b > 100
        
        # Pastel = lightness > 0.7
        is_pastel = lightness > 0.7
        
        return is_pastel or is_yellow or is_pink
    except:
        return False

def darken_color(hex_color, factor=0.5):
    """Darken a color"""
    hex_color = hex_color.lstrip('#')
    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)
    
    r = int(r * factor)
    g = int(g * factor)
    b = int(b * factor)
    
    return f"#{r:02x}{g:02x}{b:02x}"

def process_themes_file(filepath):
    """Process themes file"""
    if not os.path.exists(filepath):
        print(f"⚠️ {filepath} not found")
        return 0, 0, 0
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    removed_count = 0
    darkened_count = 0
    
    if 'themes' in data:
        filtered_themes = []
        for theme in data['themes']:
            colors_to_check = ['primary', 'secondary', 'accent', 'text', 'background']
            
            for color_field in colors_to_check:
                if color_field in theme:
                    color = theme[color_field]
                    if is_pastel_or_light_color(color):
                        theme[color_field] = darken_color(color, factor=0.4)
                        darkened_count += 1
            
            aesthetic = theme.get('aesthetic', '').lower()
            bad_words = ['pastel', 'light', 'soft pink', 'baby', 'pale', 'cream', 'peach', 'coral', 'yellow', 'golden', 'sunny', 'lemon', 'butter', 'honey']
            if any(word in aesthetic for word in bad_words):
                removed_count += 1
                continue
            
            filtered_themes.append(theme)
        
        data['themes'] = filtered_themes
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    return len(data.get('themes', [])), removed_count, darkened_count

# Process theme files
base_path = os.path.dirname(os.path.abspath(__file__))
files = [
    'src/data/gothic-themes-100.json',
    'src/data/gothic-themes.json',
    'src/data/alt-goth-themes-100.json'
]

print("🎨 Removing pink, yellow, and pastel colors...")
for filepath in files:
    full_path = os.path.join(base_path, filepath)
    try:
        remaining, removed, darkened = process_themes_file(full_path)
        print(f"✅ {filepath}:")
        print(f"   Kept: {remaining} themes")
        print(f"   Removed: {removed} themes")
        print(f"   Darkened: {darkened} colors")
    except Exception as e:
        print(f"❌ Error: {filepath}: {e}")

print("\n✅ Color removal complete!")
