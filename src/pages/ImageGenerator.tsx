import React, { useState } from 'react';
import { ImageIcon, Wand2, Download, Share2, Settings, Palette, Sparkles, Grid3X3 } from 'lucide-react';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [size, setSize] = useState('1024x1024');
  const [quality, setQuality] = useState('standard');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const styles = [
    { id: 'realistic', name: '真实', description: '照片般真实的效果' },
    { id: 'artistic', name: '艺术', description: '艺术化风格' },
    { id: 'cartoon', name: '卡通', description: '卡通动漫风格' },
    { id: 'abstract', name: '抽象', description: '抽象艺术风格' },
    { id: 'cyberpunk', name: '赛博朋克', description: '未来科技风格' },
    { id: 'vintage', name: '复古', description: '怀旧复古风格' },
  ];

  const sizes = [
    { id: '512x512', name: '512×512', description: '小尺寸' },
    { id: '1024x1024', name: '1024×1024', description: '中尺寸' },
    { id: '1536x1536', name: '1536×1536', description: '大尺寸' },
  ];

  const qualities = [
    { id: 'standard', name: '标准', description: '平衡质量和速度' },
    { id: 'high', name: '高质量', description: '更好的细节和质量' },
  ];

  const sampleImages = [
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/7968402/pexels-photo-7968402.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=400',
  ];

  const promptTemplates = [
    {
      category: '风景',
      prompts: [
        '夕阳下的山峦，金色的光线洒在山脊上',
        '樱花盛开的日本庭院，宁静祥和',
        '星空下的草原，银河清晰可见',
        '薄雾缭绕的森林，神秘而美丽',
      ],
    },
    {
      category: '人物',
      prompts: [
        '年轻女性的肖像，温柔的微笑',
        '穿着西装的商务男士，自信专业',
        '古装美女，优雅端庄',
        '未来战士，酷炫的装备',
      ],
    },
    {
      category: '科技',
      prompts: [
        '未来城市的天际线，霓虹灯闪烁',
        '高科技实验室，先进的设备',
        '机器人和人工智能，科技感十足',
        '太空站的内部，充满未来感',
      ],
    },
    {
      category: '艺术',
      prompts: [
        '油画风格的静物，色彩丰富',
        '水彩画的花卉，清新淡雅',
        '抽象几何图案，现代艺术',
        '中国水墨画，意境深远',
      ],
    },
  ];

  const handleGenerate = () => {
    // 模拟生成图片
    setGeneratedImages(sampleImages);
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${Date.now()}.jpg`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">图片生成</h1>
            <p className="text-gray-400 mt-1">AI驱动的创意图像生成工具</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-400 hover:text-white hover:border-purple-500 transition-all duration-200">
              <Settings className="h-5 w-5" />
            </button>
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
              <Palette className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generation Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Prompt Input */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-4">描述提示</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="详细描述您想要生成的图像..."
              className="w-full h-32 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
            />
            <div className="mt-2 text-xs text-gray-400">
              建议使用详细的描述，包括风格、颜色、光线等元素
            </div>
          </div>

          {/* Style Selection */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-4">风格选择</h3>
            <div className="grid grid-cols-2 gap-2">
              {styles.map((styleOption) => (
                <button
                  key={styleOption.id}
                  onClick={() => setStyle(styleOption.id)}
                  className={`p-3 rounded-lg text-left transition-all duration-200 ${
                    style === styleOption.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  <div className="font-medium text-sm">{styleOption.name}</div>
                  <div className="text-xs opacity-75">{styleOption.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-4">图像尺寸</h3>
            <div className="space-y-2">
              {sizes.map((sizeOption) => (
                <button
                  key={sizeOption.id}
                  onClick={() => setSize(sizeOption.id)}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                    size === sizeOption.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  <div className="font-medium">{sizeOption.name}</div>
                  <div className="text-xs opacity-75">{sizeOption.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Selection */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-4">生成质量</h3>
            <div className="space-y-2">
              {qualities.map((qualityOption) => (
                <button
                  key={qualityOption.id}
                  onClick={() => setQuality(qualityOption.id)}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                    quality === qualityOption.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  <div className="font-medium">{qualityOption.name}</div>
                  <div className="text-xs opacity-75">{qualityOption.description}</div>
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
            生成图像
          </button>
        </div>

        {/* Generated Images and Templates */}
        <div className="lg:col-span-2 space-y-6">
          {/* Generated Images */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">生成结果</h3>
              <Grid3X3 className="h-5 w-5 text-purple-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {generatedImages.length > 0 ? (
                generatedImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative group bg-slate-700/30 rounded-lg overflow-hidden border border-slate-600/50 hover:border-purple-500/50 transition-all duration-200"
                  >
                    <img
                      src={image}
                      alt={`Generated ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDownload(image)}
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-200"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-200">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-20 text-gray-400">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>生成的图像将显示在这里</p>
                  <p className="text-sm mt-2">输入描述并点击生成按钮开始创作</p>
                </div>
              )}
            </div>
          </div>

          {/* Prompt Templates */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">提示模板</h3>
              <Sparkles className="h-5 w-5 text-purple-400" />
            </div>
            <div className="space-y-4">
              {promptTemplates.map((template, index) => (
                <div key={index}>
                  <h4 className="font-medium text-white mb-2">{template.category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {template.prompts.map((promptText, promptIndex) => (
                      <button
                        key={promptIndex}
                        onClick={() => setPrompt(promptText)}
                        className="p-3 bg-slate-700/30 rounded-lg text-left text-sm text-gray-300 hover:bg-slate-600/50 hover:text-white transition-all duration-200"
                      >
                        {promptText}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;