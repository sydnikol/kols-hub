#!/bin/bash
echo "Cleaning old KolHub builds..."
rm -rf ~/KolHub* ~/Desktop/KolHub*
echo "Installing KolHub OS v3..."
npm install
npm run dev
