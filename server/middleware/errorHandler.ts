import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

export const errorHandler: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler(async (error, request, reply) => {
    const statusCode = error.statusCode || 500;
    
    // 记录错误
    fastify.log.error(error);

    // 根据错误类型返回不同的响应
    if (error.validation) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: error.message,
        details: error.validation,
      });
    }

    if (error.code === 'P2002') {
      // Prisma 唯一约束错误
      return reply.status(409).send({
        error: 'Conflict',
        message: 'Resource already exists',
      });
    }

    if (error.code === 'P2025') {
      // Prisma 记录不存在错误
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Resource not found',
      });
    }

    // 通用错误响应
    const response = {
      error: 'Internal Server Error',
      message: statusCode === 500 ? 'Something went wrong' : error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    };

    return reply.status(statusCode).send(response);
  });
};

export default fp(errorHandler); 