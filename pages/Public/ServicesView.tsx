
import React from 'react';
import { useData } from '../../context/DataContext';
import { BrutalistButton } from '../../components/BrutalistButton';

export const ServicesView: React.FC = () => {
  const { data, language, setBookingModalOpen } = useData();

  const labels = {
      title: language === 'ka' ? (data.ui.services_title?.ka || 'სერვისები') : (data.ui.services_title?.ru || 'УСЛУГИ'),
      book: language === 'ka' ? data.ui.book_btn.ka : data.ui.book_btn.ru,
      important: language === 'ka' ? data.ui.important_info_title.ka : data.ui.important_info_title.ru,
  };

  const importantNotes = (language === 'ka' ? data.ui.important_info_text.ka : data.ui.important_info_text.ru)
    .split('\n')
    .filter(line => line.trim() !== '');

  return (
    <div className="px-5 py-10 md:px-12 md:py-20 lg:px-20 max-w-7xl mx-auto">
      <h1 className="fluid-header uppercase mb-12 border-l-[10px] md:border-l-[16px] border-black pl-4 md:pl-8">
        {labels.title}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        {data.services.map((service) => (
          <div 
            key={service.id} 
            className="group flex flex-col justify-between p-6 md:p-10 border-4 border-black shadow-[8px_8px_0px_0px_black] hover:shadow-[12px_12px_0px_0px_black] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 bg-white"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-2">
                <h2 className={`text-xl md:text-2xl font-black uppercase leading-tight ${language === 'ka' ? 'font-sans' : ''}`}>
                    {language === 'ka' ? service.title_ka : service.title_ru}
                </h2>
                <div className="bg-black text-white text-[10px] md:text-xs font-mono px-3 py-1 font-bold whitespace-nowrap uppercase">
                  {service.duration}
                </div>
              </div>
              
              <p className={`text-sm md:text-lg text-gray-700 leading-relaxed ${language === 'ka' ? 'tracking-normal' : ''}`}>
                 {language === 'ka' ? service.description_ka : service.description_ru}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-black/10 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase opacity-50 mb-1">
                  {language === 'ka' ? 'ღირებულება' : 'стоимость'}
                </span>
                <span className="text-2xl md:text-3xl font-mono font-black italic">
                  {service.price}
                </span>
              </div>
              <BrutalistButton 
                onClick={() => setBookingModalOpen(true)}
                className="text-[11px] md:text-sm py-3 px-6 bg-black text-white hover:bg-white hover:text-black shadow-none border-2"
              >
                {labels.book}
              </BrutalistButton>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 md:mt-32 p-6 md:p-12 border-4 border-black bg-accent relative overflow-hidden">
        {/* Subtle decorative elements for important block */}
        <div className="absolute -right-4 -top-4 opacity-5 rotate-12 pointer-events-none">
            <div className="text-9xl font-black italic">INFO</div>
        </div>
        
        <h3 className="font-black uppercase text-lg md:text-2xl mb-8 flex items-center gap-4">
            <span className="w-3 h-8 bg-black"></span>
            {labels.important}
        </h3>
        
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs md:text-lg">
            {importantNotes.map((note, i) => (
                <li key={i} className="flex gap-4 p-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_black]">
                   <span className="font-black text-red-600">!</span>
                   <span className="leading-snug">{note}</span>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
