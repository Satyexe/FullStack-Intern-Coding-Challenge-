@echo off
echo 🚀 Setting up Store Rating Application...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

echo ✅ Docker is running

REM Build and start the application
echo 📦 Building and starting containers...
docker-compose up --build -d

REM Wait for database to be ready
echo ⏳ Waiting for database to be ready...
timeout /t 10 /nobreak >nul

REM Run migrations
echo 🗄️ Running database migrations...
docker-compose exec backend npx sequelize-cli db:migrate

REM Seed the database
echo 🌱 Seeding database with demo data...
docker-compose exec backend npx sequelize-cli db:seed:all

echo ✅ Setup complete!
echo.
echo 🌐 Application URLs:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo.
echo 🔐 Demo Accounts:
echo    Admin:      admin@storeapp.com / Admin123!
echo    User:       john.smith@email.com / User123!
echo    Store Owner: sarah.johnson@email.com / User123!
echo.
echo 📝 To stop the application, run: docker-compose down
echo 📝 To view logs, run: docker-compose logs -f
pause

