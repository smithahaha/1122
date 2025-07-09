import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { config } from './config/config';
import { authRoutes } from './routes/auth';
import { chatRoutes } from './routes/chat';
import { translateRoutes } from './routes/translate';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/authMiddleware';

const server = fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// 注册插件
server.register(cors, {
  origin: config.corsOrigin,
  credentials: true,
});

server.register(jwt, {
  secret: config.jwtSecret,
  sign: { expiresIn: '24h' },
});

// 注册中间件
server.register(errorHandler);
server.register(authMiddleware);

// 注册路由
server.register(authRoutes, { prefix: '/api/auth' });
server.register(chatRoutes, { prefix: '/api/chat' });
server.register(translateRoutes, { prefix: '/api/translate' });

// 健康检查
server.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// 启动服务器
const start = async () => {
  try {
    await server.listen({ 
      port: config.port, 
      host: config.host 
    });
    console.log(`🚀 Server running on http://${config.host}:${config.port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start(); 