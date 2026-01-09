
import React from 'react';
import { useData } from '../../context/DataContext';
import { useParams, Navigate } from 'react-router-dom';
import { Page } from '../../types';

interface PageViewProps {
  pageData?: Page;
}

export const PageView: React.FC<PageViewProps> = ({ pageData }) => {
  const { data, language } = useData();
  const { slug } = useParams<{slug: string}>();

  let page = pageData;
  if (!page) {
      const activeSlug = slug || 'home';
      page = data.pages.find(p => p.slug === activeSlug);
  }

  if (!page || !page.isVisible) {
    if (slug === undefined) return null; 
    return <Navigate to="/" replace />;
  }

  const title = language === 'ka' ? page.title_ka : page.title_ru;
  const content = language === 'ka' ? page.content_ka : page.content_ru;

  return (
    <div className="px-5 py-10 md:px-12 md:py-20 lg:px-20 max-w-6xl mx-auto">
      <header className="mb-10 md:mb-16">
        <h1 className="fluid-header uppercase mb-6 md:mb-8 border-l-[10px] md:border-l-[16px] border-black pl-4 md:pl-8">
          {title}
        </h1>
      </header>
      
      <div className="space-y-6 md:space-y-10">
        {content.split('\n').map((paragraph, idx) => (
          paragraph.trim() ? (
             <p 
                key={idx} 
                className={`text-lg md:text-3xl lg:text-4xl leading-[1.4] md:leading-[1.3] font-medium 
                ${language === 'ka' ? 'font-sans tracking-normal text-gray-900' : 'font-sans font-semibold'}`}
              >
               {paragraph}
             </p>
          ) : <div key={idx} className="h-4 md:h-10" />
        ))}
      </div>
    </div>
  );
};
