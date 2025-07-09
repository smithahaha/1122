# 🚀 部署前准备清单

## ⚠️ 重要安全提醒
你刚才提供的敏感信息已经暴露在聊天记录中，强烈建议：
1. **立即更换所有API密钥**
2. **更改服务器root密码**
3. **设置SSH密钥认证**

## 📋 部署前必做事项

### 1. 代码仓库准备
- [ ] 将你的项目代码上传到GitHub
- [ ] 确保所有文件都已提交 (git add . && git commit -m "Initial commit")
- [ ] 创建公开仓库或确保服务器可以访问私有仓库

### 2. 域名DNS配置
在你的域名提供商控制台添加以下DNS记录：
```
类型: A
名称: @
值: 138.197.99.117
TTL: 300 (或最小值)

类型: A
名称: www
值: 138.197.99.117
TTL: 300 (或最小值)
```

### 3. 服务器基本信息确认
- **服务器IP**: 138.197.99.117
- **用户名**: root
- **密码**: 20f1d493d1f54c83e48228084f (部署后立即更改)
- **域名**: aitars.io

### 4. API密钥准备
准备好以下API密钥：
- **OpenAI API Key**: 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
- **Gemini API Key**: AIzaSyA7qK0tpNrJIVRESeFfaLUhYJni5H7VTH0
- **DeepSeek API Key**: sk-71778916058c42ffafe2bc29f0240f8a

## 🛠️ 部署方式选择

### 方式1: 一键部署脚本 (推荐)
```bash
# 连接服务器
ssh root@138.197.99.117

# 运行一键部署脚本
bash <(curl -s https://raw.githubusercontent.com/yourusername/ai-assistant/main/deploy-config/quick-deploy.sh)
```

### 方式2: 手动部署
按照 `deploy-config/digitalocean-deploy.md` 中的详细步骤逐步执行。

### 方式3: Docker部署
```bash
# 克隆项目
git clone https://github.com/yourusername/ai-assistant.git
cd ai-assistant

# 使用Docker Compose
docker-compose up -d
```

## 📱 移动端优化
如果需要移动端访问，考虑添加：
- PWA支持
- 响应式设计优化
- 移动端专用界面

## 🔒 安全加固步骤 (部署后立即执行)

### 1. 更换API密钥
- OpenAI: https://platform.openai.com/api-keys
- Gemini: https://ai.google.dev/
- DeepSeek: https://platform.deepseek.com/

### 2. 更换服务器凭据
```bash
# 更换root密码
passwd root

# 创建新用户
adduser deploy
usermod -aG sudo deploy

# 设置SSH密钥认证 (在本地执行)
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
ssh-copy-id deploy@138.197.99.117

# 禁用密码登录
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd
```

### 3. 生成强JWT密钥
```bash
# 生成256位随机密钥
openssl rand -base64 32

# 更新 .env 文件中的 JWT_SECRET
```

### 4. 设置防火墙
```bash
ufw enable
ufw allow ssh
ufw allow 80
ufw allow 443
```

## 🚨 常见问题预防

### 1. 端口冲突
- 确保端口3001没有被占用
- 如果有冲突，修改配置文件中的端口

### 2. 域名解析
- DNS生效需要时间 (通常5-30分钟)
- 可以先用IP地址测试

### 3. SSL证书
- 确保域名已解析到服务器IP
- 使用Let's Encrypt免费证书

### 4. API限制
- 检查API密钥的使用额度
- 设置合理的请求限制

## 📊 部署成功验证

部署完成后，验证以下功能：
- [ ] 网站可以正常访问 (https://aitars.io)
- [ ] 用户注册/登录功能正常
- [ ] AI聊天功能正常
- [ ] 翻译功能正常
- [ ] API健康检查正常 (https://aitars.io/health)

## 🎯 下一步计划

部署成功后，你可以：
1. 添加Google Analytics或其他分析工具
2. 设置监控和报警
3. 优化性能和缓存
4. 添加更多AI模型
5. 开发移动端应用

## 📞 技术支持

如果在部署过程中遇到问题：
1. 检查服务器日志: `pm2 logs aitars-backend`
2. 检查Nginx日志: `tail -f /var/log/nginx/error.log`
3. 验证配置文件: `nginx -t`
4. 重启服务: `pm2 restart aitars-backend`

---

**准备就绪后，开始部署吧！🚀** 