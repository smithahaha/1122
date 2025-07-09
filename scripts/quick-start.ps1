# 个人AI助理项目 - 快速启动脚本
# 使用方法: 在项目根目录运行 .\scripts\quick-start.ps1

Write-Host "🚀 启动个人AI助理项目..." -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Yellow

# 检查是否在项目根目录
if (!(Test-Path "package.json")) {
    Write-Host "❌ 错误: 请在项目根目录运行此脚本" -ForegroundColor Red
    exit 1
}

# 检查Node.js
Write-Host "🔍 检查Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 错误: 请先安装Node.js" -ForegroundColor Red
    exit 1
}

# 检查依赖
Write-Host "🔍 检查依赖..." -ForegroundColor Cyan
if (!(Test-Path "node_modules")) {
    Write-Host "📦 安装依赖..." -ForegroundColor Yellow
    npm install
}

# 检查环境变量
Write-Host "🔍 检查环境变量..." -ForegroundColor Cyan
if (!(Test-Path ".env")) {
    Write-Host "📝 创建.env文件..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
}

# 检查数据库
Write-Host "🔍 检查数据库..." -ForegroundColor Cyan
if (!(Test-Path "dev.db")) {
    Write-Host "🗄️ 初始化数据库..." -ForegroundColor Yellow
    npx prisma db push
}

# 检查端口占用
Write-Host "🔍 检查端口占用..." -ForegroundColor Cyan
$backend_port = netstat -an | findstr "3001"
$frontend_port = netstat -an | findstr "5174"

if ($backend_port) {
    Write-Host "✅ 后端服务器已运行 (端口3001)" -ForegroundColor Green
} else {
    Write-Host "🚀 启动后端服务器..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$pwd'; npx tsx server/index.ts"
    Start-Sleep -Seconds 3
}

if ($frontend_port) {
    Write-Host "✅ 前端服务器已运行 (端口5174)" -ForegroundColor Green
} else {
    Write-Host "🚀 启动前端服务器..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$pwd'; npm run dev"
    Start-Sleep -Seconds 3
}

Write-Host "=" * 50 -ForegroundColor Yellow
Write-Host "🎉 项目启动完成!" -ForegroundColor Green
Write-Host "📱 前端地址: http://localhost:5174" -ForegroundColor Cyan
Write-Host "🔧 后端地址: http://localhost:3001" -ForegroundColor Cyan
Write-Host "🩺 健康检查: http://localhost:3001/health" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Yellow

Write-Host "💡 提示:" -ForegroundColor Yellow
Write-Host "- 首次使用请注册新用户" -ForegroundColor White
Write-Host "- 查看 PROJECT_STATUS.md 了解开发进度" -ForegroundColor White
Write-Host "- 按 Ctrl+C 停止服务器" -ForegroundColor White 