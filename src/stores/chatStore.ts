import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { chatApi } from '../lib/api';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  model?: string;
  tokens?: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon: string;
  available: boolean;
  maxTokens: number;
}

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  selectedModel: string;
  isLoading: boolean;
  isStreaming: boolean;
  models: AIModel[];
  
  // Actions
  loadModels: () => Promise<void>;
  loadConversations: () => Promise<void>;
  createConversation: (title?: string) => Promise<string>;
  selectConversation: (conversationId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  updateConversationTitle: (conversationId: string, title: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  sendStreamMessage: (content: string) => Promise<void>;
  setSelectedModel: (modelId: string) => void;
  clearCurrentConversation: () => void;
  
  // Getters
  getCurrentConversation: () => Conversation | null;
  getConversationById: (id: string) => Conversation | null;
}

// 模拟AI模型
const mockModels: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    description: '最先进的大型语言模型',
    icon: '🧠',
    available: true,
    maxTokens: 8192,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: '快速响应的对话模型',
    icon: '⚡',
    available: true,
    maxTokens: 4096,
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'DeepSeek',
    description: '中文优化的对话模型',
    icon: '✨',
    available: true,
    maxTokens: 4096,
  },
];

// 模拟AI响应
const generateAIResponse = async (messages: Message[], model: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const userMessage = messages[messages.length - 1];
  const userContent = userMessage.content.toLowerCase();
  
  // 简单的规则响应系统
  if (userContent.includes('你好') || userContent.includes('hello')) {
    return `你好！我是${model}助理，很高兴为您服务。有什么我可以帮助您的吗？`;
  }
  
  if (userContent.includes('时间') || userContent.includes('现在几点')) {
    return `当前时间是：${new Date().toLocaleString('zh-CN')}`;
  }
  
  if (userContent.includes('天气')) {
    return `很抱歉，我目前无法获取实时天气信息。建议您查看天气应用或网站获取准确的天气预报。`;
  }
  
  if (userContent.includes('代码') || userContent.includes('编程')) {
    return `我可以帮助您解决编程问题！请告诉我您使用的编程语言和具体问题，我会尽力为您提供帮助。

例如：
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\``;
  }
  
  if (userContent.includes('帮助') || userContent.includes('功能')) {
    return `我可以帮助您：
    
📝 **内容创作** - 写作、润色、翻译
🧮 **问题解答** - 回答各种问题
💻 **编程协助** - 代码解释、调试建议
🎨 **创意支持** - 头脑风暴、创意想法
📊 **数据分析** - 数据解读、趋势分析
🔍 **信息查询** - 知识问答、概念解释

还有什么具体的问题吗？`;
  }
  
  // 默认响应
  const responses = [
    `这是一个很有趣的问题！让我想想...`,
    `基于您的问题，我认为...`,
    `您提到的这个点很重要，我的建议是...`,
    `我理解您的关注点，让我为您分析一下...`,
    `这个问题有多个角度可以考虑...`,
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  return `${randomResponse}

针对"${userMessage.content}"，我需要更多信息才能给出准确的回答。您能提供更多详细信息吗？

如果您有其他问题，我很乐意帮助您！`;
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      selectedModel: 'gpt-4',
      isLoading: false,
      isStreaming: false,
      models: [],

      loadModels: async () => {
        try {
          const response = await chatApi.getModels();
          set({ models: response.data.models });
        } catch (error) {
          console.error('Failed to load models:', error);
        }
      },

      loadConversations: async () => {
        try {
          set({ isLoading: true });
          const response = await chatApi.getConversations();
          set({ 
            conversations: response.data.conversations.map((conv: any) => ({
              ...conv,
              createdAt: new Date(conv.createdAt),
              updatedAt: new Date(conv.updatedAt),
              messages: conv.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })),
            })),
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to load conversations:', error);
          set({ isLoading: false });
        }
      },

      createConversation: async (title = '新对话') => {
        try {
          const response = await chatApi.createConversation({
            title,
            model: get().selectedModel,
          });
          
          const newConversation = {
            ...response.data.conversation,
            createdAt: new Date(response.data.conversation.createdAt),
            updatedAt: new Date(response.data.conversation.updatedAt),
            messages: [],
          };

          set(state => ({
            conversations: [newConversation, ...state.conversations],
            currentConversationId: newConversation.id,
          }));

          return newConversation.id;
        } catch (error) {
          console.error('Failed to create conversation:', error);
          throw error;
        }
      },

      selectConversation: async (conversationId: string) => {
        try {
          set({ currentConversationId: conversationId });
          
          // 如果对话消息未加载，从服务器获取
          const conversation = get().conversations.find(c => c.id === conversationId);
          if (conversation && conversation.messages.length === 0) {
            const response = await chatApi.getConversation(conversationId);
            const fullConversation = {
              ...response.data.conversation,
              createdAt: new Date(response.data.conversation.createdAt),
              updatedAt: new Date(response.data.conversation.updatedAt),
              messages: response.data.conversation.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })),
            };

            set(state => ({
              conversations: state.conversations.map(c =>
                c.id === conversationId ? fullConversation : c
              ),
            }));
          }
        } catch (error) {
          console.error('Failed to select conversation:', error);
        }
      },

      deleteConversation: async (conversationId: string) => {
        try {
          await chatApi.deleteConversation(conversationId);
          set(state => ({
            conversations: state.conversations.filter(c => c.id !== conversationId),
            currentConversationId: state.currentConversationId === conversationId 
              ? null 
              : state.currentConversationId,
          }));
        } catch (error) {
          console.error('Failed to delete conversation:', error);
          throw error;
        }
      },

      updateConversationTitle: async (conversationId: string, title: string) => {
        try {
          await chatApi.updateConversation(conversationId, { title });
          set(state => ({
            conversations: state.conversations.map(c =>
              c.id === conversationId ? { ...c, title, updatedAt: new Date() } : c
            ),
          }));
        } catch (error) {
          console.error('Failed to update conversation title:', error);
          throw error;
        }
      },

      sendMessage: async (content: string) => {
        const { currentConversationId, selectedModel } = get();
        
        if (!currentConversationId) {
          // 创建新对话
          const newConversationId = await get().createConversation();
          set({ currentConversationId: newConversationId });
        }

        try {
          set({ isLoading: true });
          
          const response = await chatApi.sendMessage(currentConversationId, {
            content,
            role: 'user',
          });

          const { userMessage, aiMessage } = response.data;

          // 更新对话中的消息
          set(state => ({
            conversations: state.conversations.map(c =>
              c.id === currentConversationId
                ? { 
                    ...c, 
                    messages: [
                      ...c.messages, 
                      {
                        ...userMessage,
                        timestamp: new Date(userMessage.timestamp),
                      },
                      {
                        ...aiMessage,
                        timestamp: new Date(aiMessage.timestamp),
                      }
                    ], 
                    updatedAt: new Date() 
                  }
                : c
            ),
            isLoading: false,
          }));

          // 更新对话标题（如果是第一条消息）
          const conversation = get().getCurrentConversation();
          if (conversation && conversation.messages.length === 2) {
            const title = content.length > 30 ? content.substring(0, 30) + '...' : content;
            get().updateConversationTitle(conversation.id, title);
          }
        } catch (error) {
          set({ isLoading: false });
          console.error('发送消息失败:', error);
          throw error;
        }
      },

      sendStreamMessage: async (content: string) => {
        const { currentConversationId, selectedModel } = get();
        
        if (!currentConversationId) {
          // 创建新对话
          const newConversationId = await get().createConversation();
          set({ currentConversationId: newConversationId });
        }

        const userMessage: Message = {
          id: uuidv4(),
          role: 'user',
          content,
          timestamp: new Date(),
          model: selectedModel,
        };

        // 添加用户消息
        set(state => ({
          conversations: state.conversations.map(c =>
            c.id === currentConversationId
              ? { ...c, messages: [...c.messages, userMessage], updatedAt: new Date() }
              : c
          ),
          isStreaming: true,
        }));

        const aiMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          model: selectedModel,
          isStreaming: true,
        };

        // 添加空的AI消息，用于流式更新
        set(state => ({
          conversations: state.conversations.map(c =>
            c.id === currentConversationId
              ? { ...c, messages: [...c.messages, aiMessage], updatedAt: new Date() }
              : c
          ),
        }));

        try {
          const eventSource = new EventSource(
            `http://localhost:3001/api/chat/conversations/${currentConversationId}/stream`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.error) {
              console.error('Stream error:', data.error);
              eventSource.close();
              set({ isStreaming: false });
              return;
            }

            if (data.done) {
              eventSource.close();
              set(state => ({
                conversations: state.conversations.map(c =>
                  c.id === currentConversationId
                    ? {
                        ...c,
                        messages: c.messages.map(m =>
                          m.id === aiMessage.id
                            ? { ...m, isStreaming: false }
                            : m
                        ),
                      }
                    : c
                ),
                isStreaming: false,
              }));
              return;
            }

            // 更新流式消息内容
            set(state => ({
              conversations: state.conversations.map(c =>
                c.id === currentConversationId
                  ? {
                      ...c,
                      messages: c.messages.map(m =>
                        m.id === aiMessage.id
                          ? { ...m, content: m.content + data.content }
                          : m
                      ),
                    }
                  : c
              ),
            }));
          };

          eventSource.onerror = (error) => {
            console.error('EventSource error:', error);
            eventSource.close();
            set({ isStreaming: false });
          };

          // 发送消息到服务器
          fetch(`http://localhost:3001/api/chat/conversations/${currentConversationId}/stream`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
            },
            body: JSON.stringify({ message: content, model: selectedModel }),
          }).catch(error => {
            console.error('Failed to send stream message:', error);
            eventSource.close();
            set({ isStreaming: false });
          });
        } catch (error) {
          set({ isStreaming: false });
          throw error;
        }
      },

      setSelectedModel: (modelId: string) => {
        set({ selectedModel: modelId });
      },

      clearCurrentConversation: () => {
        const { currentConversationId } = get();
        if (currentConversationId) {
          set(state => ({
            conversations: state.conversations.map(c =>
              c.id === currentConversationId
                ? { ...c, messages: [], updatedAt: new Date() }
                : c
            ),
          }));
        }
      },

      getCurrentConversation: () => {
        const { conversations, currentConversationId } = get();
        return conversations.find(c => c.id === currentConversationId) || null;
      },

      getConversationById: (id: string) => {
        const { conversations } = get();
        return conversations.find(c => c.id === id) || null;
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
        selectedModel: state.selectedModel,
      }),
    }
  )
); 