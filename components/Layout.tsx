import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ExternalLink } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, language, setLanguage, bookingModalOpen, setBookingModalOpen } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Secret Admin Trigger State
  const [secretClicks, setSecretClicks] = useState(0);

  // Filter visible pages and sort by order
  const navPages = [...data.pages]
    .filter(p => p.isVisible)
    .sort((a, b) => a.order - b.order);

  const isActive = (path: string) => location.pathname === path;

  const toggleLanguage = () => {
      setLanguage(language === 'ka' ? 'ru' : 'ka');
  };

  const bookLabel = language === 'ka' ? 'ჩაწერა' : 'ЗАПИСАТЬСЯ';
  
  // Social Links
  const whatsappLink = `https://wa.me/${data.profile.phone.replace(/[^0-9]/g, '')}`;
  const telegramLink = `https://t.me/${data.profile.telegram.replace('@', '')}`;
  const instagramLink = `https://instagram.com/${data.profile.instagram.replace('@', '')}`;

  const handleSecretClick = () => {
      const newCount = secretClicks + 1;
      setSecretClicks(newCount);
      if (newCount >= 5) {
          setSecretClicks(0);
          navigate('/admin');
      }
      // Reset count after 2 seconds if not completed
      setTimeout(() => setSecretClicks(0), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Top Border */}
      <div className="h-2 bg-black w-full" />

      {/* Header */}
      <header className="border-b-2 border-black sticky top-0 bg-white z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex justify-between items-center">
          
          {/* Logo / Name */}
          <Link to="/" className="flex flex-col group relative min-w-0 flex-shrink">
            <h1 className="text-lg md:text-2xl font-black uppercase tracking-tighter group-hover:bg-black group-hover:text-white px-2 -ml-2 transition-colors truncate">
              {language === 'ka' ? data.profile.name_ka : data.profile.name_ru}
            </h1>
            <span className="text-[10px] md:text-xs font-mono font-bold tracking-widest uppercase text-gray-500 group-hover:text-black px-2 -ml-2 truncate">
              {language === 'ka' ? data.profile.title_ka : data.profile.title_ru}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-0 border-l-2 border-black h-full items-center">
             <button 
                onClick={toggleLanguage}
                className="h-full flex items-center px-4 lg:px-6 border-r-2 border-black font-mono font-bold hover:bg-black hover:text-white transition-colors"
            >
                {language.toUpperCase()}
            </button>
            {navPages.map((page) => (
              <Link
                key={page.id}
                to={`/${page.slug}`}
                className={`h-full flex items-center px-4 lg:px-8 border-r-2 border-black font-mono font-bold uppercase hover:bg-black hover:text-white transition-colors ${
                  isActive(`/${page.slug}`) || (location.pathname === '/' && page.slug === 'home') 
                    ? 'bg-black text-white' 
                    : ''
                }`}
              >
                {language === 'ka' ? page.title_ka : page.title_ru}
              </Link>
            ))}
            <Link
              to="/services"
              className={`h-full flex items-center px-4 lg:px-8 border-r-2 border-black font-mono font-bold uppercase hover:bg-black hover:text-white transition-colors ${
                isActive('/services') ? 'bg-black text-white' : ''
              }`}
            >
               {language === 'ka' ? 'სერვისები' : 'Услуги'}
            </Link>
             <button 
                onClick={() => setBookingModalOpen(true)}
                className="h-full flex items-center px-6 lg:px-8 border-r-2 border-black bg-black text-white font-mono font-bold uppercase hover:bg-red-600 transition-colors"
            >
                {bookLabel}
            </button>
          </nav>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-2">
             <button 
                onClick={toggleLanguage}
                className="border-2 border-black font-mono font-bold text-xs hover:bg-black hover:text-white transition-colors w-9 h-9 flex items-center justify-center"
            >
                {language.toUpperCase()}
            </button>
            <button 
                onClick={() => setBookingModalOpen(true)}
                className="border-2 border-black bg-black text-white font-mono font-bold text-xs hover:bg-red-600 transition-colors h-9 px-3 flex items-center justify-center uppercase"
            >
                {bookLabel}
            </button>
            <button 
                className="border-2 border-black hover:bg-black hover:text-white transition-colors w-9 h-9 flex items-center justify-center"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b-2 border-black bg-white fixed top-16 left-0 right-0 z-30 shadow-xl">
          {navPages.map((page) => (
            <Link
              key={page.id}
              to={`/${page.slug}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block p-4 border-b-2 border-black font-mono font-bold uppercase hover:bg-black hover:text-white"
            >
              {language === 'ka' ? page.title_ka : page.title_ru}
            </Link>
          ))}
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-4 border-b-2 border-black font-mono font-bold uppercase hover:bg-black hover:text-white"
          >
             {language === 'ka' ? 'სერვისები' : 'Услуги'}
          </Link>
        </div>
      )}

      {/* --- BOOKING MODAL --- */}
      {bookingModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
              <div className="bg-white border-4 border-white md:border-black max-w-sm w-full p-6 relative shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <button 
                    onClick={() => setBookingModalOpen(false)}
                    className="absolute top-2 right-2 p-2 hover:bg-black hover:text-white transition-colors"
                  >
                      <X size={24} />
                  </button>
                  
                  <h3 className="text-2xl font-black uppercase mb-6 text-center border-b-2 border-black pb-4">
                      {language === 'ka' ? 'აირჩიეთ მეთოდი' : 'Выберите способ'}
                  </h3>
                  
                  <div className="flex flex-col gap-4">
                      <a 
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-4 border-2 border-black font-bold uppercase hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors group"
                      >
                          <span>WhatsApp</span>
                          <ExternalLink size={20} />
                      </a>
                      <a 
                        href={telegramLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-4 border-2 border-black font-bold uppercase hover:bg-[#0088cc] hover:text-white hover:border-[#0088cc] transition-colors group"
                      >
                          <span>Telegram</span>
                          <ExternalLink size={20} />
                      </a>
                      <a 
                        href={instagramLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-4 border-2 border-black font-bold uppercase hover:bg-[#C13584] hover:text-white hover:border-[#C13584] transition-colors group"
                      >
                          <span>Instagram</span>
                          <ExternalLink size={20} />
                      </a>
                  </div>

                  <p className="mt-6 text-xs font-mono text-center text-gray-500">
                    {language === 'ka' ? 'ჩვენ გიპასუხებთ 24 საათის განმავლობაში.' : 'Мы ответим вам в течение 24 часов.'}
                  </p>
              </div>
          </div>
      )}

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto md:border-l-2 md:border-r-2 border-black overflow-hidden pb-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black bg-black text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4 font-mono uppercase">
                {language === 'ka' ? 'კონტაქტი' : 'Контакты'}
            </h3>
            <p className="mb-2 font-mono text-sm opacity-80">
                 {language === 'ka' ? data.profile.location_ka : data.profile.location_ru}
            </p>
            <div className="flex flex-col gap-2 mt-4">
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-2">
                    WhatsApp: {data.profile.phone}
                </a>
                <a href={telegramLink} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-2">
                    Telegram: @{data.profile.telegram.replace('@', '')}
                </a>
                <a href={instagramLink} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-2">
                    Instagram: @{data.profile.instagram.replace('@', '')}
                </a>
                <a href={`mailto:${data.profile.email}`} className="hover:underline flex items-center gap-2 mt-2">
                    Email: {data.profile.email}
                </a>
            </div>
          </div>
          <div className="md:text-right flex flex-col justify-between">
             <div 
                className="mt-8 md:mt-0 cursor-pointer select-none" 
                onClick={handleSecretClick}
                title="Rights"
             >
                <p className="font-mono text-xs md:text-sm text-gray-400">
                   © {new Date().getFullYear()} {language === 'ka' ? data.profile.name_ka : data.profile.name_ru}.<br/>
                   {language === 'ka' ? 'ყველა უფლება დაცულია.' : 'Все права защищены.'}
                </p>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};