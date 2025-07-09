#!/bin/bash

# aitars.io 一键部署脚本
# 在DigitalOcean服务器上运行: bash <(curl -s https://raw.githubusercontent.com/yourusername/ai-assistant/main/deploy-config/quick-deploy.sh)

set -e

echo "🚀 开始部署 aitars.io..."
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

# 更新系统
echo -e "${GREEN}📦 更新系统包...${NC}"
apt update && apt upgrade -y

# 安装必要软件
echo -e "${GREEN}🔧 安装必要软件...${NC}"
apt install -y curl wget git nginx certbot python3-certbot-nginx ufw htop

# 安装Node.js 18
echo -e "${GREEN}📦 安装Node.js...${NC}"
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
mkdir -p /var/www/aitars
cd /var/www/aitars

# 克隆项目 (需要用户提供GitHub仓库地址)
echo -e "${YELLOW}⚠️  请确保你的代码已上传到GitHub！${NC}"
echo -e "${YELLOW}请输入你的GitHub仓库地址 (例: https://github.com/username/ai-assistant.git):${NC}"
read -p "GitHub仓库地址: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo -e "${RED}❌ 仓库地址不能为空${NC}"
    exit 1
fi

echo -e "${GREEN}📥 克隆项目...${NC}"
git clone "$REPO_URL" .

# 安装依赖
echo -e "${GREEN}📦 安装项目依赖...${NC}"
npm install

# 配置环境变量
echo -e "${GREEN}🔧 配置环境变量...${NC}"
if [ -f "deploy-config/production.env" ]; then
    cp deploy-config/production.env .env
    echo -e "${GREEN}✅ 环境变量配置完成${NC}"
else
    echo -e "${YELLOW}⚠️  未找到生产环境配置文件，请手动创建 .env 文件${NC}"
fi

# 生成Prisma客户端
echo -e "${GREEN}🗄️ 配置数据库...${NC}"
npx prisma generate
npx prisma db push

# 构建前端
echo -e "${GREEN}🏗️ 构建前端应用...${NC}"
npm run build

# 配置Nginx
echo -e "${GREEN}🌐 配置Nginx...${NC}"
cat > /etc/nginx/sites-available/aitars.io << 'EOF'
server {
    listen 80;
    server_name aitars.io www.aitars.io;
    
    # API代理
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 前端静态文件
    location / {
        root /var/www/aitars/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
        
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
}
EOF

# 启用站点
ln -sf /etc/nginx/sites-available/aitars.io /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试配置
nginx -t

# 重启Nginx
systemctl restart nginx
systemctl enable nginx

# 创建PM2配置
echo -e "${GREEN}⚙️ 配置PM2...${NC}"
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'aitars-backend',
    script: 'npx tsx server/index.ts',
    cwd: '/var/www/aitars',
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
systemctl status nginx --no-pager

echo -e "${GREEN}=================================="
echo -e "✅ 基础部署完成！"
echo -e "=================================="
echo ""
echo -e "${YELLOW}📋 下一步操作:${NC}"
echo ""
echo -e "1. ${YELLOW}配置域名DNS:${NC}"
echo "   - 将 aitars.io 的A记录指向 138.197.99.117"
echo "   - 将 www.aitars.io 的A记录指向 138.197.99.117"
echo ""
echo -e "2. ${YELLOW}配置SSL证书:${NC}"
echo "   certbot --nginx -d aitars.io -d www.aitars.io"
echo ""
echo -e "3. ${YELLOW}测试访问:${NC}"
echo "   - http://aitars.io"
echo "   - http://138.197.99.117"
echo ""
echo -e "4. ${YELLOW}查看日志:${NC}"
echo "   pm2 logs aitars-backend"
echo ""
echo -e "5. ${YELLOW}重启服务:${NC}"
echo "   pm2 restart aitars-backend"
echo ""
echo -e "${GREEN}🎉 部署完成！访问 https://aitars.io 查看你的应用${NC}" 