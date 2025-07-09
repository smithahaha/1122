import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AIChat from './pages/AIChat';
import TechNews from './pages/TechNews';
import DietRecommendation from './pages/DietRecommendation';
import OnlineTranslator from './pages/OnlineTranslator';
import KnowledgeBase from './pages/KnowledgeBase';
import ContentGenerator from './pages/ContentGenerator';
import ImageGenerator from './pages/ImageGenerator';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { useAuthStore } from './stores/authStore';
import { useChatStore } from './stores/chatStore';

// 路由守卫组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const { loadModels } = useChatStore();
  const [appInitialized, setAppInitialized] = useState(false);

  // 应用初始化时检查认证状态
  useEffect(() => {
    const initApp = async () => {
      try {
        await checkAuth();
        setAppInitialized(true);
      } catch (error) {
        console.error('App initialization error:', error);
        setAppInitialized(true);
      }
    };

    initApp();
  }, [checkAuth]);

  // 当认证状态改变时加载模型
  useEffect(() => {
    if (isAuthenticated && appInitialized) {
      loadModels();
    }
  }, [isAuthenticated, loadModels, appInitialized]);

  // 显示加载状态
  if (!appInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">正在初始化应用...</p>
        </div>
      </div>
    );
  }
  return (
    <Router>
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
        
        {/* 受保护的路由 */}
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/ai-chat" element={<AIChat />} />
                <Route path="/tech-news" element={<TechNews />} />
                <Route path="/diet-recommendation" element={<DietRecommendation />} />
                <Route path="/translator" element={<OnlineTranslator />} />
                <Route path="/knowledge-base" element={<KnowledgeBase />} />
                <Route path="/content-generator" element={<ContentGenerator />} />
                <Route path="/image-generator" element={<ImageGenerator />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;