import React, { useState } from 'react';
import { Languages, ArrowRightLeft, Copy, Volume2, BookOpen, History } from 'lucide-react';
import { useTranslationStore } from '../stores/translationStore';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const OnlineTranslator: React.FC = () => {
  const [showHistory, setShowHistory] = useState(false);
  
  const {
    sourceText,
    translatedText,
    sourceLang,
    targetLang,
    isTranslating,
    history,
    languages,
    setSourceText,
    setSourceLang,
    setTargetLang,
    swapLanguages,
    translate,
    clearTexts,
    deleteFromHistory,
  } = useTranslationStore();

  const quickTranslations = [
    { source: 'Hello, how are you?', target: '你好，你好吗？' },
    { source: 'Thank you very much', target: '非常感谢' },
    { source: 'Good morning', target: '早上好' },
    { source: 'See you later', target: '再见' },
    { source: 'I love you', target: '我爱你' },
    { source: 'How much is this?', target: '这个多少钱？' },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSpeak = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  };

  const handleQuickTranslation = (source: string, target: string) => {
    setSourceText(source);
    // 模拟翻译结果
    setTimeout(() => {
      translate();
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">在线翻译</h1>
            <p className="text-gray-400 mt-1">支持多种语言的实时翻译服务</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
              <Languages className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Language Selection */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">源语言</label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={swapLanguages}
            className="mx-4 p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-400 hover:text-white hover:border-purple-500 transition-all duration-200"
          >
            <ArrowRightLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">目标语言</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            >
              {languages.filter(lang => lang.code !== 'auto').map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Translation Input/Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Text */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">原文</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSpeak(sourceText, sourceLang)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-slate-700"
              >
                <Volume2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleCopy(sourceText)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-slate-700"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="输入要翻译的文本..."
            className="w-full h-48 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">{sourceText.length} 字符</span>
            <button 
              onClick={clearTexts}
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              清空
            </button>
          </div>
        </div>

        {/* Translated Text */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">译文</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSpeak(translatedText, targetLang)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-slate-700"
              >
                <Volume2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleCopy(translatedText)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-slate-700"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="w-full h-48 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white">
            {isTranslating ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-400">翻译中...</span>
                </div>
              </div>
            ) : translatedText ? (
              <div className="text-white">{translatedText}</div>
            ) : (
              <span className="text-gray-400">翻译结果将显示在这里...</span>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">{translatedText.length} 字符</span>
            <button 
              onClick={translate}
              disabled={!sourceText.trim() || isTranslating}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTranslating ? '翻译中...' : '翻译'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Translations */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">常用翻译</h3>
          <BookOpen className="h-5 w-5 text-purple-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickTranslations.map((item, index) => (
            <div
              key={index}
              className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-purple-500/50 transition-all duration-200 cursor-pointer"
              onClick={() => handleQuickTranslation(item.source, item.target)}
            >
              <div className="text-sm text-white mb-1">{item.source}</div>
              <div className="text-sm text-gray-400">{item.target}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Translation History */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">翻译历史</h3>
          <History className="h-5 w-5 text-purple-400" />
        </div>
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无翻译历史</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-purple-500/50 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">{item.sourceText}</div>
                    <div className="text-sm text-gray-400 mb-2">{item.targetText}</div>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(item.timestamp), { 
                        addSuffix: true, 
                        locale: zhCN 
                      })}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(item.targetText)}
                      className="p-1 text-gray-400 hover:text-white rounded hover:bg-slate-600"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => {
                        setSourceText(item.sourceText);
                        // Auto translate after setting source text
                        setTimeout(() => translate(), 100);
                      }}
                      className="p-1 text-purple-400 hover:text-purple-300 rounded hover:bg-slate-600"
                    >
                      <ArrowRightLeft className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OnlineTranslator;