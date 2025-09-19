@echo off
echo 🚀 Starting Store Rating Application
echo ====================================

echo.
echo 🔧 Starting backend server...
start "Backend Server" cmd /k "cd server && npm run dev"

echo.
echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo 🎨 Starting frontend server...
start "Frontend Server" cmd /k "cd client && npm start"

echo.
echo ✅ Application Starting!
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5000
echo.
echo 🔐 Demo Accounts:
echo    Admin:      admin@storeapp.com / Admin123!
echo    User:       john.smith@email.com / User123!
echo    Store Owner: sarah.johnson@email.com / User123!
echo.
echo 📝 Both servers are starting in separate windows...
pause
