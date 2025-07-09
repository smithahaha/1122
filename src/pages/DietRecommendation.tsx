import React, { useState } from 'react';
import { User, Target, Calendar, Clock, Apple, Utensils, TrendingUp } from 'lucide-react';

const DietRecommendation: React.FC = () => {
  const [userProfile, setUserProfile] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    activity: '',
    goal: '',
    restrictions: [] as string[],
  });

  const [currentPlan, setCurrentPlan] = useState('balanced');

  const dietPlans = [
    {
      id: 'balanced',
      name: '均衡饮食',
      description: '营养均衡，适合大多数人',
      calories: '2000',
      protein: '150g',
      carbs: '250g',
      fat: '65g',
      color: 'from-green-500 to-teal-600',
    },
    {
      id: 'weight-loss',
      name: '减脂饮食',
      description: '低热量，高蛋白，促进减脂',
      calories: '1500',
      protein: '120g',
      carbs: '150g',
      fat: '50g',
      color: 'from-blue-500 to-purple-600',
    },
    {
      id: 'muscle-gain',
      name: '增肌饮食',
      description: '高蛋白，充足碳水，支持肌肉增长',
      calories: '2500',
      protein: '200g',
      carbs: '300g',
      fat: '80g',
      color: 'from-orange-500 to-red-600',
    },
  ];

  const mealSchedule = [
    {
      time: '07:00',
      meal: '早餐',
      foods: ['燕麦粥', '蓝莓', '坚果', '低脂牛奶'],
      calories: 380,
      icon: '🌅',
    },
    {
      time: '10:00',
      meal: '上午加餐',
      foods: ['苹果', '杏仁'],
      calories: 150,
      icon: '🍎',
    },
    {
      time: '12:30',
      meal: '午餐',
      foods: ['糙米饭', '鸡胸肉', '蔬菜沙拉', '橄榄油'],
      calories: 520,
      icon: '🍽️',
    },
    {
      time: '15:30',
      meal: '下午加餐',
      foods: ['希腊酸奶', '蜂蜜'],
      calories: 120,
      icon: '🥛',
    },
    {
      time: '18:00',
      meal: '晚餐',
      foods: ['三文鱼', '红薯', '西兰花', '坚果'],
      calories: 480,
      icon: '🐟',
    },
  ];

  const nutritionTips = [
    {
      title: '多喝水',
      description: '每天至少8杯水，促进新陈代谢',
      icon: '💧',
    },
    {
      title: '规律进食',
      description: '定时定量，避免暴饮暴食',
      icon: '⏰',
    },
    {
      title: '多吃蔬菜',
      description: '每餐至少一半蔬菜，补充维生素',
      icon: '🥗',
    },
    {
      title: '适量运动',
      description: '配合饮食，增强体质',
      icon: '🏃',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">饮食建议</h1>
            <p className="text-gray-400 mt-1">根据您的身体状况制定个性化饮食方案</p>
          </div>
          <button className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">个人信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">年龄</label>
            <input
              type="number"
              placeholder="28"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              value={userProfile.age}
              onChange={(e) => setUserProfile({...userProfile, age: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">身高 (cm)</label>
            <input
              type="number"
              placeholder="175"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              value={userProfile.height}
              onChange={(e) => setUserProfile({...userProfile, height: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">体重 (kg)</label>
            <input
              type="number"
              placeholder="70"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              value={userProfile.weight}
              onChange={(e) => setUserProfile({...userProfile, weight: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Diet Plans */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">饮食方案</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dietPlans.map((plan) => (
            <div
              key={plan.id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                currentPlan === plan.id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-slate-600 bg-slate-700/50 hover:border-purple-400'
              }`}
              onClick={() => setCurrentPlan(plan.id)}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${plan.color} flex items-center justify-center mb-3`}>
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">{plan.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{plan.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">热量:</span>
                  <span className="text-white ml-1">{plan.calories}</span>
                </div>
                <div>
                  <span className="text-gray-400">蛋白质:</span>
                  <span className="text-white ml-1">{plan.protein}</span>
                </div>
                <div>
                  <span className="text-gray-400">碳水:</span>
                  <span className="text-white ml-1">{plan.carbs}</span>
                </div>
                <div>
                  <span className="text-gray-400">脂肪:</span>
                  <span className="text-white ml-1">{plan.fat}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Schedule */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">今日饮食安排</h2>
          <button className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
            <Calendar className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          {mealSchedule.map((meal, index) => (
            <div key={index} className="flex items-center p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
              <div className="text-2xl mr-4">{meal.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{meal.meal}</h3>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {meal.time}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {meal.foods.map((food, foodIndex) => (
                    <span
                      key={foodIndex}
                      className="px-2 py-1 bg-slate-600/50 text-gray-300 text-xs rounded-full"
                    >
                      {food}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{meal.calories} 卡路里</span>
                  <button className="text-purple-400 hover:text-purple-300 text-sm">
                    详情
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition Tips */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">营养建议</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nutritionTips.map((tip, index) => (
            <div key={index} className="flex items-start p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
              <div className="text-2xl mr-3">{tip.icon}</div>
              <div>
                <h3 className="font-semibold text-white mb-1">{tip.title}</h3>
                <p className="text-sm text-gray-400">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DietRecommendation;