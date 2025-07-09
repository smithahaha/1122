import React, { useState } from 'react';
import { Plus, Search, Filter, BookOpen, File, Folder, Tag, Star, Clock } from 'lucide-react';

const KnowledgeBase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const categories = [
    { id: 'all', name: '全部', count: 42, icon: BookOpen },
    { id: 'tech', name: '技术', count: 15, icon: File },
    { id: 'business', name: '商业', count: 8, icon: Folder },
    { id: 'personal', name: '个人', count: 12, icon: Star },
    { id: 'notes', name: '笔记', count: 7, icon: Tag },
  ];

  const knowledgeItems = [
    {
      id: 1,
      title: 'React 开发最佳实践',
      content: '总结了React开发中的各种最佳实践和常见陷阱...',
      category: 'tech',
      tags: ['React', 'JavaScript', 'Frontend'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      favorite: true,
      type: 'article',
    },
    {
      id: 2,
      title: '产品管理方法论',
      content: '如何进行有效的产品管理和团队协作...',
      category: 'business',
      tags: ['产品管理', '团队协作', '方法论'],
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      favorite: false,
      type: 'document',
    },
    {
      id: 3,
      title: '学习计划模板',
      content: '个人学习计划的制定和执行模板...',
      category: 'personal',
      tags: ['学习', '计划', '个人发展'],
      createdAt: '2024-01-05',
      updatedAt: '2024-01-15',
      favorite: true,
      type: 'template',
    },
    {
      id: 4,
      title: 'AI 技术趋势分析',
      content: '2024年AI技术发展趋势和应用前景...',
      category: 'tech',
      tags: ['AI', '技术趋势', '分析'],
      createdAt: '2024-01-12',
      updatedAt: '2024-01-22',
      favorite: false,
      type: 'analysis',
    },
    {
      id: 5,
      title: '会议记录 - 项目评审',
      content: '项目评审会议的要点和决议记录...',
      category: 'notes',
      tags: ['会议', '项目', '评审'],
      createdAt: '2024-01-08',
      updatedAt: '2024-01-08',
      favorite: false,
      type: 'note',
    },
    {
      id: 6,
      title: '设计系统指南',
      content: 'UI/UX设计系统的构建和维护指南...',
      category: 'tech',
      tags: ['设计', 'UI/UX', '系统'],
      createdAt: '2024-01-03',
      updatedAt: '2024-01-16',
      favorite: true,
      type: 'guide',
    },
  ];

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return '📄';
      case 'document': return '📋';
      case 'template': return '📝';
      case 'analysis': return '📊';
      case 'note': return '📌';
      case 'guide': return '📖';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'from-blue-500 to-purple-600';
      case 'document': return 'from-green-500 to-teal-600';
      case 'template': return 'from-orange-500 to-red-600';
      case 'analysis': return 'from-purple-500 to-pink-600';
      case 'note': return 'from-yellow-500 to-orange-600';
      case 'guide': return 'from-indigo-500 to-blue-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-white">知识库</h1>
            <p className="text-gray-400 mt-1">构建和管理您的个人知识体系</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索知识..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <button className="p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-400 hover:text-white hover:border-purple-500 transition-all duration-200">
              <Filter className="h-4 w-4" />
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              新建
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600 hover:text-white'
              }`}
            >
              <category.icon className="h-4 w-4 mr-2" />
              {category.name}
              <span className="ml-2 text-xs opacity-75">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${getTypeColor(item.type)}`}>
                  <span className="text-lg">{getTypeIcon(item.type)}</span>
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {categories.find(c => c.id === item.category)?.name}
                  </p>
                </div>
              </div>
              {item.favorite && (
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              )}
            </div>
            
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
              {item.content}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-slate-700/50 text-gray-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {item.updatedAt}
              </div>
              <button className="text-purple-400 hover:text-purple-300">
                编辑
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h3 className="font-semibold text-white mb-4">快速操作</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105">
            新建文档
          </button>
          <button className="p-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl text-white font-medium hover:from-green-700 hover:to-teal-700 transition-all duration-200 hover:scale-105">
            导入文件
          </button>
          <button className="p-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl text-white font-medium hover:from-orange-700 hover:to-red-700 transition-all duration-200 hover:scale-105">
            创建模板
          </button>
          <button className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 hover:scale-105">
            备份数据
          </button>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;