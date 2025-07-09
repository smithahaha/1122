#!/bin/bash

# aitars.io 完整部署脚本
# 在DigitalOcean服务器上运行

set -e

echo "🚀 开始部署 aitars.io 到生产环境..."
echo "=================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}请使用root用户运行此脚本${NC}"
    exit 1
fi

# 设置变量
DOMAIN="aitars.io"
APP_DIR="/var/www/aitars"
GITHUB_REPO="https://github.com/yourusername/ai-assistant.git"  # 需要替换为实际仓库地址

# 更新系统
echo -e "${GREEN}📦 更新系统包...${NC}"
apt update && apt upgrade -y

# 安装必要软件
echo -e "${GREEN}🔧 安装必要软件...${NC}"
apt install -y curl wget git nginx certbot python3-certbot-nginx ufw htop vim

# 安装Node.js 18
echo -e "${GREEN}📦 安装Node.js 18...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# 验证安装
echo -e "${GREEN}✅ 验证安装版本...${NC}"
node --version
npm --version

# 安装PM2
echo -e "${GREEN}📦 安装PM2...${NC}"
npm install -g pm2

# 配置防火墙
echo -e "${GREEN}🔥 配置防火墙...${NC}"
ufw --force enable
ufw allow ssh
ufw allow 80
ufw allow 443

# 创建应用目录
echo -e "${GREEN}📁 创建应用目录...${NC}"
mkdir -p $APP_DIR
cd $APP_DIR

# 提示用户输入GitHub仓库地址
echo -e "${YELLOW}请输入您的GitHub仓库地址:${NC}"
read -p "GitHub URL: " GITHUB_REPO

if [ -z "$GITHUB_REPO" ]; then
    echo -e "${RED}❌ 仓库地址不能为空${NC}"
    exit 1
fi

# 克隆项目
echo -e "${GREEN}📥 克隆项目...${NC}"
git clone "$GITHUB_REPO" .

# 安装依赖
echo -e "${GREEN}📦 安装项目依赖...${NC}"
npm install

# 配置环境变量
echo -e "${GREEN}🔧 配置环境变量...${NC}"
if [ -f "deploy-config/production.env" ]; then
    cp deploy-config/production.env .env
    echo -e "${GREEN}✅ 环境变量配置完成${NC}"
else
    echo -e "${YELLOW}⚠️  未找到生产环境配置文件，创建默认配置${NC}"
    cat > .env << EOF
NODE_ENV=production
PORT=3001
HOST=0.0.0.0
CORS_ORIGIN=https://$DOMAIN
JWT_SECRET=your-super-strong-jwt-secret-for-production-please-change-this-256-bits
DATABASE_URL=file:./data/prod.db
OPENAI_API_KEY=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
GEMINI_API_KEY=AIzaSyA7qK0tpNrJIVRESeFfaLUhYJni5H7VTH0
DEEPSEEK_API_KEY=sk-71778916058c42ffafe2bc29f0240f8a
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
TRANSLATE_PROVIDER=openai
TRANSLATE_API_KEY=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
CACHE_TTL=3600
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
DOMAIN=$DOMAIN
EOF
fi

# 创建数据目录
mkdir -p data

# 生成Prisma客户端
echo -e "${GREEN}🗄️ 配置数据库...${NC}"
npx prisma generate
npx prisma db push

# 构建前端
echo -e "${GREEN}🏗️ 构建前端应用...${NC}"
npm run build

# 配置Nginx
echo -e "${GREEN}🌐 配置Nginx...${NC}"
cat > /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # API代理
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # 健康检查
    location /health {
        proxy_pass http://localhost:3001/health;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # 前端静态文件
    location / {
        root $APP_DIR/dist;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
        
        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

# 启用站点
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试配置
nginx -t

# 重启Nginx
systemctl restart nginx
systemctl enable nginx

# 创建PM2配置
echo -e "${GREEN}⚙️ 配置PM2...${NC}"
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'aitars-backend',
    script: 'npx tsx server/index.ts',
    cwd: '$APP_DIR',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/pm2/aitars-error.log',
    out_file: '/var/log/pm2/aitars-out.log',
    log_file: '/var/log/pm2/aitars.log'
  }]
}
EOF

# 创建日志目录
mkdir -p /var/log/pm2

# 启动应用
echo -e "${GREEN}🚀 启动后端服务...${NC}"
pm2 start ecosystem.config.js
pm2 save
pm2 startup --update-env

# 检查服务状态
echo -e "${GREEN}📊 检查服务状态...${NC}"
pm2 status
systemctl status nginx --no-pager -l

# 测试API健康检查
echo -e "${GREEN}🏥 测试API健康检查...${NC}"
sleep 3
curl -s http://localhost:3001/health || echo "API暂时不可用，请检查日志"

echo -e "${GREEN}=================================="
echo -e "✅ 基础部署完成！"
echo -e "=================================="
echo ""
echo -e "${YELLOW}📋 下一步操作:${NC}"
echo ""
echo -e "1. ${YELLOW}确认域名DNS已配置:${NC}"
echo "   - 将 $DOMAIN 的A记录指向 138.197.99.117"
echo "   - 将 www.$DOMAIN 的A记录指向 138.197.99.117"
echo ""
echo -e "2. ${YELLOW}等待DNS生效后配置SSL证书:${NC}"
echo "   certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo -e "3. ${YELLOW}测试访问:${NC}"
echo "   - http://$DOMAIN"
echo "   - http://138.197.99.117"
echo ""
echo -e "4. ${YELLOW}查看日志:${NC}"
echo "   pm2 logs aitars-backend"
echo ""
echo -e "5. ${YELLOW}重启服务:${NC}"
echo "   pm2 restart aitars-backend"
echo "   systemctl restart nginx"
echo ""
echo -e "${GREEN}🎉 部署完成！访问 http://$DOMAIN 查看您的应用${NC}" 