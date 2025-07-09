import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Settings, 
  Camera, 
  Edit3, 
  Save,
  Shield,
  Bell,
  Palette,
  Globe,
  Download,
  Trash2
} from 'lucide-react';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    username: 'AI用户',
    email: 'user@example.com',
    phone: '+86 138 0013 8000',
    birthday: '1990-01-01',
    location: '北京市',
    bio: '热爱科技，探索AI的无限可能',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  });

  const tabs = [
    { id: 'profile', name: '个人信息', icon: User },
    { id: 'security', name: '安全设置', icon: Shield },
    { id: 'notifications', name: '通知设置', icon: Bell },
    { id: 'preferences', name: '偏好设置', icon: Palette },
  ];

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // 保存逻辑将在这里实现
    console.log('Profile saved:', profileData);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={profileData.avatar}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-purple-500/20"
          />
          <button className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{profileData.username}</h3>
          <p className="text-gray-400">{profileData.email}</p>
          <p className="text-sm text-gray-500 mt-1">加入时间：2024年1月</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">用户名</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={profileData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              disabled={!isEditing}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">邮箱地址</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">手机号码</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">生日</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={profileData.birthday}
              onChange={(e) => handleInputChange('birthday', e.target.value)}
              disabled={!isEditing}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 transition-all duration-200"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">所在地区</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              disabled={!isEditing}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 transition-all duration-200"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">个人简介</label>
          <textarea
            value={profileData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            disabled={!isEditing}
            rows={3}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 resize-none transition-all duration-200"
            placeholder="介绍一下自己..."
          />
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50">
        <h3 className="text-lg font-semibold text-white mb-4">密码设置</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">当前密码</label>
            <input
              type="password"
              placeholder="输入当前密码"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">新密码</label>
            <input
              type="password"
              placeholder="输入新密码"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">确认新密码</label>
            <input
              type="password"
              placeholder="再次输入新密码"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
            更新密码
          </button>
        </div>
      </div>

      <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50">
        <h3 className="text-lg font-semibold text-white mb-4">两步验证</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white">启用两步验证</p>
            <p className="text-sm text-gray-400">为您的账户添加额外的安全保护</p>
          </div>
          <button className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-500 transition-all duration-200">
            启用
          </button>
        </div>
      </div>

      <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50">
        <h3 className="text-lg font-semibold text-white mb-4">登录设备</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-600/30 rounded-lg">
            <div>
              <p className="text-white">Chrome on Windows</p>
              <p className="text-sm text-gray-400">当前设备 • 北京</p>
            </div>
            <span className="text-green-400 text-sm">活跃</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-600/30 rounded-lg">
            <div>
              <p className="text-white">Safari on iPhone</p>
              <p className="text-sm text-gray-400">2天前 • 上海</p>
            </div>
            <button className="text-red-400 hover:text-red-300 text-sm">
              移除
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50">
        <h3 className="text-lg font-semibold text-white mb-4">邮件通知</h3>
        <div className="space-y-4">
          {[
            { name: '系统更新', description: '接收系统更新和新功能通知' },
            { name: '安全提醒', description: '账户安全相关的重要通知' },
            { name: '使用报告', description: '每周使用情况统计报告' },
            { name: '营销邮件', description: '产品推广和优惠信息' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="text-white">{item.name}</p>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={index < 2}
                className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50">
        <h3 className="text-lg font-semibold text-white mb-4">推送通知</h3>
        <div className="space-y-4">
          {[
            { name: '桌面通知', description: '在桌面显示重要通知' },
            { name: '声音提醒', description: '播放通知声音' },
            { name: '免打扰模式', description: '在指定时间段内静音通知' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="text-white">{item.name}</p>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={index === 0}
                className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50">
        <h3 className="text-lg font-semibold text-white mb-4">界面设置</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">主题模式</label>
            <select className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20">
              <option value="dark">深色模式</option>
              <option value="light">浅色模式</option>
              <option value="auto">跟随系统</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">语言设置</label>
            <select className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20">
              <option value="zh-CN">简体中文</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50">
        <h3 className="text-lg font-semibold text-white mb-4">AI设置</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">默认AI模型</label>
            <select className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20">
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="deepseek-chat">DeepSeek Chat</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">启用上下文记忆</p>
              <p className="text-sm text-gray-400">AI会记住之前的对话内容</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50">
        <h3 className="text-lg font-semibold text-white mb-4">数据管理</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200">
            <Download className="h-4 w-4 mr-2" />
            导出我的数据
          </button>
          <button className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200">
            <Trash2 className="h-4 w-4 mr-2" />
            删除账户
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">个人中心</h1>
            <p className="text-gray-400 mt-1">管理您的账户信息和偏好设置</p>
          </div>
          <div className="flex items-center space-x-2">
            {activeTab === 'profile' && (
              <>
                {isEditing ? (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    保存
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    编辑
                  </button>
                )}
              </>
            )}
            <button className="p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-400 hover:text-white hover:border-purple-500 transition-all duration-200">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50">
        <div className="flex border-b border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'security' && renderSecurityTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'preferences' && renderPreferencesTab()}
        </div>
      </div>
    </div>
  );
};

export default Profile;