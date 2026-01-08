import React from 'react';
import { useData } from '../../context/DataContext';
import { PageView } from './PageView';
import { ServicesView } from './ServicesView';

export const HomeScroll: React.FC = () => {
  const { data } = useData();

  // 1. Find Home Page
  const homePage = data.pages.find(p => p.slug === 'home');

  // 2. Filter other visible pages (excluding home)
  const otherPages = data.pages
    .filter(p => p.isVisible && p.slug !== 'home')
    .sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col">
      {/* 1. Home Page First */}
      {homePage && (
          <div id="home">
            <PageView pageData={homePage} />
          </div>
      )}

      {/* 2. Services Immediately After Home */}
      <div id="services" className="border-t-2 border-black">
        <ServicesView />
      </div>

      {/* 3. Other Pages (Method, Manifesto, etc.) */}
      {otherPages.map((page) => (
        <div 
            key={page.id} 
            id={page.slug}
            className="border-t-2 border-black"
        >
          <PageView pageData={page} />
        </div>
      ))}
    </div>
  );
};