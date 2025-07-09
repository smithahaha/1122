import OpenAI from 'openai';
import { config } from '../config/config';

export interface TranslateRequest {
  text: string;
  from: string;
  to: string;
  detectLang?: boolean;
}

export interface TranslateResponse {
  translatedText: string;
  detectedLang?: string;
  confidence: number;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export class TranslateService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.translate.apiKey,
      baseURL: config.openai.baseUrl,
    });
  }

  async translate(request: TranslateRequest): Promise<TranslateResponse> {
    const { text, from, to, detectLang = false } = request;

    try {
      // 如果需要检测语言
      let detectedLang: string | undefined;
      if (detectLang || from === 'auto') {
        detectedLang = await this.detectLanguage(text);
      }

      const sourceLang = from === 'auto' ? detectedLang || 'auto' : from;
      const targetLang = to;

      // 使用OpenAI进行翻译
      const translatedText = await this.translateWithOpenAI(text, sourceLang, targetLang);

      return {
        translatedText,
        detectedLang,
        confidence: 0.95, // 固定置信度，实际应用中可以根据模型返回调整
      };
    } catch (error) {
      throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async translateBatch(texts: string[], from: string, to: string): Promise<string[]> {
    const translations = await Promise.all(
      texts.map(text => this.translate({ text, from, to }))
    );

    return translations.map(t => t.translatedText);
  }

  async detectLanguage(text: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a language detection expert. Reply with ONLY the language code (e.g., "en", "zh-CN", "ja", "ko", "fr", "es", "de") for the given text.',
          },
          {
            role: 'user',
            content: `Detect the language of this text: "${text}"`,
          },
        ],
        temperature: 0.1,
        max_tokens: 10,
      });

      const detectedLang = response.choices[0].message.content?.trim().toLowerCase();
      return detectedLang || 'auto';
    } catch (error) {
      console.error('Language detection failed:', error);
      return 'auto';
    }
  }

  private async translateWithOpenAI(text: string, from: string, to: string): Promise<string> {
    const languageMap: Record<string, string> = {
      'zh-CN': 'Chinese (Simplified)',
      'zh-TW': 'Chinese (Traditional)',
      'en': 'English',
      'ja': 'Japanese',
      'ko': 'Korean',
      'fr': 'French',
      'es': 'Spanish',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'th': 'Thai',
      'vi': 'Vietnamese',
    };

    const sourceLangName = languageMap[from] || from;
    const targetLangName = languageMap[to] || to;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the given text from ${sourceLangName} to ${targetLangName}. Only return the translated text, without any explanations or additional content.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const translatedText = response.choices[0].message.content;
    if (!translatedText) {
      throw new Error('No translation received from OpenAI');
    }

    return translatedText;
  }

  getSupportedLanguages(): Language[] {
    return [
      { code: 'auto', name: '自动检测', flag: '🌐' },
      { code: 'zh-CN', name: '中文(简体)', flag: '🇨🇳' },
      { code: 'zh-TW', name: '中文(繁体)', flag: '🇹🇼' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'ja', name: '日本語', flag: '🇯🇵' },
      { code: 'ko', name: '한국어', flag: '🇰🇷' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'it', name: 'Italiano', flag: '🇮🇹' },
      { code: 'pt', name: 'Português', flag: '🇵🇹' },
      { code: 'ru', name: 'Русский', flag: '🇷🇺' },
      { code: 'ar', name: 'العربية', flag: '🇸🇦' },
      { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
      { code: 'th', name: 'ไทย', flag: '🇹🇭' },
      { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    ];
  }
}

export const translateService = new TranslateService(); 