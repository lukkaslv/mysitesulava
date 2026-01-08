import React from 'react';
import { useData } from '../../context/DataContext';
import { BrutalistButton } from '../../components/BrutalistButton';

export const ServicesView: React.FC = () => {
  const { data, language, setBookingModalOpen } = useData();

  const labels = {
      title: language === 'ka' ? 'სერვისები და ფასები' : 'Услуги и Стоимость',
      book: language === 'ka' ? 'ჩაწერა' : 'Записаться',
      important: language === 'ka' ? 'მნიშვნელოვანი ინფორმაცია' : 'Важная информация',
      notes: language === 'ka' ? [
          'გადახდა ხდება სესიამდე 24 საათით ადრე.',
          '24 საათზე ნაკლებ დროში გაუქმებული სესია ანაზღაურდება სრულად.',
          'კონფიდენციალურობა გარანტირებულია.',
          'კონსულტაციები მხოლოდ ონლაინ.'
      ] : [
          'Оплата производится за 24 часа до сессии.',
          'Отмена менее чем за 24 часа оплачивается полностью.',
          'Конфиденциальность гарантируется этическим кодексом.',
          'Консультации только онлайн.'
      ]
  };

  return (
    <div className="p-4 md:p-12 lg:p-20">
      <h1 className="text-3xl md:text-5xl lg:text-7xl font-black mb-8 md:mb-12 uppercase leading-none tracking-tighter border-b-2 border-black pb-4 md:pb-8">
        {labels.title}
      </h1>

      <div className="grid grid-cols-1 gap-0 border-2 border-black">
        {data.services.map((service, index) => (
          <div 
            key={service.id} 
            className={`p-4 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:bg-black hover:text-white transition-all duration-200 ${
              index !== data.services.length - 1 ? 'border-b-2 border-black' : ''
            }`}
          >
            <div className="flex-grow w-full">
              <div className="flex items-baseline flex-wrap gap-2 md:gap-4 mb-2">
                <h2 className="text-xl md:text-3xl font-black uppercase">
                    {language === 'ka' ? service.title_ka : service.title_ru}
                </h2>
                <span className="font-mono text-xs md:text-base border border-current px-2 py-0.5 rounded-none whitespace-nowrap">
                  {service.duration}
                </span>
              </div>
              <p className="font-serif text-base md:text-xl opacity-80 max-w-2xl">
                 {language === 'ka' ? service.description_ka : service.description_ru}
              </p>
            </div>

            <div className="flex flex-row md:flex-col justify-between md:justify-start items-center md:items-end gap-4 min-w-[150px] w-full md:w-auto mt-2 md:mt-0">
              <span className="text-xl md:text-3xl font-mono font-bold">
                {service.price}
              </span>
              <button 
                onClick={() => setBookingModalOpen(true)}
                className="w-1/2 md:w-auto"
              >
                <BrutalistButton fullWidth className="group-hover:bg-white group-hover:text-black group-hover:border-white">
                  {labels.book}
                </BrutalistButton>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 md:mt-16 p-4 md:p-8 bg-gray-100 border-2 border-black">
        <h3 className="font-bold uppercase text-lg md:text-xl mb-4">{labels.important}</h3>
        <ul className="list-disc list-inside space-y-2 font-mono text-xs md:text-sm">
            {labels.notes.map((note, i) => (
                <li key={i}>{note}</li>
            ))}
        </ul>
      </div>
    </div>
  );
};