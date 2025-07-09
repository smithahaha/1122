import React, { useState } from 'react';
import { FileText, Wand2, Copy, Download, Share2, Settings, Sparkles, Target } from 'lucide-react';

const ContentGenerator: React.FC = () => {
  const [contentType, setContentType] = useState('article');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [generatedContent, setGeneratedContent] = useState('');

  const contentTypes = [
    { id: 'article', name: '文章', description: '深度文章和博客内容', icon: FileText },
    { id: 'social', name: '社交媒体', description: '微博、朋友圈等社交内容', icon: Share2 },
    { id: 'marketing', name: '营销文案', description: '广告文案和营销内容', icon: Target },
    { id: 'email', name: '邮件', description: '邮件营销和通讯内容', icon: FileText },
    { id: 'script', name: '脚本', description: '视频脚本和演讲稿', icon: FileText },
    { id: 'product', name: '产品描述', description: '产品介绍和功能描述', icon: FileText },
  ];

  const tones = [
    { id: 'professional', name: '专业', description: '正式、权威的语调' },
    { id: 'casual', name: '轻松', description: '轻松、亲切的语调' },
    { id: 'creative', name: '创意', description: '富有创意和想象力' },
    { id: 'persuasive', name: '说服', description: '有说服力的语调' },
    { id: 'informative', name: '信息', description: '信息丰富、教育性' },
    { id: 'entertaining', name: '娱乐', description: '有趣、引人入胜' },
  ];

  const lengths = [
    { id: 'short', name: '短', description: '100-300字' },
    { id: 'medium', name: '中', description: '300-800字' },
    { id: 'long', name: '长', description: '800-1500字' },
  ];

  const templates = [
    {
      id: 1,
      name: '产品发布文案',
      type: 'marketing',
      preview: '🚀 重磅发布！全新产品即将上线...',
      category: '营销',
    },
    {
      id: 2,
      name: '技术博客文章',
      type: 'article',
      preview: '在这篇文章中，我们将探讨...',
      category: '技术',
    },
    {
      id: 3,
      name: '社交媒体推广',
      type: 'social',
      preview: '📱 分享一个超棒的发现...',
      category: '社交',
    },
    {
      id: 4,
      name: '邮件营销模板',
      type: 'email',
      preview: '尊敬的客户，我们很高兴地向您介绍...',
      category: '邮件',
    },
  ];

  const handleGenerate = () => {
    // 模拟生成内容
    const sampleContent = `# ${topic}

这是一篇关于${topic}的${tones.find(t => t.id === tone)?.name}风格内容。

## 主要观点

1. **重要观点一**：这里是详细的解释和分析...

2. **重要观点二**：进一步的深入讨论...

3. **重要观点三**：总结和展望...

## 结论

综上所述，${topic}是一个值得深入研究的话题。通过我们的分析，可以看出...

*本内容由AI自动生成，仅供参考。*`;

    setGeneratedContent(sampleContent);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic || 'content'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">内容生成</h1>
            <p className="text-gray-400 mt-1">AI驱动的智能内容创作工具</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-400 hover:text-white hover:border-purple-500 transition-all duration-200">
              <Settings className="h-5 w-5" />
            </button>
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Content Type */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-4">内容类型</h3>
            <div className="space-y-2">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setContentType(type.id)}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                    contentType === type.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  <div className="flex items-center">
                    <type.icon className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs opacity-75">{type.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-4">主题</h3>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="输入您想要创作的主题或关键词..."
              className="w-full h-24 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
            />
          </div>

          {/* Tone Selection */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-4">语调风格</h3>
            <div className="grid grid-cols-2 gap-2">
              {tones.map((toneOption) => (
                <button
                  key={toneOption.id}
                  onClick={() => setTone(toneOption.id)}
                  className={`p-2 rounded-lg text-sm transition-all duration-200 ${
                    tone === toneOption.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {toneOption.name}
                </button>
              ))}
            </div>
          </div>

          {/* Length Selection */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-4">内容长度</h3>
            <div className="space-y-2">
              {lengths.map((lengthOption) => (
                <button
                  key={lengthOption.id}
                  onClick={() => setLength(lengthOption.id)}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                    length === lengthOption.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  <div className="font-medium">{lengthOption.name}</div>
                  <div className="text-xs opacity-75">{lengthOption.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="w-full p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 hover:scale-105 flex items-center justify-center"
          >
            <Wand2 className="h-5 w-5 mr-2" />
            生成内容
          </button>
        </div>

        {/* Generated Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Content Output */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">生成内容</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-400 hover:text-white hover:border-purple-500 transition-all duration-200"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-400 hover:text-white hover:border-purple-500 transition-all duration-200"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 min-h-96">
              {generatedContent ? (
                <div className="text-white whitespace-pre-wrap">{generatedContent}</div>
              ) : (
                <div className="text-gray-400 text-center py-20">
                  <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>生成的内容将显示在这里</p>
                  <p className="text-sm mt-2">选择内容类型和主题，然后点击生成按钮</p>
                </div>
              )}
            </div>
          </div>

          {/* Templates */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-4">内容模板</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-purple-500/50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{template.name}</h4>
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{template.preview}</p>
                  <button className="text-purple-400 hover:text-purple-300 text-sm">
                    使用模板
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGenerator;