import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { db } from '../lib/database';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      name: string;
    };
  }
}

export const authMiddleware: FastifyPluginAsync = async (fastify) => {
  // 只有在未定义时才添加 decorator
  if (!fastify.hasRequestDecorator('user')) {
    fastify.decorateRequest('user', null);
  }

  fastify.addHook('preHandler', async (request, reply) => {
    // 跳过不需要认证的路由
    const publicRoutes = [
      '/api/auth/login',
      '/api/auth/register',
      '/health',
    ];

    const isPublicRoute = publicRoutes.some(route => 
      request.routeOptions.url === route
    );

    if (isPublicRoute) {
      return;
    }

    // 检查Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header',
      });
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' prefix

    try {
      // 验证JWT token
      const decoded = fastify.jwt.verify(token) as { userId: string };
      
      // 从数据库获取用户信息
      const user = await db.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      if (!user) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'Invalid token or user not found',
        });
      }

      // 将用户信息附加到请求对象
      request.user = user;
    } catch (error) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }
  });
};

export default fp(authMiddleware); 