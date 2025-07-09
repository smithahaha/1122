import { FastifyPluginAsync } from 'fastify';
import { db } from '../lib/database';
import { translateService } from '../services/translateService';

interface TranslateBody {
  text: string;
  from: string;
  to: string;
  detectLang?: boolean;
}

interface BatchTranslateBody {
  texts: string[];
  from: string;
  to: string;
}

interface DetectLanguageBody {
  text: string;
}

export const translateRoutes: FastifyPluginAsync = async (fastify) => {
  // 翻译文本
  fastify.post<{
    Body: TranslateBody;
  }>('/translate', {
    schema: {
      body: {
        type: 'object',
        required: ['text', 'from', 'to'],
        properties: {
          text: { type: 'string', minLength: 1 },
          from: { type: 'string' },
          to: { type: 'string' },
          detectLang: { type: 'boolean' },
        },
      },
    },
  }, async (request, reply) => {
    const { text, from, to, detectLang = false } = request.body;
    const userId = request.user!.id;

    try {
      // 调用翻译服务
      const result = await translateService.translate({
        text,
        from,
        to,
        detectLang,
      });

      // 保存翻译记录
      await db.translation.create({
        data: {
          sourceText: text,
          targetText: result.translatedText,
          sourceLang: result.detectedLang || from,
          targetLang: to,
          userId,
        },
      });

      return reply.send({
        translatedText: result.translatedText,
        detectedLang: result.detectedLang,
        confidence: result.confidence,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        error: 'Translation Error',
        message: error instanceof Error ? error.message : 'Translation failed',
      });
    }
  });

  // 批量翻译
  fastify.post<{
    Body: BatchTranslateBody;
  }>('/batch', {
    schema: {
      body: {
        type: 'object',
        required: ['texts', 'from', 'to'],
        properties: {
          texts: {
            type: 'array',
            items: { type: 'string' },
            minItems: 1,
            maxItems: 10,
          },
          from: { type: 'string' },
          to: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    const { texts, from, to } = request.body;
    const userId = request.user!.id;

    try {
      // 批量翻译
      const translations = await translateService.translateBatch(texts, from, to);

      // 保存翻译记录
      const records = texts.map((text, index) => ({
        sourceText: text,
        targetText: translations[index],
        sourceLang: from,
        targetLang: to,
        userId,
      }));

      await db.translation.createMany({
        data: records,
      });

      return reply.send({ translations });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        error: 'Translation Error',
        message: error instanceof Error ? error.message : 'Batch translation failed',
      });
    }
  });

  // 获取翻译历史
  fastify.get<{
    Querystring: {
      limit?: number;
      offset?: number;
    };
  }>('/history', {
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

    const [history, total] = await Promise.all([
      db.translation.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.translation.count({ where: { userId } }),
    ]);

    return reply.send({ history, total });
  });

  // 删除翻译历史记录
  fastify.delete<{
    Params: { id: string };
  }>('/history/:id', {
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

    const result = await db.translation.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Translation record not found',
      });
    }

    return reply.send({ success: true });
  });

  // 获取支持的语言列表
  fastify.get('/languages', async (request, reply) => {
    const languages = translateService.getSupportedLanguages();
    return reply.send({ languages });
  });

  // 检测语言
  fastify.post<{
    Body: DetectLanguageBody;
  }>('/detect', {
    schema: {
      body: {
        type: 'object',
        required: ['text'],
        properties: {
          text: { type: 'string', minLength: 1 },
        },
      },
    },
  }, async (request, reply) => {
    const { text } = request.body;

    try {
      const language = await translateService.detectLanguage(text);
      return reply.send({
        language,
        confidence: 0.95,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        error: 'Detection Error',
        message: error instanceof Error ? error.message : 'Language detection failed',
      });
    }
  });
}; 