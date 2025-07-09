#!/bin/bash

# SSL证书配置脚本
# 在部署完成后运行此脚本

set -e

DOMAIN="aitars.io"
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🔒 开始配置SSL证书...${NC}"

# 检查域名解析
echo -e "${GREEN}🌐 检查域名解析...${NC}"
if ! nslookup $DOMAIN | grep -q "138.197.99.117"; then
    echo -e "${YELLOW}⚠️  域名解析检查失败，请确认DNS记录已正确配置${NC}"
    echo -e "${YELLOW}继续配置SSL证书吗？(y/n)${NC}"
    read -p "继续? " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 获取SSL证书
echo -e "${GREEN}📜 获取SSL证书...${NC}"
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# 设置自动续期
echo -e "${GREEN}🔄 设置自动续期...${NC}"
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -

# 更新Nginx配置以强制HTTPS
echo -e "${GREEN}🔧 更新Nginx配置...${NC}"
nginx -t && systemctl reload nginx

# 测试SSL
echo -e "${GREEN}🧪 测试SSL配置...${NC}"
curl -I https://$DOMAIN || echo -e "${RED}SSL测试失败${NC}"

echo -e "${GREEN}✅ SSL配置完成！${NC}"
echo -e "${GREEN}🎉 现在可以通过 https://$DOMAIN 访问您的应用${NC}" 