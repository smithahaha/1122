# 个人AI助理Web应用

一个功能丰富的个人AI助理Web应用，集成了多种AI服务，为用户提供智能化的工作和生活助手。

## 🎯 项目状态

**当前版本**: Phase 1 核心功能完成 ✅  
**开发进度**: 用户认证、AI聊天、翻译功能正常运行  
**最后更新**: 2025年1月9日  
**测试地址**: http://localhost:5174

## 主要功能

### ✅ Phase 1: 核心功能 (已完成)
- **用户认证系统**: 安全的用户注册、登录和个人资料管理
- **AI对话助手**: 集成OpenAI、Gemini Pro、DeepSeek等多种AI模型
- **多语言翻译**: 支持16种语言的实时翻译服务
- **响应式界面**: 现代化的深色主题UI，移动端友好
- **数据持久化**: 聊天历史和翻译记录自动保存

### 🚧 Phase 2: 扩展功能 (开发中)
- **内容生成器**: AI驱动的文章、代码、创意内容生成
- **图像生成器**: 基于文本描述生成图像
- **知识库管理**: 个人知识库的构建和管理
- **饮食建议**: 个性化的健康饮食方案
- **科技资讯**: 最新科技动态和趋势分析

### 📋 Phase 3: 高级功能 (计划中)
- **智能体框架**: 自定义AI助手和工作流
- **工作流管理**: 复杂任务的自动化处理
- **数据分析**: 使用统计和行为分析

## 🛠️ 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **状态管理**: Zustand
- **样式**: Tailwind CSS + Shadcn UI
- **路由**: React Router v7
- **HTTP客户端**: Axios
- **其他**: React Query, React Markdown

### 后端
- **框架**: Fastify + TypeScript
- **数据库**: Prisma ORM + SQLite
- **认证**: JWT + bcrypt
- **AI服务**: OpenAI SDK, Google Gemini API, DeepSeek API
- **其他**: CORS, 错误处理中间件

## 🚀 快速开始

### 方法1: 使用快速启动脚本 (推荐)
```powershell
# 在项目根目录运行
.\scripts\quick-start.ps1
```

### 方法2: 手动启动

#### 环境要求
- Node.js 16+
- npm 或 yarn

#### 安装步骤

1. **安装依赖**
```bash
npm install
```

2. **配置环境变量**
```bash
copy env.example .env
# .env 文件会自动创建，包含测试配置
```

3. **初始化数据库**
```bash
npx prisma db push
```

4. **启动服务器**
```bash
# 后端服务器 (端口 3001)
npx tsx server/index.ts

# 前端服务器 (端口 5174)
npm run dev
```

#### 访问地址
- **前端**: http://localhost:5174
- **后端API**: http://localhost:3001
- **健康检查**: http://localhost:3001/health

## 🔧 环境变量配置

当前配置适用于开发环境，无需修改即可使用：

```env
# 服务器配置
PORT=3001
HOST=0.0.0.0
NODE_ENV=development
CORS_ORIGIN=http://localhost:5174

# JWT密钥 (开发环境)
JWT_SECRET=dev-jwt-secret-key-for-testing-only

# 数据库
DATABASE_URL=file:./dev.db

# API密钥 (测试密钥，需要替换为真实密钥)
OPENAI_API_KEY=sk-test-key
GEMINI_API_KEY=test-gemini-key
DEEPSEEK_API_KEY=test-deepseek-key
```

## 🧪 测试功能

### 用户注册测试
1. 访问 http://localhost:5174
2. 点击注册按钮
3. 填写以下信息：
   - **用户名**: 任意字符串
   - **邮箱**: test@example.com (或其他邮箱格式)
   - **密码**: 123456 (或其他密码)

### AI聊天测试
1. 注册并登录成功
2. 进入AI聊天页面
3. 选择AI模型 (OpenAI GPT-4, Gemini Pro, DeepSeek)
4. 发送消息测试对话功能

### 翻译功能测试
1. 进入在线翻译页面
2. 选择源语言和目标语言
3. 输入文本进行翻译测试

## 📖 API接口文档

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息
- `PUT /api/auth/profile` - 更新用户资料

### AI聊天相关
- `GET /api/chat/models` - 获取可用AI模型
- `POST /api/chat/conversations` - 创建新对话
- `GET /api/chat/conversations` - 获取对话列表
- `GET /api/chat/conversations/:id` - 获取特定对话
- `DELETE /api/chat/conversations/:id` - 删除对话
- `POST /api/chat/conversations/:id/messages` - 发送消息
- `GET /api/chat/conversations/:id/messages` - 获取消息历史
- `POST /api/chat/stream` - 流式聊天

### 翻译相关
- `GET /api/translate/languages` - 获取支持的语言
- `POST /api/translate` - 翻译文本
- `POST /api/translate/detect` - 检测语言
- `GET /api/translate/history` - 获取翻译历史
- `POST /api/translate/batch` - 批量翻译
- `DELETE /api/translate/history/:id` - 删除翻译记录

## 📁 项目结构

```
1122/
├── src/                 # 前端源码
│   ├── components/      # React组件
│   ├── pages/          # 页面组件
│   ├── stores/         # Zustand状态管理
│   ├── lib/            # 工具库
│   └── types/          # TypeScript类型
├── server/             # 后端源码
│   ├── routes/         # API路由
│   ├── middleware/     # 中间件
│   ├── services/       # 业务服务
│   ├── lib/            # 后端工具库
│   └── config/         # 配置文件
├── prisma/             # 数据库模式
├── scripts/            # 启动脚本
├── PROJECT_STATUS.md   # 详细开发进度
└── README.md          # 项目说明
```

## 🐛 已知问题

1. **测试API密钥**: 当前使用测试密钥，真实AI功能需要配置实际API密钥
2. **端口配置**: 前端默认端口从5173变更为5174
3. **开发环境**: 当前配置仅适用于开发环境

## 📋 下次开发计划

1. **完善现有功能**
   - 优化AI聊天用户体验
   - 增强错误处理机制
   - 改进界面交互设计

2. **实现Phase 2功能**
   - 开发内容生成器页面
   - 实现图片生成功能
   - 构建知识库管理系统

3. **系统优化**
   - 性能优化和代码重构
   - 安全性增强
   - 用户体验改进

## 📚 参考文档

- [详细开发进度](PROJECT_STATUS.md) - 完整的项目状态记录
- [实现总结](IMPLEMENTATION_SUMMARY.md) - 技术实现细节
- [快速启动脚本](scripts/quick-start.ps1) - 自动化启动脚本

## 🤝 贡献指南

1. Fork本项目
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交更改: `git commit -am 'Add new feature'`
4. 推送到分支: `git push origin feature/new-feature`
5. 提交Pull Request

## 📄 许可证

MIT License

## 📞 支持

如果你在使用过程中遇到问题，请提交Issue或联系开发者。

---

**开发状态**: ✅ Phase 1核心功能完成，系统可正常运行  
**下次启动**: 运行快速启动脚本或查看PROJECT_STATUS.md 