@echo off
echo 🚀 Complete Store Rating App Setup
echo =====================================

echo.
echo 📦 Installing root dependencies...
npm install

echo.
echo 📦 Installing backend dependencies...
cd server
npm install

echo.
echo 📦 Installing frontend dependencies...
cd ../client
npm install

echo.
echo 🗄️ Setting up database...
cd ../server
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

echo.
echo ✅ Setup Complete!
echo.
echo 🌐 To start the application:
echo    npm run dev
echo.
echo 🔐 Demo Accounts:
echo    Admin:      admin@storeapp.com / Admin123!
echo    User:       john.smith@email.com / User123!
echo    Store Owner: sarah.johnson@email.com / User123!
echo.
echo 📝 Make sure PostgreSQL is running before starting!
pause
