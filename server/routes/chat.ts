import { FastifyPluginAsync } from 'fastify';
import { db } from '../lib/database';
import { aiService } from '../services/aiService';

interface CreateConversationBody {
  title?: string;
  model: string;
}

interface SendMessageBody {
  content: string;
  role: 'user' | 'assistant';
}

interface StreamMessageBody {
  message: string;
  model: string;
}

export const chatRoutes: FastifyPluginAsync = async (fastify) => {
  // 获取可用模型
  fastify.get('/models', async (request, reply) => {
    const models = aiService.getAvailableModels();
    return reply.send({ models });
  });

  // 创建对话
  fastify.post<{
    Body: CreateConversationBody;
  }>('/conversations', {
    schema: {
      body: {
        type: 'object',
        required: ['model'],
        properties: {
          title: { type: 'string' },
          model: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    const { title = '新对话', model } = request.body;
    const userId = request.user!.id;

    const conversation = await db.conversation.create({
      data: {
        title,
        model,
        userId,
      },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    return reply.status(201).send({ conversation });
  });

  // 获取对话列表
  fastify.get<{
    Querystring: {
      limit?: number;
      offset?: number;
    };
  }>('/conversations', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          offset: { type: 'integer', minimum: 0, default: 0 },
        },
      },
    },
  }, async (request, reply) => {
    const { limit = 20, offset = 0 } = request.query;
    const userId = request.user!.id;

    const [conversations, total] = await Promise.all([
      db.conversation.findMany({
        where: { userId },
        include: {
          messages: {
            orderBy: { timestamp: 'asc' },
            take: 1, // 只获取最后一条消息作为预览
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.conversation.count({ where: { userId } }),
    ]);

    return reply.send({ conversations, total });
  });

  // 获取对话详情
  fastify.get<{
    Params: { id: string };
  }>('/conversations/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;
    const userId = request.user!.id;

    const conversation = await db.conversation.findFirst({
      where: { id, userId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!conversation) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Conversation not found',
      });
    }

    return reply.send({ conversation });
  });

  // 更新对话标题
  fastify.put<{
    Params: { id: string };
    Body: { title: string };
  }>('/conversations/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      body: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 1 },
        },
        required: ['title'],
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;
    const { title } = request.body;
    const userId = request.user!.id;

    const conversation = await db.conversation.updateMany({
      where: { id, userId },
      data: { title },
    });

    if (conversation.count === 0) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Conversation not found',
      });
    }

    const updatedConversation = await db.conversation.findFirst({
      where: { id, userId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    return reply.send({ conversation: updatedConversation });
  });

  // 删除对话
  fastify.delete<{
    Params: { id: string };
  }>('/conversations/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;
    const userId = request.user!.id;

    const result = await db.conversation.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Conversation not found',
      });
    }

    return reply.send({ success: true });
  });

  // 发送消息
  fastify.post<{
    Params: { id: string };
    Body: SendMessageBody;
  }>('/conversations/:id/messages', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      body: {
        type: 'object',
        properties: {
          content: { type: 'string', minLength: 1 },
          role: { type: 'string', enum: ['user', 'assistant'] },
        },
        required: ['content', 'role'],
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;
    const { content, role } = request.body;
    const userId = request.user!.id;

    // 检查对话是否存在
    const conversation = await db.conversation.findFirst({
      where: { id, userId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!conversation) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Conversation not found',
      });
    }

    // 创建用户消息
    const userMessage = await db.message.create({
      data: {
        role,
        content,
        conversationId: id,
        model: conversation.model,
      },
    });

    // 如果是用户消息，生成AI回复
    if (role === 'user') {
      try {
        // 准备消息历史
        const messageHistory = conversation.messages.map(msg => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
        }));
        
        // 添加当前用户消息
        messageHistory.push({
          role: 'user',
          content,
        });

        // 调用AI服务生成回复
        const aiResponse = await aiService.chat(messageHistory, conversation.model);

        // 保存AI回复
        const aiMessage = await db.message.create({
          data: {
            role: 'assistant',
            content: aiResponse.content,
            conversationId: id,
            model: conversation.model,
            tokens: aiResponse.usage?.totalTokens,
          },
        });

        // 更新对话的更新时间
        await db.conversation.update({
          where: { id },
          data: { updatedAt: new Date() },
        });

        return reply.send({ 
          userMessage, 
          aiMessage,
          usage: aiResponse.usage,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          error: 'AI Service Error',
          message: error instanceof Error ? error.message : 'Failed to generate AI response',
        });
      }
    }

    return reply.send({ message: userMessage });
  });

  // 流式聊天
  fastify.post<{
    Params: { id: string };
    Body: StreamMessageBody;
  }>('/conversations/:id/stream', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      body: {
        type: 'object',
        properties: {
          message: { type: 'string', minLength: 1 },
          model: { type: 'string' },
        },
        required: ['message', 'model'],
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;
    const { message, model } = request.body;
    const userId = request.user!.id;

    // 检查对话是否存在
    const conversation = await db.conversation.findFirst({
      where: { id, userId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!conversation) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Conversation not found',
      });
    }

    // 设置SSE响应头
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    });

    try {
      // 保存用户消息
      await db.message.create({
        data: {
          role: 'user',
          content: message,
          conversationId: id,
          model,
        },
      });

      // 准备消息历史
      const messageHistory = conversation.messages.map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      }));
      
      messageHistory.push({
        role: 'user',
        content: message,
      });

      let fullResponse = '';
      
      // 流式生成回复
      for await (const chunk of aiService.chatStream(messageHistory, model)) {
        fullResponse += chunk;
        reply.raw.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }

      // 保存完整的AI回复
      await db.message.create({
        data: {
          role: 'assistant',
          content: fullResponse,
          conversationId: id,
          model,
        },
      });

      // 更新对话时间
      await db.conversation.update({
        where: { id },
        data: { updatedAt: new Date() },
      });

      reply.raw.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      reply.raw.end();
    } catch (error) {
      fastify.log.error(error);
      reply.raw.write(`data: ${JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })}\n\n`);
      reply.raw.end();
    }
  });
}; 