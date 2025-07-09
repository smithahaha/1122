#!/bin/bash

# AI Assistant Platform 启动脚本
echo "🚀 Starting AI Assistant Platform..."

# 检查是否存在.env文件
if [ ! -f ".env" ]; then
    echo "⚠️  .env文件不存在，正在创建..."
    cp env.example .env
    echo "✅ 已创建.env文件，请编辑文件并添加您的API密钥"
    echo "📝 需要配置的API密钥："
    echo "   - OPENAI_API_KEY (OpenAI API密钥)"
    echo "   - GEMINI_API_KEY (Google Gemini API密钥)"
    echo "   - DEEPSEEK_API_KEY (DeepSeek API密钥)"
    echo ""
    echo "💡 配置完成后，请重新运行此脚本"
    exit 1
fi

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
fi

# 初始化数据库
echo "🗄️  正在初始化数据库..."
npx prisma generate
npx prisma db push

# 启动后端服务器
echo "🔧 正在启动后端服务器..."
npm run dev:server &
BACKEND_PID=$!

# 等待后端服务器启动
sleep 3

# 启动前端服务器
echo "🎨 正在启动前端服务器..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ 服务器启动成功！"
echo "🌐 前端地址: http://localhost:5173"
echo "⚡ 后端地址: http://localhost:3001"
echo ""
echo "按 Ctrl+C 停止服务器"

# 等待用户停止服务器
wait

# 清理进程
kill $BACKEND_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null

echo "🛑 服务器已停止" 