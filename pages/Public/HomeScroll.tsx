
import React from 'react';
import { useData } from '../../context/DataContext';
import { PageView } from './PageView';
import { ServicesView } from './ServicesView';

export const HomeScroll: React.FC = () => {
  const { data } = useData();

  const homePage = data.pages.find(p => p.slug === 'home');
  const otherPages = data.pages
    .filter(p => p.isVisible && p.slug !== 'home')
    .sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col bg-white">
      {/* Home Page */}
      {homePage && (
          <section id="home">
            <PageView pageData={homePage} />
          </section>
      )}

      <div className="section-divider opacity-10" />

      {/* Services */}
      <section id="services">
        <ServicesView />
      </section>

      {/* Other Pages */}
      {otherPages.map((page) => (
        <React.Fragment key={page.id}>
          <div className="section-divider" />
          <section id={page.slug}>
            <PageView pageData={page} />
          </section>
        </React.Fragment>
      ))}
    </div>
  );
};
