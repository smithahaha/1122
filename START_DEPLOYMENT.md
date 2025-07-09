# 🚀 开始部署 aitars.io

## 📋 您的部署信息
- **服务器IP**: 138.197.99.117
- **域名**: aitars.io
- **用户**: root
- **密码**: 20f1d493d1f54c83e48228084f

## 🎯 现在开始部署

### 第1步: 配置DNS (立即执行)
请在您的域名提供商控制台添加以下DNS记录：
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

### 第2步: 连接服务器
打开终端/命令提示符，输入：
```bash
ssh root@138.197.99.117
```
密码: `20f1d493d1f54c83e48228084f`

### 第3步: 运行部署脚本
连接服务器后，复制粘贴以下命令：

```bash
# 下载部署脚本
wget https://raw.githubusercontent.com/github.com/smithahaha/1122/main/deploy-config/final-deploy.sh

# 给予执行权限
chmod +x final-deploy.sh

# 运行部署脚本
./final-deploy.sh
```

⚠️ **重要**: 将 `yourusername/ai-assistant` 替换为您的实际GitHub仓库地址

### 第4步: 输入GitHub仓库地址
脚本会提示您输入GitHub仓库地址，请输入您的完整仓库URL：
```
https://github.com/yourusername/ai-assistant.git
```

### 第5步: 等待部署完成
脚本会自动完成所有配置，大约需要5-10分钟。

### 第6步: 配置SSL证书
DNS生效后（通常5-30分钟），运行：
```bash
cd /var/www/aitars
chmod +x deploy-config/setup-ssl.sh
./deploy-config/setup-ssl.sh
```

### 第7步: 验证部署
```bash
chmod +x deploy-config/check-status.sh
./deploy-config/check-status.sh
```

## 🎉 部署完成！

如果一切正常，您现在可以访问：
- **HTTP**: http://aitars.io
- **HTTPS**: https://aitars.io (SSL配置后)

## 🔒 安全提醒
部署完成后，请立即：
1. 更换服务器密码: `passwd root`
2. 更换API密钥
3. 生成新的JWT密钥

## 🆘 如果遇到问题
1. 查看日志: `pm2 logs aitars-backend`
2. 重启服务: `pm2 restart aitars-backend`
3. 检查状态: `./deploy-config/check-status.sh`

---

**准备好了吗？现在就开始部署吧！** 🚀 

## 🚀 **直接在服务器上部署**

既然您已经连接到服务器，让我们直接创建部署脚本并运行：

### 第1步：创建部署脚本

在服务器上运行以下命令：

```bash
<code_block_to_apply_changes_from>
```

### 第2步：运行部署脚本

```bash
# 给予执行权限
chmod +x deploy-aitars.sh

# 运行部署脚本
./deploy-aitars.sh
```

### 第3步：配置SSL证书（在DNS生效后）

```bash
# 等待DNS生效后运行
certbot --nginx -d aitars.io -d www.aitars.io
```

### 第4步：状态检查

```bash
# 检查服务状态
pm2 status
systemctl status nginx

# 测试访问
curl http://localhost:3001/health
curl http://aitars.io
```

## 🔧 **快速命令列表**

如果您想要逐步执行，可以复制以下命令：

```bash
# 1. 创建部署脚本（复制上面的完整脚本）
# 2. 运行部署
chmod +x deploy-aitars.sh && ./deploy-aitars.sh

# 3. 配置SSL（DNS生效后）
certbot --nginx -d aitars.io -d www.aitars.io

# 4. 检查状态
pm2 status && systemctl status nginx
```

请在服务器上复制粘贴这些命令。脚本会自动使用您的正确仓库地址 `https://github.com/smithahaha/1122` 进行部署。

**需要我帮您解释任何步骤吗？** 