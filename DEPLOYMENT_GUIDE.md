# 云端部署指南

## 🎯 部署策略建议

### 📅 分阶段部署时间线

| 阶段 | 时机 | 部署内容 | 目标 |
|------|------|----------|------|
| **Phase 1.5** | 当前 | 用户认证 + AI聊天 + 翻译 | 验证核心功能，获取用户反馈 |
| **Phase 2.1** | 2周后 | + 内容生成器 | 扩展创作功能 |
| **Phase 2.2** | 4周后 | + 图像生成 + 知识库 | 完善AI生成能力 |
| **Phase 3** | 8周后 | + 智能体框架 | 高级功能上线 |

## 🌐 云服务提供商选择

### 推荐方案 (按成本和易用性)

1. **Vercel + PlanetScale** (推荐新手)
   - ✅ 前端零配置部署
   - ✅ 数据库托管
   - ✅ 免费额度充足
   - 💰 成本: $0-20/月

2. **Nginx + Docker + VPS** (推荐全栈)
   - ✅ 完全控制
   - ✅ 成本可控
   - ✅ 学习价值高
   - 💰 成本: $5-15/月

3. **AWS/阿里云** (推荐企业级)
   - ✅ 企业级稳定性
   - ✅ 全球CDN
   - ✅ 丰富生态
   - 💰 成本: $20-100/月

## 🐳 Docker部署 (推荐)

### 环境要求
- Docker 20.10+
- Docker Compose 2.0+
- 4GB+ RAM
- 20GB+ 存储空间

### 部署步骤

#### 1. 准备服务器
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装Docker Compose
sudo apt install docker-compose-plugin
```

#### 2. 克隆项目
```bash
git clone https://github.com/yourusername/ai-assistant.git
cd ai-assistant
```

#### 3. 配置环境变量
```bash
# 创建生产环境变量文件
cp env.example .env.production

# 编辑生产环境变量
nano .env.production
```

**生产环境变量配置:**
```env
# 基本配置
NODE_ENV=production
JWT_SECRET=your-super-strong-jwt-secret-256-bits
CORS_ORIGIN=https://yourdomain.com

# 数据库
DATABASE_URL=file:./data/prod.db

# API密钥 (必须配置真实密钥)
OPENAI_API_KEY=sk-your-real-openai-key
GEMINI_API_KEY=your-real-gemini-key
DEEPSEEK_API_KEY=your-real-deepseek-key

# 域名配置
DOMAIN=yourdomain.com
```

#### 4. 构建和启动
```bash
# 构建镜像
npm run docker:build

# 启动服务
npm run docker:up

# 查看状态
docker-compose ps
docker-compose logs -f
```

#### 5. 配置域名和SSL
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 获取SSL证书
sudo certbot --nginx -d yourdomain.com
```

## ☁️ Vercel部署 (简单方案)

### 前端部署到Vercel

1. **连接GitHub**
   - 推送代码到GitHub
   - 在Vercel中导入项目

2. **配置构建设置**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install"
   }
   ```

3. **环境变量配置**
   ```env
   VITE_API_URL=https://your-api-domain.com
   ```

### 后端部署到Railway/Render

1. **Railway部署**
   ```bash
   # 安装Railway CLI
   npm install -g @railway/cli

   # 登录并部署
   railway login
   railway init
   railway up
   ```

2. **环境变量配置**
   - 在Railway/Render控制台配置所有环境变量
   - 连接数据库服务

## 🔧 生产环境优化

### 1. 数据库优化
```bash
# 使用PostgreSQL替代SQLite
DATABASE_URL=postgresql://user:password@host:5432/database
```

### 2. 缓存配置
```bash
# 添加Redis缓存
REDIS_URL=redis://localhost:6379
```

### 3. 监控配置
```bash
# 添加应用监控
npm install @sentry/node @sentry/react
```

### 4. 性能优化
- 启用Gzip压缩
- 配置CDN加速
- 设置适当的缓存策略
- 优化数据库查询

## 🛡️ 安全配置

### 1. 基本安全措施
```bash
# 配置防火墙
sudo ufw enable
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
```

### 2. 应用安全
- ✅ 使用强JWT密钥
- ✅ 配置CORS域名白名单
- ✅ 启用HTTPS
- ✅ 定期更新依赖包
- ✅ 配置速率限制

### 3. 数据备份
```bash
# 自动数据库备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec container_name sqlite3 /app/data/prod.db ".backup /app/data/backup_$DATE.db"
```

## 📊 监控和维护

### 1. 健康检查
```bash
# 检查应用状态
curl -f https://yourdomain.com/health

# 查看Docker容器状态
docker-compose ps

# 查看日志
docker-compose logs --tail=100 backend
```

### 2. 性能监控
- 设置应用性能监控(APM)
- 配置错误追踪
- 监控资源使用情况

### 3. 更新策略
```bash
# 零停机更新
git pull origin main
npm run deploy
```

## 🚀 CI/CD自动化

### GitHub Actions配置
创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        script: |
          cd /path/to/your/app
          git pull origin main
          npm run deploy
```

## 📋 部署检查清单

### 部署前检查
- [ ] 所有API密钥已配置
- [ ] 环境变量已设置
- [ ] 数据库连接正常
- [ ] SSL证书已配置
- [ ] 域名解析正确

### 部署后验证
- [ ] 网站可正常访问
- [ ] 用户注册/登录功能正常
- [ ] AI聊天功能正常
- [ ] 翻译功能正常
- [ ] API响应正常
- [ ] 错误日志检查

## 🆘 故障排除

### 常见问题

1. **容器启动失败**
   ```bash
   docker-compose logs backend
   ```

2. **数据库连接问题**
   ```bash
   docker exec -it container_name npx prisma db push
   ```

3. **API密钥错误**
   - 检查环境变量配置
   - 验证API密钥有效性

4. **CORS错误**
   - 检查CORS_ORIGIN配置
   - 确认域名设置正确

## 💡 建议

1. **分阶段部署**: 不要等到全部开发完成，建议Phase 1完成后就开始部署
2. **备份策略**: 建立定期备份机制
3. **监控告警**: 设置关键指标监控
4. **文档维护**: 保持部署文档更新

---

**下一步**: 建议先在测试环境部署，验证无误后再部署到生产环境。 