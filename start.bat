@echo off
chcp 65001 >nul
echo 🚀 启动流式响应调试项目...
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

REM 检查npm是否安装
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到npm，请先安装npm
    pause
    exit /b 1
)

echo ✅ Node.js版本:
node --version
echo ✅ npm版本:
npm --version
echo.

REM 启动后端服务
echo 🔧 启动后端服务...
cd backend

if not exist "node_modules" (
    echo 📦 安装后端依赖...
    npm install
)

echo 🚀 启动后端服务 (端口: 3001)...
start "后端服务" cmd /k "npm run start:dev"

REM 等待后端服务启动
echo ⏳ 等待后端服务启动...
timeout /t 5 /nobreak >nul

REM 启动前端应用
echo.
echo 🎨 启动前端应用...
cd ..\frontend

if not exist "node_modules" (
    echo 📦 安装前端依赖...
    npm install
)

echo 🚀 启动前端应用 (端口: 3000)...
start "前端应用" cmd /k "npm start"

echo.
echo 🎉 项目启动完成!
echo.
echo 📱 前端应用: http://localhost:3000
echo 🔧 后端API: http://localhost:3001
echo 📚 API文档: http://localhost:3001/api
echo 💚 健康检查: http://localhost:3001/health
echo.
echo 服务已在新的命令行窗口中启动
echo 关闭对应的命令行窗口即可停止服务
echo.
pause
