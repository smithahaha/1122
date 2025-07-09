import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';
import { db } from '../lib/database';

interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  // 用户注册
  fastify.post<{
    Body: RegisterBody;
  }>('/register', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password', 'name'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          name: { type: 'string', minLength: 2 },
        },
      },
    },
  }, async (request, reply) => {
    const { email, password, name } = request.body;

    // 检查用户是否已存在
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return reply.status(409).send({
        error: 'Conflict',
        message: 'User already exists',
      });
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        settings: {
          theme: 'dark',
          language: 'zh-CN',
          notifications: true,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        settings: true,
        createdAt: true,
      },
    });

    // 生成JWT token
    const token = fastify.jwt.sign({ userId: user.id });

    return reply.status(201).send({
      user,
      token,
    });
  });

  // 用户登录
  fastify.post<{
    Body: LoginBody;
  }>('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    const { email, password } = request.body;

    // 查找用户
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Invalid credentials',
      });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Invalid credentials',
      });
    }

    // 生成JWT token
    const token = fastify.jwt.sign({ userId: user.id });

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;

    return reply.send({
      user: userWithoutPassword,
      token,
    });
  });

  // 获取当前用户信息
  fastify.get('/me', async (request, reply) => {
    const user = await db.user.findUnique({
      where: { id: request.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        settings: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return reply.send({ user });
  });

  // 更新用户资料
  fastify.put<{
    Body: {
      name?: string;
      avatar?: string;
      settings?: any;
    };
  }>('/profile', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2 },
          avatar: { type: 'string' },
          settings: { type: 'object' },
        },
      },
    },
  }, async (request, reply) => {
    const { name, avatar, settings } = request.body;

    const user = await db.user.update({
      where: { id: request.user!.id },
      data: {
        ...(name && { name }),
        ...(avatar && { avatar }),
        ...(settings && { settings }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        settings: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return reply.send({ user });
  });

  // 用户登出（客户端处理，服务端无需特殊处理）
  fastify.post('/logout', async (request, reply) => {
    return reply.send({ success: true });
  });
}; 