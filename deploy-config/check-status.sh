#!/bin/bash

# 部署状态检查脚本
# 用于检查所有服务是否正常运行

DOMAIN="aitars.io"
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🔍 检查 aitars.io 部署状态...${NC}"
echo "=================================="

# 检查系统服务
echo -e "${GREEN}📊 检查系统服务状态...${NC}"
echo "Nginx 状态:"
systemctl is-active nginx && echo -e "${GREEN}✅ Nginx 运行正常${NC}" || echo -e "${RED}❌ Nginx 异常${NC}"

echo "防火墙状态:"
ufw status | grep -q "Status: active" && echo -e "${GREEN}✅ 防火墙已启用${NC}" || echo -e "${RED}❌ 防火墙未启用${NC}"

# 检查PM2服务
echo -e "${GREEN}🚀 检查PM2服务状态...${NC}"
pm2 status | grep -q "aitars-backend" && echo -e "${GREEN}✅ 后端服务运行正常${NC}" || echo -e "${RED}❌ 后端服务异常${NC}"

# 检查端口占用
echo -e "${GREEN}🔌 检查端口占用...${NC}"
netstat -tlnp | grep -q ":3001" && echo -e "${GREEN}✅ 后端端口3001正常${NC}" || echo -e "${RED}❌ 后端端口3001异常${NC}"
netstat -tlnp | grep -q ":80" && echo -e "${GREEN}✅ HTTP端口80正常${NC}" || echo -e "${RED}❌ HTTP端口80异常${NC}"
netstat -tlnp | grep -q ":443" && echo -e "${GREEN}✅ HTTPS端口443正常${NC}" || echo -e "${RED}❌ HTTPS端口443异常${NC}"

# 检查数据库
echo -e "${GREEN}🗄️ 检查数据库...${NC}"
if [ -f "/var/www/aitars/data/prod.db" ]; then
    echo -e "${GREEN}✅ 数据库文件存在${NC}"
else
    echo -e "${RED}❌ 数据库文件不存在${NC}"
fi

# 检查前端构建
echo -e "${GREEN}🏗️ 检查前端构建...${NC}"
if [ -d "/var/www/aitars/dist" ]; then
    echo -e "${GREEN}✅ 前端构建目录存在${NC}"
else
    echo -e "${RED}❌ 前端构建目录不存在${NC}"
fi

# 检查API健康
echo -e "${GREEN}🏥 检查API健康状态...${NC}"
API_HEALTH=$(curl -s http://localhost:3001/health | jq -r '.status' 2>/dev/null)
if [ "$API_HEALTH" = "ok" ]; then
    echo -e "${GREEN}✅ API健康检查通过${NC}"
else
    echo -e "${RED}❌ API健康检查失败${NC}"
fi

# 检查网站访问
echo -e "${GREEN}🌐 检查网站访问...${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN)
if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ HTTP访问正常 (状态码: $HTTP_STATUS)${NC}"
else
    echo -e "${RED}❌ HTTP访问异常 (状态码: $HTTP_STATUS)${NC}"
fi

# 检查HTTPS访问
HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN 2>/dev/null)
if [ "$HTTPS_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ HTTPS访问正常 (状态码: $HTTPS_STATUS)${NC}"
else
    echo -e "${YELLOW}⚠️  HTTPS访问异常 (状态码: $HTTPS_STATUS) - 可能需要配置SSL${NC}"
fi

# 检查SSL证书
echo -e "${GREEN}🔒 检查SSL证书...${NC}"
if openssl s_client -connect $DOMAIN:443 -servername $DOMAIN </dev/null 2>/dev/null | grep -q "Verify return code: 0"; then
    echo -e "${GREEN}✅ SSL证书有效${NC}"
else
    echo -e "${YELLOW}⚠️  SSL证书无效或未配置${NC}"
fi

# 检查日志
echo -e "${GREEN}📝 最近的错误日志...${NC}"
echo "PM2错误日志 (最后5行):"
tail -n 5 /var/log/pm2/aitars-error.log 2>/dev/null || echo "无错误日志"

echo "Nginx错误日志 (最后5行):"
tail -n 5 /var/log/nginx/error.log 2>/dev/null || echo "无错误日志"

echo ""
echo -e "${GREEN}=================================="
echo -e "📋 状态检查完成"
echo -e "=================================="
echo ""
echo -e "${YELLOW}📋 访问地址:${NC}"
echo "- HTTP: http://$DOMAIN"
echo "- HTTPS: https://$DOMAIN"
echo "- API健康检查: http://$DOMAIN/health"
echo ""
echo -e "${YELLOW}📋 管理命令:${NC}"
echo "- 查看后端日志: pm2 logs aitars-backend"
echo "- 重启后端: pm2 restart aitars-backend"
echo "- 重启Nginx: systemctl restart nginx"
echo "- 查看状态: pm2 status" 