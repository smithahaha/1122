# 🚀 aitars.io 部署指南

## 📋 部署信息
- **服务器IP**: 138.197.99.117
- **域名**: aitars.io
- **用户**: root
- **密码**: 20f1d493d1f54c83e48228084f（部署后立即更改）

## ⚠️ 安全提醒
在开始部署之前，请注意：
1. 立即更换所有API密钥
2. 部署完成后更改服务器密码
3. 设置SSH密钥认证

## 🚀 快速部署步骤

### 步骤1: 配置DNS
在您的域名提供商控制台添加以下DNS记录：
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

### 步骤2: 连接服务器
```bash
ssh root@138.197.99.117
# 输入密码: 20f1d493d1f54c83e48228084f
```

### 步骤3: 下载并运行部署脚本
```bash
# 下载部署脚本
wget https://raw.githubusercontent.com/yourusername/ai-assistant/main/deploy-config/final-deploy.sh

# 给予执行权限
chmod +x final-deploy.sh

# 运行部署脚本
./final-deploy.sh
```

### 步骤4: 输入GitHub仓库地址
脚本会提示您输入GitHub仓库地址，输入您的完整仓库URL：
```
https://github.com/yourusername/ai-assistant.git
```

### 步骤5: 等待部署完成
脚本会自动：
- 安装所有必要的软件
- 克隆您的项目
- 安装依赖
- 配置数据库
- 构建前端
- 配置Nginx
- 启动后端服务

### 步骤6: 配置SSL证书
DNS生效后（通常5-30分钟），运行SSL配置脚本：
```bash
cd /var/www/aitars
chmod +x deploy-config/setup-ssl.sh
./deploy-config/setup-ssl.sh
```

### 步骤7: 验证部署
```bash
# 运行状态检查
chmod +x deploy-config/check-status.sh
./deploy-config/check-status.sh
```

## 🔧 手动部署步骤 (可选)

如果自动部署脚本出现问题，可以手动执行以下步骤：

### 1. 系统更新和软件安装
```bash
apt update && apt upgrade -y
apt install -y curl wget git nginx certbot python3-certbot-nginx ufw htop vim
```

### 2. 安装Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs
npm install -g pm2
```

### 3. 配置防火墙
```bash
ufw --force enable
ufw allow ssh
ufw allow 80
ufw allow 443
```

### 4. 部署应用
```bash
mkdir -p /var/www/aitars
cd /var/www/aitars
git clone https://github.com/yourusername/ai-assistant.git .
npm install
cp deploy-config/production.env .env
mkdir -p data
npx prisma generate
npx prisma db push
npm run build
```

### 5. 配置Nginx
```bash
# 复制Nginx配置文件
cp deploy-config/nginx.conf /etc/nginx/sites-available/aitars.io
ln -sf /etc/nginx/sites-available/aitars.io /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
systemctl enable nginx
```

### 6. 启动PM2服务
```bash
pm2 start deploy-config/ecosystem.config.js
pm2 save
pm2 startup --update-env
```

## 🔒 安全配置 (部署完成后立即执行)

### 1. 更换密码
```bash
passwd root
```

### 2. 生成新的JWT密钥
```bash
openssl rand -base64 32
# 将生成的密钥更新到 .env 文件
```

### 3. 更换API密钥
更新`.env`文件中的API密钥：
- OpenAI: https://platform.openai.com/api-keys
- Gemini: https://ai.google.dev/
- DeepSeek: https://platform.deepseek.com/

### 4. 创建非root用户
```bash
adduser deploy
usermod -aG sudo deploy
usermod -aG docker deploy
```

### 5. 设置SSH密钥认证
```bash
# 在本地生成SSH密钥
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 上传公钥到服务器
ssh-copy-id deploy@138.197.99.117

# 禁用密码登录
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd
```

## 🧪 测试部署

### 1. 检查服务状态
```bash
pm2 status
systemctl status nginx
```

### 2. 测试API
```bash
curl http://localhost:3001/health
curl http://aitars.io/health
```

### 3. 测试网站访问
- HTTP: http://aitars.io
- HTTPS: https://aitars.io (SSL配置后)

## 📊 监控和维护

### 查看日志
```bash
# 后端日志
pm2 logs aitars-backend

# Nginx访问日志
tail -f /var/log/nginx/access.log

# Nginx错误日志
tail -f /var/log/nginx/error.log
```

### 重启服务
```bash
# 重启后端
pm2 restart aitars-backend

# 重启Nginx
systemctl restart nginx

# 重启所有服务
pm2 restart all
systemctl restart nginx
```

### 更新代码
```bash
cd /var/www/aitars
git pull origin main
npm install
npm run build
pm2 restart aitars-backend
```

## 🐛 常见问题解决

### 1. 端口被占用
```bash
# 查看端口占用
netstat -tlnp | grep :3001

# 杀死占用进程
kill -9 [PID]
```

### 2. Nginx配置错误
```bash
# 测试配置
nginx -t

# 重新加载配置
systemctl reload nginx
```

### 3. SSL证书问题
```bash
# 手动获取证书
certbot --nginx -d aitars.io -d www.aitars.io

# 测试证书续期
certbot renew --dry-run
```

### 4. 数据库问题
```bash
# 重新初始化数据库
cd /var/www/aitars
npx prisma db push --force-reset
```

## 📱 访问地址

部署完成后，您可以通过以下地址访问：
- **主页**: https://aitars.io
- **API健康检查**: https://aitars.io/health
- **服务器IP**: http://138.197.99.117

## 🎯 后续优化

1. **性能优化**:
   - 设置Redis缓存
   - 开启Nginx缓存
   - 优化数据库查询

2. **监控设置**:
   - 设置服务器监控
   - 配置日志轮转
   - 添加错误报警

3. **备份策略**:
   - 自动数据库备份
   - 代码备份
   - 配置文件备份

4. **扩展功能**:
   - 添加更多AI模型
   - 实现Phase 2功能
   - 移动端应用

---

**部署完成！** 🎉

如有问题，请检查日志文件或运行状态检查脚本。 