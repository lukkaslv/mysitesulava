import React from 'react';
import { useData } from '../../context/DataContext';
import { useParams, Navigate } from 'react-router-dom';
import { Page } from '../../types';

interface PageViewProps {
  pageData?: Page; // Allow passing page data directly
}

export const PageView: React.FC<PageViewProps> = ({ pageData }) => {
  const { data, language } = useData();
  const { slug } = useParams<{slug: string}>();

  // If pageData is provided (home scroll mode), use it.
  // Otherwise, look up by slug from URL.
  let page = pageData;
  
  if (!page) {
      // If root path "/" and no pageData passed, default to 'home' logic handled by HomeScroll usually,
      // but for direct / access we fallback.
      const activeSlug = slug || 'home';
      page = data.pages.find(p => p.slug === activeSlug);
  }

  if (!page || !page.isVisible) {
    if (slug === undefined) {
         // Should ideally not happen if HomeScroll is used, but safe fallback
         return null; 
    }
    return <Navigate to="/" replace />;
  }

  const title = language === 'ka' ? page.title_ka : page.title_ru;
  const content = language === 'ka' ? page.content_ka : page.content_ru;

  return (
    <div className="p-4 md:p-12 lg:p-20">
      <h1 className="text-3xl md:text-5xl lg:text-7xl font-black mb-8 md:mb-12 uppercase leading-none tracking-tighter break-words border-b-2 border-black pb-4 md:pb-8">
        {title}
      </h1>
      
      <div className="prose prose-lg md:prose-xl prose-p:font-sans prose-p:text-black prose-headings:font-bold prose-headings:uppercase max-w-none">
        {content.split('\n').map((paragraph, idx) => (
          paragraph.trim() ? (
             <p key={idx} className="mb-4 md:mb-6 leading-relaxed font-medium text-base md:text-xl">
               {paragraph}
             </p>
          ) : <br key={idx} />
        ))}
      </div>
    </div>
  );
};