# DigitalOcean部署指南 - aitars.io

## 📋 部署信息确认
- **服务器IP**: 138.197.99.117
- **域名**: aitars.io
- **用户**: root
- **服务器规格**: newpp-2c4g (2vCPU, 4GB RAM)

## 🚀 完整部署步骤

### 第一步：连接服务器
```bash
# 使用SSH连接服务器
ssh root@138.197.99.117

# 输入密码：20f1d493d1f54c83e48228084f
```

### 第二步：服务器初始化
```bash
# 更新系统
apt update && apt upgrade -y

# 安装必要软件
apt install -y curl wget git nginx certbot python3-certbot-nginx ufw

# 安装Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# 安装Docker和Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt install -y docker-compose-plugin

# 验证安装
node --version
npm --version
docker --version
docker compose version
```

### 第三步：安全配置 (重要!)
```bash
# 配置防火墙
ufw enable
ufw allow ssh
ufw allow 80
ufw allow 443

# 创建新的sudo用户 (推荐)
adduser deploy
usermod -aG sudo deploy
usermod -aG docker deploy

# 生成SSH密钥对 (在本地执行)
# ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
# ssh-copy-id deploy@138.197.99.117
```

### 第四步：部署应用
```bash
# 创建应用目录
mkdir -p /var/www/aitars
cd /var/www/aitars

# 克隆你的项目 (需要先上传到GitHub)
git clone https://github.com/yourusername/ai-assistant.git .

# 安装依赖
npm install

# 复制生产环境配置
cp deploy-config/production.env .env

# 生成Prisma客户端
npx prisma generate

# 构建前端
npm run build
```

### 第五步：配置Nginx
```bash
# 创建Nginx配置文件
cat > /etc/nginx/sites-available/aitars.io << 'EOF'
server {
    listen 80;
    server_name aitars.io www.aitars.io;
    
    # 临时重定向到HTTPS (SSL配置后启用)
    # return 301 https://$server_name$request_uri;
    
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
ln -s /etc/nginx/sites-available/aitars.io /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试配置
nginx -t

# 重启Nginx
systemctl restart nginx
systemctl enable nginx
```

### 第六步：配置SSL证书
```bash
# 确保域名已指向服务器IP
# 在域名控制台将 aitars.io 和 www.aitars.io 的A记录指向 138.197.99.117

# 获取SSL证书
certbot --nginx -d aitars.io -d www.aitars.io

# 设置自动续期
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

### 第七步：启动后端服务
```bash
# 使用PM2管理进程
npm install -g pm2

# 初始化数据库
npx prisma db push

# 创建PM2配置文件
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

# 启动应用
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 查看状态
pm2 status
pm2 logs aitars-backend
```

### 第八步：域名DNS配置
在你的域名提供商控制台添加以下记录：
```
类型: A
名称: @
值: 138.197.99.117
TTL: 300

类型: A  
名称: www
值: 138.197.99.117
TTL: 300
```

### 第九步：验证部署
```bash
# 检查服务状态
pm2 status
systemctl status nginx
systemctl status certbot.timer

# 检查端口占用
netstat -tlnp | grep :80
netstat -tlnp | grep :443
netstat -tlnp | grep :3001

# 测试API
curl -I http://localhost:3001/health
curl -I https://aitars.io/health

# 查看日志
pm2 logs aitars-backend
tail -f /var/log/nginx/access.log
```

## 🔧 故障排除

### 常见问题

1. **端口3001被占用**
```bash
lsof -ti:3001 | xargs kill -9
pm2 restart aitars-backend
```

2. **Nginx配置错误**  
```bash
nginx -t
tail -f /var/log/nginx/error.log
```

3. **SSL证书问题**
```bash
certbot certificates
certbot renew --dry-run
```

4. **数据库连接问题**
```bash
cd /var/www/aitars
npx prisma db push
pm2 restart aitars-backend
```

## 📊 监控和维护

### 1. 设置监控
```bash
# 安装htop查看系统状态
apt install htop

# 查看系统资源
htop
df -h
free -h
```

### 2. 日志管理
```bash
# 查看应用日志
pm2 logs aitars-backend --lines 100

# 查看Nginx日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# 清理日志
pm2 flush
```

### 3. 备份策略
```bash
# 创建自动备份脚本
cat > /var/www/aitars/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/aitars"
mkdir -p $BACKUP_DIR

# 备份数据库
cp /var/www/aitars/dev.db $BACKUP_DIR/database_$DATE.db

# 备份配置文件
cp /var/www/aitars/.env $BACKUP_DIR/env_$DATE.backup

# 保留30天的备份
find $BACKUP_DIR -type f -mtime +30 -delete
EOF

chmod +x /var/www/aitars/backup.sh

# 设置定时备份
echo "0 2 * * * /var/www/aitars/backup.sh" | crontab -
```

## 🔐 安全建议

### 立即执行的安全措施

1. **更换API密钥**
   - OpenAI: 在 https://platform.openai.com/api-keys 重新生成
   - Gemini: 在 Google AI Studio 重新生成  
   - DeepSeek: 在 DeepSeek 控制台重新生成

2. **更换服务器密码**
```bash
passwd root
passwd deploy
```

3. **配置SSH密钥登录**
```bash
# 禁用密码登录
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl restart sshd
```

4. **生成强JWT密钥**
```bash
# 生成256位随机密钥
openssl rand -base64 32
# 将结果更新到 .env 文件的 JWT_SECRET
```

## ✅ 部署检查清单

- [ ] 服务器连接成功
- [ ] 所有软件安装完成
- [ ] 代码克隆并构建成功
- [ ] 环境变量配置正确
- [ ] 数据库初始化完成
- [ ] 后端服务启动正常
- [ ] Nginx配置正确
- [ ] 域名DNS解析正确
- [ ] SSL证书配置成功
- [ ] 网站可以正常访问
- [ ] API接口正常响应
- [ ] 用户注册/登录功能正常
- [ ] AI聊天功能正常
- [ ] 翻译功能正常

## 🎉 部署完成

部署成功后，你的应用将在以下地址可用：
- **主站**: https://aitars.io
- **API**: https://aitars.io/api/
- **健康检查**: https://aitars.io/health

恭喜！你的个人AI助理应用已成功部署到生产环境！🚀 