@echo off
echo ========================================
echo Sistema RAG - Inicio Rapido
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

echo [1/6] Node.js detectado: 
node --version
echo.

REM Verificar si ya estan instaladas las dependencias
if not exist "backend\node_modules" (
    echo [2/6] Instalando dependencias del backend...
    cd backend
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Fallo la instalacion de dependencias del backend
        pause
        exit /b 1
    )
    cd ..
) else (
    echo [2/6] Dependencias del backend ya instaladas
)

echo.

if not exist "frontend\node_modules" (
    echo [3/6] Instalando dependencias del frontend...
    cd frontend
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Fallo la instalacion de dependencias del frontend
        pause
        exit /b 1
    )
    cd ..
) else (
    echo [3/6] Dependencias del frontend ya instaladas
)

echo.

REM Verificar archivo .env
if not exist "backend\.env" (
    echo [4/6] Creando archivo .env...
    copy "backend\.env.example" "backend\.env"
    echo.
    echo IMPORTANTE: Edita backend\.env y agrega tu OPENAI_API_KEY
    echo Presiona cualquier tecla cuando hayas configurado la API key...
    pause >nul
) else (
    echo [4/6] Archivo .env ya existe
)

echo.
echo [5/6] Iniciando backend en puerto 5000...
start "Backend RAG" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo [6/6] Iniciando frontend en puerto 5173...
start "Frontend RAG" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Sistema iniciado exitosamente!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Presiona Ctrl+C en cada ventana para detener
echo.
pause
