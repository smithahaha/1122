import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  Newspaper, 
  Utensils, 
  Languages, 
  BookOpen, 
  FileText, 
  ImageIcon,
  Clock,
  Calendar,
  Activity
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const features = [
    {
      name: 'AI对话',
      description: '与智能助手对话，获取专业建议',
      icon: MessageCircle,
      href: '/ai-chat',
      color: 'from-blue-500 to-purple-600',
    },
    {
      name: '科技资讯',
      description: '获取最新科技动态和趋势',
      icon: Newspaper,
      href: '/tech-news',
      color: 'from-green-500 to-teal-600',
    },
    {
      name: '饮食建议',
      description: '个性化健康饮食方案',
      icon: Utensils,
      href: '/diet-recommendation',
      color: 'from-orange-500 to-red-600',
    },
    {
      name: '在线翻译',
      description: '多语言实时翻译服务',
      icon: Languages,
      href: '/translator',
      color: 'from-purple-500 to-pink-600',
    },
    {
      name: '知识库',
      description: '构建个人知识管理系统',
      icon: BookOpen,
      href: '/knowledge-base',
      color: 'from-indigo-500 to-blue-600',
    },
    {
      name: '内容生成',
      description: 'AI驱动的内容创作工具',
      icon: FileText,
      href: '/content-generator',
      color: 'from-yellow-500 to-orange-600',
    },
    {
      name: '图片生成',
      description: '创意图像生成和编辑',
      icon: ImageIcon,
      href: '/image-generator',
      color: 'from-pink-500 to-rose-600',
    },
  ];

  const recentActivities = [
    { name: '最近对话', value: '2小时前', icon: Clock },
    { name: '今日任务', value: '5个已完成', icon: Calendar },
    { name: '系统状态', value: '运行正常', icon: Activity },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          欢迎使用个人AI助理
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          集成多种AI功能，为您提供智能化的工作和生活助手服务
        </p>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentActivities.map((activity) => (
          <div
            key={activity.name}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <activity.icon className="h-8 w-8 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">{activity.name}</p>
                <p className="text-lg font-semibold text-white">{activity.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.name}
            to={feature.href}
            className="group relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
              {feature.name}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {feature.description}
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-bold text-white mb-4">快速操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 hover:scale-105">
            新建对话
          </button>
          <button className="p-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl text-white font-medium hover:from-green-700 hover:to-teal-700 transition-all duration-200 hover:scale-105">
            查看资讯
          </button>
          <button className="p-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl text-white font-medium hover:from-orange-700 hover:to-red-700 transition-all duration-200 hover:scale-105">
            饮食计划
          </button>
          <button className="p-4 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl text-white font-medium hover:from-pink-700 hover:to-rose-700 transition-all duration-200 hover:scale-105">
            创作图片
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;