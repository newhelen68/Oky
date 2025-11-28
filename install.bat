@echo off
echo ========================================
echo Sistema RAG - Instalacion Completa
echo ========================================
echo.

REM Verificar Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado
    echo Por favor instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)

echo Node.js detectado: 
node --version
npm --version
echo.

echo [1/3] Instalando dependencias del backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo la instalacion del backend
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [2/3] Instalando dependencias del frontend...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo la instalacion del frontend
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [3/3] Configurando variables de entorno...
if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env"
    echo Archivo .env creado
) else (
    echo Archivo .env ya existe
)

echo.
echo ========================================
echo Instalacion completada!
echo ========================================
echo.
echo Proximos pasos:
echo 1. Edita backend\.env y agrega tu OPENAI_API_KEY
echo 2. Ejecuta start.bat para iniciar el sistema
echo.
pause
