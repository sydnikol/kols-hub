#!/usr/bin/env python3
"""
COMPREHENSIVE COLOR FIX - Remove ALL Pink/Yellow/Cyan/Pastels
"""
import os
import re

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        original = content
        
        # Fix all color class names
        replacements = [
            # Pink -> Purple/Indigo
            ('text-pink-', 'text-purple-'),
            ('bg-pink-', 'bg-purple-'),
            ('from-pink-', 'from-purple-'),
            ('to-pink-', 'to-purple-'),
            ('border-pink-', 'border-purple-'),
            
            # Yellow -> Indigo
            ('text-yellow-', 'text-indigo-'),
            ('bg-yellow-', 'bg-indigo-'),
            ('from-yellow-', 'from-indigo-'),
            ('to-yellow-', 'to-indigo-'),
            
            # Cyan/Sky/Teal -> Blue
            ('text-cyan-', 'text-blue-'),
            ('bg-cyan-', 'bg-blue-'),
            ('from-cyan-', 'from-blue-'),
            ('to-cyan-', 'to-blue-'),
            ('text-sky-', 'text-blue-'),
            ('bg-sky-', 'bg-blue-'),
            ('text-teal-', 'text-blue-'),
            ('bg-teal-', 'bg-blue-'),
            
            # Rose -> Purple
            ('text-rose-', 'text-purple-'),
            ('bg-rose-', 'bg-purple-'),
            
            # Amber -> Indigo
            ('text-amber-', 'text-indigo-'),
            ('bg-amber-', 'bg-indigo-'),
            
            # Lime -> Green
            ('text-lime-', 'text-green-'),
            ('bg-lime-', 'bg-green-'),
            
            # Fuchsia -> Purple
            ('text-fuchsia-', 'text-purple-'),
            ('bg-fuchsia-', 'bg-purple-'),
        ]
        
        for old, new in replacements:
            content = content.replace(old, new)
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except Exception as e:
        print(f"Error with {filepath}: {e}")
        return False

def main():
    root_dir = r'C:\Users\Asus User\Desktop\unified-mega-app\src'
    modified = []
    
    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist']]
        
        for file in files:
            if file.endswith(('.tsx', '.ts', '.jsx', '.js', '.css')):
                filepath = os.path.join(root, file)
                if fix_file(filepath):
                    rel_path = os.path.relpath(filepath, root_dir)
                    modified.append(rel_path)
                    print(f"Fixed: {rel_path}")
    
    print(f"\n Total files modified: {len(modified)}")

if __name__ == "__main__":
    main()
