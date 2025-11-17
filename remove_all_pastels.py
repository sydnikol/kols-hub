#!/usr/bin/env python3
"""
🖤 REMOVE ALL PASTELS - Gothic Futurism Color Purge
===================================================
Systematically removes pink, yellow, cyan, and all pastel colors
from the KOL Hub unified-mega-app and replaces with deep gothic tones.

Target colors to REMOVE:
- pink, rose, fuchsia
- yellow, amber, lime
- cyan, sky, teal
- Any light/pastel variants

Replacement colors (Gothic Futurism):
- purple → Deep purple (#6b00b3, #7c3aed)
- indigo → Deep indigo (#4f46e5, #3730a3)
- blue → Deep blue (#0284c7, #0369a1)
- red → Deep crimson (#7f1d1d, #b91c1c)
- green → Deep emerald (#047857, #059669)
- violet → Deep violet (#6b21a8, #7c3aed)
"""

import os
import re
from pathlib import Path

# Gothic color mapping
COLOR_REPLACEMENTS = {
    # Pink/Rose/Fuchsia → Purple
    'pink': 'purple',
    'rose': 'purple',    'fuchsia': 'purple',
    'from-pink': 'from-purple',
    'to-pink': 'to-purple',
    'bg-pink': 'bg-purple',
    'text-pink': 'text-purple',
    'border-pink': 'border-purple',
    'hover:bg-pink': 'hover:bg-purple',
    'hover:text-pink': 'hover:text-purple',
    
    # Yellow/Amber/Lime → Indigo or Green
    'yellow': 'indigo',
    'amber': 'indigo', 
    'lime': 'green',
    'from-yellow': 'from-indigo',
    'to-yellow': 'to-indigo',
    'bg-yellow': 'bg-indigo',
    'text-yellow': 'text-indigo',
    'border-yellow': 'border-indigo',
    'hover:bg-yellow': 'hover:bg-indigo',
    'hover:text-yellow': 'hover:text-indigo',
    
    # Cyan/Sky/Teal → Blue or Indigo
    'cyan': 'blue',
    'sky': 'blue',
    'teal': 'blue',
    'from-cyan': 'from-blue',
    'to-cyan': 'to-blue',
    'bg-cyan': 'bg-blue',
    'text-cyan': 'text-blue',
    'border-cyan': 'border-blue',
    'hover:bg-cyan': 'hover:bg-blue',
    'hover:text-cyan': 'hover:text-blue',
}

# Hex code replacements (light colors → dark)
HEX_REPLACEMENTS = {
    # Pink/light reds
    r'#ff\w{4}': '#7f1d1d',  # ff + 4 chars
    r'#ff\w{6}': '#7f1d1d',  # ff + 6 chars
    r'#f[a-f][a-f0-9]{5}': '#6b00b3',  # Light colors starting with f
    r'#f[a-f][a-f0-9]{7}': '#6b00b3',
    
    # Yellow/light oranges  
    r'#ff[cd]\w{3}': '#b45309',  # ffc, ffd yellows
    r'#ff[cd]\w{5}': '#b45309',
    
    # Light blues/cyans
    r'#[0-9a-f][a-d]ff': '#0284c7',  # Cyan-ish
}

def replace_colors_in_file(filepath):
    """Replace pastel/light colors with gothic theme colors"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        modified = False
        
        # Replace color names
        for old_color, new_color in COLOR_REPLACEMENTS.items():
            if old_color in content:
                content = content.replace(old_color, new_color)
                modified = True
        
        # Replace hex codes
        for pattern, replacement in HEX_REPLACEMENTS.items():
            if re.search(pattern, content, re.IGNORECASE):
                content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
                modified = True
        
        # Save if modified
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, filepath
        
        return False, None
        
    except Exception as e:
        print(f"❌ Error processing {filepath}: {e}")
        return False, None

def scan_and_replace(root_dir):
    """Scan all relevant files and replace colors"""
    extensions = ['.tsx', '.jsx', '.ts', '.js', '.css', '.json']
    exclude_dirs = ['node_modules', 'dist', 'build', '.git', 'android', 'ios']
    
    modified_files = []
    total_files = 0
    
    print("🖤 KOL HUB - Pastel Color Purge")
    print("=" * 50)
    print("Scanning for pink, yellow, cyan, and pastels...")
    print()
    
    for root, dirs, files in os.walk(root_dir):
        # Skip excluded directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                filepath = os.path.join(root, file)
                total_files += 1
                
                modified, path = replace_colors_in_file(filepath)
                if modified:
                    modified_files.append(path)
                    print(f"✅ {os.path.relpath(path, root_dir)}")
    
    print()
    print("=" * 50)
    print(f"📊 Results:")
    print(f"   Total files scanned: {total_files}")
    print(f"   Files modified: {len(modified_files)}")
    print()
    print("🖤 Gothic futurism theme applied!")
    print("   All pastels replaced with deep tones")
    print("   Purple/Indigo/Blue/Crimson/Emerald only")

if __name__ == "__main__":
    project_root = Path(__file__).parent
    scan_and_replace(project_root)
