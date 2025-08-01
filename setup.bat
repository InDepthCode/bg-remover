@echo off

echo 🚀 Setting up BackgroundAI project...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js detected

:: Install root dependencies
echo 📦 Installing root dependencies...
npm install

:: Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
npm install
cd ..

:: Install backend dependencies  
echo 📦 Installing backend dependencies...
cd backend
npm install
cd ..

:: Copy environment files
echo ⚙️  Setting up environment files...
if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env"
    echo ✅ Created backend\.env (please edit with your API keys)
)

if not exist "frontend\.env.local" (
    echo BACKEND_URL=http://localhost:3001 > "frontend\.env.local"
    echo ✅ Created frontend\.env.local
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Edit backend\.env and add your Remove.bg API key
echo 2. Run 'npm run dev' to start both frontend and backend
echo 3. Open http://localhost:3000 in your browser
echo.
echo Happy coding! 🚀
pause
