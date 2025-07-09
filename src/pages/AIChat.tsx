import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Settings, Zap, Brain, Sparkles, Plus, Trash2, Edit2 } from 'lucide-react';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';
import ReactMarkdown from 'react-markdown';

const AIChat: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [showConversations, setShowConversations] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    conversations,
    currentConversationId,
    selectedModel,
    isLoading,
    models,
    createConversation,
    selectConversation,
    deleteConversation,
    sendMessage,
    setSelectedModel,
    getCurrentConversation,
  } = useChatStore();
  
  const { isAuthenticated } = useAuthStore();

  const currentConversation = getCurrentConversation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  const handleSend = async () => {
    if (inputValue.trim() && !isLoading) {
      await sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewConversation = async () => {
    await createConversation();
    setShowConversations(false);
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Conversations Sidebar */}
      <div className={`${showConversations ? 'w-80' : 'w-16'} transition-all duration-300`}>
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 h-full flex flex-col">
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowConversations(!showConversations)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-slate-700"
              >
                <Settings className="h-5 w-5" />
              </button>
              {showConversations && (
                <button
                  onClick={handleNewConversation}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200"
                >
                  <Plus className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          
          {showConversations && (
            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                      currentConversationId === conversation.id
                        ? 'bg-purple-600/20 border border-purple-500/50'
                        : 'bg-slate-700/30 hover:bg-slate-700/50'
                    }`}
                    onClick={async () => await selectConversation(conversation.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                          {conversation.title}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {conversation.messages.length} 条消息
                        </div>
                      </div>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await deleteConversation(conversation.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Model Selection */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-4 border border-slate-700/50 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">模型选择</h2>
            <div className="text-sm text-gray-400">
              {currentConversation?.messages.length || 0} 条消息
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  selectedModel === model.id
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                    : 'border-slate-600 bg-slate-700/50 text-gray-300 hover:border-purple-400'
                }`}
              >
                <div className="flex items-center">
                  <div className="text-lg mr-2">{model.icon}</div>
                  <div className="text-left">
                    <div className="font-medium">{model.name}</div>
                    <div className="text-xs opacity-75">{model.provider}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {!currentConversation?.messages.length ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Bot className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">开始新对话吧！</p>
                </div>
              </div>
            ) : (
              currentConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-slate-700/50 text-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0">
                        {message.role === 'user' ? (
                          <User className="h-5 w-5 mt-0.5" />
                        ) : (
                          <Bot className="h-5 w-5 mt-0.5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium mb-1">
                          {message.role === 'user' ? '您' : 'AI助理'}
                        </div>
                        <div className="text-sm leading-relaxed">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                        <div className="text-xs opacity-75 mt-1">
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700/50 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-gray-400" />
                    <div className="text-sm text-gray-400">AI正在思考...</div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="输入您的问题..."
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
                  rows={3}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;