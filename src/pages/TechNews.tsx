import React, { useState } from 'react';
import { Calendar, ExternalLink, Filter, Search, TrendingUp, Clock } from 'lucide-react';

const TechNews: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: '全部', count: 128 },
    { id: 'ai', name: '人工智能', count: 32 },
    { id: 'blockchain', name: '区块链', count: 18 },
    { id: 'mobile', name: '移动技术', count: 24 },
    { id: 'cloud', name: '云计算', count: 15 },
    { id: 'security', name: '网络安全', count: 21 },
    { id: 'startup', name: '初创公司', count: 18 },
  ];

  const newsData = [
    {
      id: 1,
      title: 'ChatGPT-4 发布重大更新，支持多模态交互',
      summary: 'OpenAI 发布了 ChatGPT-4 的最新版本，增加了图像理解、语音对话等多模态功能，用户体验得到显著提升。',
      category: 'ai',
      source: 'TechCrunch',
      publishTime: '2小时前',
      readTime: '3分钟',
      trending: true,
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 2,
      title: '苹果公司宣布进军AR/VR市场，Vision Pro即将量产',
      summary: '苹果公司正式宣布其首款AR/VR设备Vision Pro进入量产阶段，预计将在2024年第一季度正式发布。',
      category: 'mobile',
      source: 'The Verge',
      publishTime: '4小时前',
      readTime: '5分钟',
      trending: true,
      image: 'https://images.pexels.com/photos/7968402/pexels-photo-7968402.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 3,
      title: '微软Azure推出新一代云服务，AI集成度大幅提升',
      summary: '微软Azure发布了新一代云服务平台，深度集成AI功能，为企业提供更智能的云解决方案。',
      category: 'cloud',
      source: 'Microsoft News',
      publishTime: '6小时前',
      readTime: '4分钟',
      trending: false,
      image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 4,
      title: '比特币突破新高，区块链技术获得更多关注',
      summary: '比特币价格再次突破历史新高，带动整个加密货币市场上涨，区块链技术应用前景广阔。',
      category: 'blockchain',
      source: 'CoinDesk',
      publishTime: '8小时前',
      readTime: '6分钟',
      trending: true,
      image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 5,
      title: '网络安全威胁升级，新型勒索软件出现',
      summary: '安全研究人员发现了一种新型勒索软件，具有更强的隐蔽性和破坏力，企业需要加强防护措施。',
      category: 'security',
      source: 'Security Week',
      publishTime: '12小时前',
      readTime: '7分钟',
      trending: false,
      image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 6,
      title: '独角兽创业公司获得10亿美元融资',
      summary: '一家专注于AI辅助编程的创业公司完成了10亿美元的C轮融资，估值达到100亿美元。',
      category: 'startup',
      source: 'TechCrunch',
      publishTime: '1天前',
      readTime: '4分钟',
      trending: false,
      image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const filteredNews = newsData.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-white">科技资讯</h1>
            <p className="text-gray-400 mt-1">获取最新的科技动态和趋势</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索资讯..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <button className="p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-400 hover:text-white hover:border-purple-500 transition-all duration-200">
              <Filter className="h-4 w-4" />
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
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600 hover:text-white'
              }`}
            >
              {category.name}
              <span className="ml-2 text-xs opacity-75">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl group overflow-hidden"
          >
            <div className="relative">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                {news.trending && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    热门
                  </span>
                )}
                <span className="px-2 py-1 bg-slate-900/70 text-white text-xs rounded-full">
                  {categories.find(c => c.id === news.category)?.name}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                {news.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {news.summary}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {news.publishTime}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {news.readTime}
                  </span>
                </div>
                <span>{news.source}</span>
              </div>
              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center">
                阅读全文
                <ExternalLink className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechNews;