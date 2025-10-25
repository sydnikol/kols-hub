@echo off
echo Cleaning old KolHub builds...
rmdir /s /q "%USERPROFILE%\Desktop\KolHub*"
echo Installing KolHub OS v3...
npm install
npm run dev
pause
