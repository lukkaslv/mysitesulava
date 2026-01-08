import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/Layout';
import { PageView } from './pages/Public/PageView';
import { ServicesView } from './pages/Public/ServicesView';
import { HomeScroll } from './pages/Public/HomeScroll';
import { AdminDashboard } from './pages/Admin/AdminDashboard';

const App: React.FC = () => {
  return (
    <DataProvider>
      <HashRouter>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Public Routes - Wrapped in Layout */}
          
          {/* Home Route: Renders ALL pages in order (Home -> Method -> Manifesto...) then Services */}
          <Route path="/" element={
            <Layout>
                <HomeScroll />
            </Layout>
          } />
          
          {/* Individual routes if accessed directly */}
          <Route path="/services" element={<Layout><ServicesView /></Layout>} />
          <Route path="/:slug" element={<Layout><PageView /></Layout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </DataProvider>
  );
};

export default App;