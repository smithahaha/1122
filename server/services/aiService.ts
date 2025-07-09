import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/config';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class AIService {
  private openai: OpenAI;
  private gemini: GoogleGenerativeAI;
  private deepseek: OpenAI;

  constructor() {
    // 初始化OpenAI
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
      baseURL: config.openai.baseUrl,
    });

    // 初始化Gemini
    this.gemini = new GoogleGenerativeAI(config.gemini.apiKey);

    // 初始化DeepSeek (使用OpenAI兼容接口)
    this.deepseek = new OpenAI({
      apiKey: config.deepseek.apiKey,
      baseURL: config.deepseek.baseUrl,
    });
  }

  async chat(messages: ChatMessage[], model: string): Promise<ChatResponse> {
    switch (model) {
      case 'gpt-4':
      case 'gpt-4-turbo':
      case 'gpt-3.5-turbo':
        return this.chatWithOpenAI(messages, model);
      
      case 'gemini-pro':
        return this.chatWithGemini(messages);
      
      case 'deepseek-chat':
        return this.chatWithDeepSeek(messages);
      
      default:
        throw new Error(`Unsupported model: ${model}`);
    }
  }

  private async chatWithOpenAI(messages: ChatMessage[], model: string): Promise<ChatResponse> {
    try {
      const response = await this.openai.chat.completions.create({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      });

      const choice = response.choices[0];
      if (!choice.message.content) {
        throw new Error('No content in OpenAI response');
      }

      return {
        content: choice.message.content,
        model,
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        } : undefined,
      };
    } catch (error) {
      throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async chatWithGemini(messages: ChatMessage[]): Promise<ChatResponse> {
    try {
      const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' });
      
      // 转换消息格式
      const history = messages.slice(0, -1).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      const lastMessage = messages[messages.length - 1];
      
      const chat = model.startChat({
        history: history as any,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      });

      const result = await chat.sendMessage(lastMessage.content);
      const response = await result.response;
      const text = response.text();

      return {
        content: text,
        model: 'gemini-pro',
        usage: {
          promptTokens: 0, // Gemini doesn't provide token count
          completionTokens: 0,
          totalTokens: 0,
        },
      };
    } catch (error) {
      throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async chatWithDeepSeek(messages: ChatMessage[]): Promise<ChatResponse> {
    try {
      const response = await this.deepseek.chat.completions.create({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      });

      const choice = response.choices[0];
      if (!choice.message.content) {
        throw new Error('No content in DeepSeek response');
      }

      return {
        content: choice.message.content,
        model: 'deepseek-chat',
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        } : undefined,
      };
    } catch (error) {
      throw new Error(`DeepSeek API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async *chatStream(messages: ChatMessage[], model: string): AsyncGenerator<string, void, unknown> {
    switch (model) {
      case 'gpt-4':
      case 'gpt-4-turbo':
      case 'gpt-3.5-turbo':
        yield* this.streamWithOpenAI(messages, model);
        break;
      
      case 'deepseek-chat':
        yield* this.streamWithDeepSeek(messages);
        break;
      
      default:
        throw new Error(`Streaming not supported for model: ${model}`);
    }
  }

  private async *streamWithOpenAI(messages: ChatMessage[], model: string): AsyncGenerator<string, void, unknown> {
    try {
      const stream = await this.openai.chat.completions.create({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: true,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          yield delta;
        }
      }
    } catch (error) {
      throw new Error(`OpenAI streaming error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async *streamWithDeepSeek(messages: ChatMessage[]): AsyncGenerator<string, void, unknown> {
    try {
      const stream = await this.deepseek.chat.completions.create({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: true,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          yield delta;
        }
      }
    } catch (error) {
      throw new Error(`DeepSeek streaming error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // 获取可用模型列表
  getAvailableModels() {
    return [
      {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'OpenAI',
        description: '最先进的大型语言模型',
        icon: '🧠',
        available: !!config.openai.apiKey,
        maxTokens: 8192,
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'OpenAI',
        description: '更快的GPT-4模型',
        icon: '🚀',
        available: !!config.openai.apiKey,
        maxTokens: 128000,
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'OpenAI',
        description: '快速响应的对话模型',
        icon: '⚡',
        available: !!config.openai.apiKey,
        maxTokens: 16384,
      },
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        provider: 'Google',
        description: 'Google的先进对话模型',
        icon: '💎',
        available: !!config.gemini.apiKey,
        maxTokens: 32768,
      },
      {
        id: 'deepseek-chat',
        name: 'DeepSeek Chat',
        provider: 'DeepSeek',
        description: '中文优化的对话模型',
        icon: '✨',
        available: !!config.deepseek.apiKey,
        maxTokens: 32768,
      },
    ];
  }
}

export const aiService = new AIService(); 