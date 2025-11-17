#!/bin/bash
# 🖤 KOL HUB - Verify All Platform Builds
# ========================================

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║       🖤 KOL HUB - PLATFORM BUILD VERIFICATION 🖤             ║"
echo "║    'One hand on the keyboard, one hand on the altar'          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ Found: $1${NC}"
        return 0
    else
        echo -e "${RED}❌ Missing: $1${NC}"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅ Found: $1${NC}"
        return 0
    else
        echo -e "${RED}❌ Missing: $1${NC}"
        return 1
    fi
}

# Verification steps
total_checks=0
passed_checks=0

echo "=== Checking Core Files ==="
files=(
    "package.json"
    "vite.config.ts"
    "tsconfig.json"
    "tailwind.config.js"
    "index.html"
    "src/main.tsx"
    "src/App.tsx"
)

for file in "${files[@]}"; do
    ((total_checks++))
    if check_file "$file"; then
        ((passed_checks++))
    fi
done

echo ""
echo "=== Checking Build Directories ==="
dirs=(
    "src"
    "src/components"
    "src/services"
    "src/store"
    "src/utils"
    "public"
)

for dir in "${dirs[@]}"; do
    ((total_checks++))
    if check_dir "$dir"; then
        ((passed_checks++))
    fi
done

echo ""
echo "=== Checking Desktop Configuration ==="
((total_checks++))
if check_file "electron.js"; then
    ((passed_checks++))
fi

echo ""
echo "=== Checking Mobile Configuration ==="
files=(
    "capacitor.config.ts"
    "capacitor.config.json"
)

for file in "${files[@]}"; do
    ((total_checks++))
    if check_file "$file"; then
        ((passed_checks++))
    fi
done

((total_checks++))
if check_dir "android"; then
    ((passed_checks++))
fi

((total_checks++))
if check_dir "ios"; then
    ((passed_checks++))
fi

echo ""
echo "=== Checking Deployment Configuration ==="
files=(
    "netlify.toml"
    ".env.production"
)

for file in "${files[@]}"; do
    ((total_checks++))
    if check_file "$file"; then
        ((passed_checks++))
    fi
done

echo ""
echo "=== Checking Dependencies ==="
((total_checks++))
if check_dir "node_modules"; then
    ((passed_checks++))
fi

((total_checks++))
if check_file "package-lock.json"; then
    ((passed_checks++))
fi

# Calculate percentage
percentage=$((passed_checks * 100 / total_checks))

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    VERIFICATION RESULTS                        ║"
echo "╠════════════════════════════════════════════════════════════════╣"
printf "║  Checks Passed: %d / %d (%d%%)                                 ║\n" "$passed_checks" "$total_checks" "$percentage"
echo "╠════════════════════════════════════════════════════════════════╣"

if [ "$percentage" -eq 100 ]; then
    echo "║  Status: ${GREEN}✅ ALL SYSTEMS GO!${NC}                                  ║"
    echo "║  Ready to build and deploy across all platforms!          ║"
elif [ "$percentage" -ge 80 ]; then
    echo "║  Status: ${YELLOW}⚠️  MOSTLY READY${NC}                                   ║"
    echo "║  Some components missing, but core functionality intact    ║"
else
    echo "║  Status: ${RED}❌ NEEDS ATTENTION${NC}                                 ║"
    echo "║  Critical components missing, check above for details     ║"
fi

echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Provide next steps
if [ "$percentage" -eq 100 ]; then
    echo "🚀 NEXT STEPS:"
    echo "  1. Run: npm run build          (Web build)"
    echo "  2. Run: npm run build:desktop  (Desktop build)"
    echo "  3. Run: npx cap sync android   (Android sync)"
    echo "  4. Run: npx cap sync ios       (iOS sync)"
    echo "  5. Deploy: npm run deploy:netlify:windows"
elif [ "$percentage" -ge 80 ]; then
    echo "⚠️  RECOMMENDED ACTIONS:"
    echo "  1. Review missing files above"
    echo "  2. Run: npm install"
    echo "  3. Re-run this verification"
else
    echo "❌ REQUIRED ACTIONS:"
    echo "  1. Install dependencies: npm install"
    echo "  2. Check project structure"
    echo "  3. Re-run verification"
fi

echo ""
