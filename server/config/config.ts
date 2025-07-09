import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT配置
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  
  // 数据库配置
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  
  // Redis配置
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // CORS配置
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // AI服务配置
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  },
  
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },
  
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
  },
  
  // 翻译服务配置
  translate: {
    // 可以使用OpenAI或其他翻译API
    provider: process.env.TRANSLATE_PROVIDER || 'openai',
    apiKey: process.env.TRANSLATE_API_KEY || process.env.OPENAI_API_KEY || '',
  },
  
  // 缓存配置
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '3600', 10), // 1小时
  },
  
  // 速率限制
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10), // 1分钟
  },
}; 