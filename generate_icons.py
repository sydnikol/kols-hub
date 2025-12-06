#!/usr/bin/env python3
"""Generate app icons in multiple sizes from source logo"""

from PIL import Image
import os

# Source logo path
source_logo = r"C:\Users\Asus User\OneDrive\Pictures\kols hub 2 (1) (1).png"

# Output directory
output_dir = r"C:\Users\Asus User\Desktop\unified-mega-app\public"

# Icon sizes needed for PWA
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

# Android icon sizes (for mipmap folders)
android_sizes = {
    'mdpi': 48,
    'hdpi': 72,
    'xhdpi': 96,
    'xxhdpi': 144,
    'xxxhdpi': 192
}

def resize_image(source_path, output_path, size):
    """Resize image to specified size"""
    try:
        img = Image.open(source_path)
        # Convert RGBA to RGB if saving as jpg, otherwise keep RGBA for png
        if img.mode == 'RGBA':
            # Create white background
            background = Image.new('RGBA', img.size, (255, 255, 255, 0))
            # Composite image on background
            img = Image.alpha_composite(background, img)

        # Resize with high-quality resampling
        img_resized = img.resize((size, size), Image.Resampling.LANCZOS)

        # Save the resized image
        img_resized.save(output_path, 'PNG', optimize=True)
        print(f"✓ Created {output_path} ({size}x{size})")
        return True
    except Exception as e:
        print(f"✗ Error creating {output_path}: {e}")
        return False

def main():
    print("=" * 60)
    print("KOLS HUB LOGO - Icon Generator")
    print("=" * 60)
    print(f"\nSource: {source_logo}")
    print(f"Output: {output_dir}\n")

    # Check if source file exists
    if not os.path.exists(source_logo):
        print(f"Error: Source logo not found at {source_logo}")
        return

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Generate PWA icons
    print("Generating PWA Icons:")
    print("-" * 60)
    success_count = 0
    for size in sizes:
        output_path = os.path.join(output_dir, f"icon-{size}.png")
        if resize_image(source_logo, output_path, size):
            success_count += 1

    print(f"\n✓ Successfully generated {success_count}/{len(sizes)} PWA icons\n")

    # Generate Android icons
    print("Generating Android Icons:")
    print("-" * 60)
    android_base = r"C:\Users\Asus User\Desktop\unified-mega-app\android\app\src\main\res"

    if os.path.exists(android_base):
        android_success = 0
        for density, size in android_sizes.items():
            mipmap_dir = os.path.join(android_base, f"mipmap-{density}")
            os.makedirs(mipmap_dir, exist_ok=True)

            # Generate main launcher icon
            output_path = os.path.join(mipmap_dir, "ic_launcher.png")
            if resize_image(source_logo, output_path, size):
                android_success += 1

            # Generate foreground icon (same as main for now)
            output_path_fg = os.path.join(mipmap_dir, "ic_launcher_foreground.png")
            if resize_image(source_logo, output_path_fg, size):
                android_success += 1

            # Generate round icon
            output_path_round = os.path.join(mipmap_dir, "ic_launcher_round.png")
            if resize_image(source_logo, output_path_round, size):
                android_success += 1

        print(f"\n✓ Successfully generated {android_success}/{len(android_sizes) * 3} Android icons\n")
    else:
        print(f"⚠ Android directory not found: {android_base}\n")

    # Copy original logo as well
    original_copy = os.path.join(output_dir, "logo.png")
    try:
        img = Image.open(source_logo)
        img.save(original_copy, 'PNG')
        print(f"✓ Copied original logo to {original_copy}")
    except Exception as e:
        print(f"✗ Error copying original: {e}")

    print("\n" + "=" * 60)
    print("Icon generation complete!")
    print("=" * 60)

if __name__ == "__main__":
    main()
