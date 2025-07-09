import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { translateApi } from '../lib/api';

export interface Translation {
  id: string;
  sourceText: string;
  targetText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: Date;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

interface TranslationState {
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  isTranslating: boolean;
  history: Translation[];
  languages: Language[];
  
  // Actions
  setSourceText: (text: string) => void;
  setSourceLang: (lang: string) => void;
  setTargetLang: (lang: string) => void;
  swapLanguages: () => void;
  translate: () => Promise<void>;
  clearTexts: () => void;
  loadHistory: () => Promise<void>;
  deleteFromHistory: (id: string) => Promise<void>;
  loadLanguages: () => Promise<void>;
}

const languages: Language[] = [
  { code: 'auto', name: '自动检测', flag: '🌐' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

// 模拟翻译函数
const mockTranslate = async (text: string, from: string, to: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  const translations: Record<string, Record<string, string>> = {
    'hello': { 'zh-CN': '你好', 'ja': 'こんにちは', 'ko': '안녕하세요', 'fr': 'bonjour', 'es': 'hola' },
    'thank you': { 'zh-CN': '谢谢', 'ja': 'ありがとう', 'ko': '감사합니다', 'fr': 'merci', 'es': 'gracias' },
    'goodbye': { 'zh-CN': '再见', 'ja': 'さようなら', 'ko': '안녕히 계세요', 'fr': 'au revoir', 'es': 'adiós' },
    'how are you': { 'zh-CN': '你好吗', 'ja': '元気ですか', 'ko': '어떻게 지내세요', 'fr': 'comment allez-vous', 'es': '¿cómo estás?' },
    'good morning': { 'zh-CN': '早上好', 'ja': 'おはよう', 'ko': '좋은 아침', 'fr': 'bonjour', 'es': 'buenos días' },
    'good night': { 'zh-CN': '晚安', 'ja': 'おやすみ', 'ko': '안녕히 주무세요', 'fr': 'bonne nuit', 'es': 'buenas noches' },
    'yes': { 'zh-CN': '是', 'ja': 'はい', 'ko': '네', 'fr': 'oui', 'es': 'sí' },
    'no': { 'zh-CN': '不', 'ja': 'いいえ', 'ko': '아니요', 'fr': 'non', 'es': 'no' },
    'please': { 'zh-CN': '请', 'ja': 'お願いします', 'ko': '제발', 'fr': 's\'il vous plaît', 'es': 'por favor' },
    'excuse me': { 'zh-CN': '打扰一下', 'ja': 'すみません', 'ko': '실례합니다', 'fr': 'excusez-moi', 'es': 'disculpe' },
  };
  
  const lowerText = text.toLowerCase().trim();
  const translation = translations[lowerText];
  
  if (translation && translation[to]) {
    return translation[to];
  }
  
  // 简单的字符替换模拟
  if (to === 'zh-CN' && from === 'en') {
    return `[中文翻译] ${text}`;
  } else if (to === 'en' && from === 'zh-CN') {
    return `[English Translation] ${text}`;
  } else if (to === 'ja') {
    return `[日本語翻訳] ${text}`;
  } else if (to === 'ko') {
    return `[한국어 번역] ${text}`;
  } else if (to === 'fr') {
    return `[Traduction française] ${text}`;
  } else if (to === 'es') {
    return `[Traducción española] ${text}`;
  }
  
  return `[${to}] ${text}`;
};

export const useTranslationStore = create<TranslationState>()(
  persist(
    (set, get) => ({
      sourceText: '',
      translatedText: '',
      sourceLang: 'auto',
      targetLang: 'zh-CN',
      isTranslating: false,
      history: [],
      languages,

      setSourceText: (text: string) => {
        set({ sourceText: text });
      },

      setSourceLang: (lang: string) => {
        set({ sourceLang: lang });
      },

      setTargetLang: (lang: string) => {
        set({ targetLang: lang });
      },

      swapLanguages: () => {
        const { sourceLang, targetLang, sourceText, translatedText } = get();
        if (sourceLang !== 'auto') {
          set({
            sourceLang: targetLang,
            targetLang: sourceLang,
            sourceText: translatedText,
            translatedText: sourceText,
          });
        }
      },

      translate: async () => {
        const { sourceText, sourceLang, targetLang } = get();
        
        if (!sourceText.trim()) return;
        
        set({ isTranslating: true });
        
        try {
          const response = await translateApi.translate({
            text: sourceText,
            from: sourceLang,
            to: targetLang,
            detectLang: sourceLang === 'auto',
          });
          
          set(state => ({
            translatedText: response.data.translatedText,
            isTranslating: false,
          }));
        } catch (error) {
          set({ isTranslating: false });
          console.error('翻译失败:', error);
        }
      },

      clearTexts: () => {
        set({ sourceText: '', translatedText: '' });
      },

      loadHistory: async () => {
        try {
          const response = await translateApi.getHistory();
          set({ history: response.data.history });
        } catch (error) {
          console.error('加载翻译历史失败:', error);
        }
      },

      deleteFromHistory: async (id: string) => {
        try {
          await translateApi.deleteHistory(id);
          set(state => ({
            history: state.history.filter(item => item.id !== id),
          }));
        } catch (error) {
          console.error('删除翻译历史失败:', error);
        }
      },

      loadLanguages: async () => {
        try {
          const response = await translateApi.getLanguages();
          set({ languages: response.data.languages });
        } catch (error) {
          console.error('加载语言列表失败:', error);
          // 使用默认语言列表
          set({ languages });
        }
      },
    }),
    {
      name: 'translation-storage',
      partialize: (state) => ({
        history: state.history,
        sourceLang: state.sourceLang,
        targetLang: state.targetLang,
      }),
    }
  )
); 