import React, { useState } from 'react';
import { Section, ServiceItem, Language } from './types';
import GlitchHeader from './components/GlitchHeader';
import TerminalBox from './components/TerminalBox';
import { ArrowDown, Mail, Phone, MapPin, Heart, X, Menu, Globe, MessageCircle, Send, Instagram, UserPlus } from 'lucide-react';

const services: ServiceItem[] = [
  {
    id: '1',
    code: 'INIT_SESSION',
    title: { ru: 'Начало пути', ka: 'გზის დასაწყისი' },
    description: { 
      ru: 'Первичная консультация. Разбор текущего состояния, поиск системных ошибок и определение вектора движения.', 
      ka: 'პირველადი კონსულტაცია. მიმდინარე მდგომარეობის ანალიზი, სისტემური შეცდომების ძიება და მოძრაობის ვექტორის განსაზღვრა.' 
    },
    price: { ru: '120 ЛАРИ', ka: '120 ლარი' },
    duration: { ru: '60 МИН', ka: '60 წუთი' }
  },
  {
    id: '2',
    code: 'DEEP_DIVE',
    title: { ru: 'Глубинная трансформация', ka: 'ღრმა ტრანსფორმაცია' },
    description: { 
      ru: 'Глубинная работа with иллюзиями и болью. Трансформация травматичного опыта в ресурс.', 
      ka: 'ღრმა მუშაობა ილუზიებთან და ტკივილთან. ტრავმული გამოცდილების რესურსად გარდაქმნა.' 
    },
    price: { ru: '120 ЛАРИ', ka: '120 ლარი' },
    duration: { ru: '60 МИН', ka: '60 წუთი' }
  },
  {
    id: '3',
    code: 'VOCATION',
    title: { ru: 'Поиск призвания', ka: 'მოწოდების ძებნა' },
    description: { 
      ru: 'Для тех, кто застрял на нелюбимой работе. Поиск дела, которое приносит удовольствие душе.', 
      ka: 'მათთვის, ვინც გაიჭედა საძულველ სამსახურში. იმ საქმის ძიება, რომელიც სულს სიამოვნებას ანიჭებს.' 
    },
    price: { ru: '120 ЛАРИ', ka: '120 ლარი' },
    duration: { ru: '60 МИН', ka: '60 წუთი' }
  },
  {
    id: '4',
    code: 'SUPPORT',
    title: { ru: 'Петля поддержки', ka: 'მხარდაჭერის ციკლი' },
    description: { 
      ru: 'Регулярная поддержка на пути изменений. Чтобы не свернуть назад при первых трудностях.', 
      ka: 'რეგულარული მხარდაჭერა ცვლილებების გზაზე. რათა პირველივე სირთულეებისას უკან არ დაიხიოთ.' 
    },
    price: { ru: '120 ЛАРИ', ka: '120 ლარი' },
    duration: { ru: '60 МИН', ka: '60 წუთი' }
  }
];

const translations = {
  ru: {
    heroTag: 'ПОЛЬЗОВАТЕЛЬ: ЛУКА_СУЛАВА // СТАТУС: ПРОБУЖДЕН',
    heroTitle: 'СКВОЗЬ ТЕРНИИ К СВОЕМУ ИСТИННОМУ Я',
    heroDesc: '8 лет в нелюбимой системе. Я взломал цикл, чтобы помочь тебе найти твой.',
    btnStart: 'ЗАПИСАТЬСЯ',
    btnStory: 'МОЯ ИСТОРИЯ',
    nav: { INIT: 'ГЛАВНАЯ', BIO: 'ОБО МНЕ', SERVICES: 'УСЛУГИ', CONTACT: 'КОНТАКТЫ' },
    bioHeader: 'ИСХОДНЫЙ_КОД',
    bioSub: 'О ЛУКЕ',
    identity: 'МОДУЛЬ_ЛИЧНОСТИ',
    idName: 'ИМЯ: ЛУКА СУЛАВА',
    idAge: 'ВОЗРАСТ: 24 ГОДА',
    idMission: 'МИССИЯ: ПРОВОДНИК_ПО_ПУТИ',
    bioText1: 'Восемь лет я провел в системе, которая работала со сбоями. Работа не приносила радости, только страдание. Я понял: КРИТИЧЕСКАЯ_ОШИБКА_СИСТЕМЫ.',
    bioText2: 'Я нашел дело, которое приносит удовольствие моей душе. Я поступил на психолога. Это были годы рефлексии, боли, разрушения иллюзий и трансформаций.',
    bioQuote: '«Я здесь, чтобы поделиться этим опытом и помочь тебе пройти твой собственный путь через тернии».',
    protocolsHeader: 'ПРОТОКОЛЫ',
    protocolsSub: 'ВЫБОР_ВЗАИМОДЕЙСТВИЯ',
    contactHeader: 'УСТАНОВИТЬ_СВЯЗЬ',
    contactSub: 'НАПИШИ, ЕСЛИ ОТКЛИКАЕТСЯ',
    contactTitle: 'Прямое соединение',
    contactDesc: 'Если мой путь откликается тебе, и ты готов начать свой — пиши.',
    locationInfo: 'Консультации только онлайн через мессенджеры',
    formName: 'Ваше имя',
    formContact: 'Контакт (Email/Телефон)',
    formMsg: 'Сообщение',
    formPlaceholder: 'ОТКЛИКАЕТСЯ ЛИ ВАМ?',
    formBtn: 'ОТПРАВИТЬ_СИГНАЛ',
    priceLabel: 'Цена',
    timeLabel: 'Время',
    initBtn: 'Инициализировать_сеанс',
    footer: 'ЛУКА СУЛАВА // ТЕРМИНАЛ_ПУТИ v24.3'
  },
  ka: {
    heroTag: 'მომხმარებელი: ლუკა_სულავა // სტატუსი: გამოღვიძებული',
    heroTitle: 'ეკლებით საკუთარი ნამდვილი მე-სკენ',
    heroDesc: '8 წელი საძულველ სისტემაში. მე გავტეხე ციკლი, რათა დაგეხმარო შენი გზის პოვნაში.',
    btnStart: 'ჩაწერა',
    btnStory: 'ჩემი ისტორია',
    nav: { INIT: 'მთავარი', BIO: 'ჩემს შესახებ', SERVICES: 'სერვისები', CONTACT: 'კონტაქტი' },
    bioHeader: 'საწყისი_კოდი',
    bioSub: 'ლუკას შესახებ',
    identity: 'პიროვნების_მოდული',
    idName: 'სახელი: ლუკა სულავა',
    idAge: 'ასაკი: 24 წელი',
    idMission: 'მისია: გზამკვლევი',
    bioText1: 'რვა წელი გავატარე სისტემაში, რომელიც ხარვეზებით მუშაობდა. სამსახურს სიხარული არ მოჰქონდა, მხოლოდ ტანჯვა. მივხვდი: სისტემის_კრიტიკული_შეცდომა.',
    bioText2: 'ვიპოვე საქმე, რომელიც ჩემს სულს სიამოვნებას ანიჭებს. ჩავაბარე ფსიქოლოგიაზე. ეს იყო რეფლექსიის, ტკივილის, ილუზიების მსხვრევისა და ტრანსფორმაციის წლები.',
    bioQuote: '„მე აქ ვარ იმისთვის, რომ გაგიზიაროთ ეს გამოცდილება და დაგეხმაროთ საკუთარი გზის გავლაში ეკლებს შორის“.',
    protocolsHeader: 'პროტოკოლები',
    protocolsSub: 'ურთიერთქმედების არჩევა',
    contactHeader: 'კავშირის დამყარება',
    contactSub: 'მოიწერეთ, თუ გეხმიანებათ',
    contactTitle: 'პირდაპირი კავშირი',
    contactDesc: 'თუ ჩემი გზა გეხმიანებათ და მზად ხართ საკუთარი გზის დასაწყებად — მოიწერეთ.',
    locationInfo: 'კონსულტაციები მხოლოდ ონლაინ მესინჯერების საშუალებით',
    formName: 'თქვენი სახელი',
    formContact: 'კონტაქტი (Email/ტელეფონი)',
    formMsg: 'შეტყობინება',
    formPlaceholder: 'გეხმიანებათ ეს?',
    formBtn: 'სიგნალის_გაგზავნა',
    priceLabel: 'ფასი',
    timeLabel: 'დრო',
    initBtn: 'სეანსის_ინიცირება',
    footer: 'ლუკა სულავა // გზის_ტერმინალი v24.3'
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ru');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const t = translations[lang];

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setShowMobileMenu(false);
    }
  };

  const toggleLang = () => setLang(prev => prev === 'ru' ? 'ka' : 'ru');

  return (
    <div className="min-h-screen bg-white text-black font-mono selection:bg-black selection:text-white overflow-x-hidden crt">
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex justify-between items-center">
          <div className="text-black font-black text-xl md:text-2xl tracking-tighter flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-4 h-4 bg-black animate-pulse"></div>
            LUKA_SULAVA
          </div>

          <div className="hidden lg:flex gap-10 text-xs font-bold tracking-widest">
            {Object.entries(Section).map(([key, value]) => (
              <button key={key} onClick={() => scrollTo(value)} className="text-zinc-500 hover:text-black hover:underline decoration-2 underline-offset-4 transition-all uppercase whitespace-nowrap">
                {`./${t.nav[key as keyof typeof Section]}`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleLang} className="flex items-center gap-2 border-2 border-black px-4 py-2 font-black text-xs hover:bg-black hover:text-white transition-all uppercase">
              <Globe size={16} />
              {lang === 'ru' ? 'KA' : 'RU'}
            </button>
            <button className="lg:hidden text-black p-2 border-2 border-black hover:bg-black hover:text-white transition-all" onClick={() => setShowMobileMenu(!showMobileMenu)}>
               {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {showMobileMenu && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-8 h-screen w-screen overflow-y-auto">
          <div className="flex flex-col gap-8 text-3xl font-black italic">
            {Object.entries(Section).map(([key, value]) => (
              <button key={key} onClick={() => scrollTo(value)} className="text-left border-b-4 border-black pb-6 text-zinc-400 hover:text-black hover:pl-4 transition-all uppercase">
                {`> ${t.nav[key as keyof typeof Section]}`}
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="pt-32 px-6 md:px-12 max-w-7xl mx-auto space-y-32 md:space-y-48 pb-32">
        {/* HERO SECTION */}
        <section id={Section.HOME} className="min-h-[60vh] flex flex-col justify-center relative">
          <div className="space-y-8 md:space-y-12 max-w-5xl z-10">
            <div className="inline-block px-4 py-2 bg-black text-white text-[10px] md:text-xs font-bold tracking-[0.2em] mb-2 uppercase">
              {t.heroTag}
            </div>
            <h1 className="text-4xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-black leading-[0.9] tracking-tighter uppercase break-words">
              {lang === 'ru' ? (
                <>СКВОЗЬ <br className="hidden md:block"/> <span className="text-white bg-black px-3 md:px-6 inline-block transform -rotate-1">ТЕРНИИ</span> <br/> К ИСТИННОМУ Я</>
              ) : (
                <>ეკლებით <br className="hidden md:block"/> <span className="text-white bg-black px-3 md:px-6 inline-block transform -rotate-1">საკუთარი</span> <br/> ნამდვილი მე-სკენ</>
              )}
            </h1>
            <p className="text-xl md:text-3xl text-zinc-600 max-w-2xl leading-relaxed font-bold">
              {t.heroDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 pt-6 md:pt-10 w-full md:w-auto">
              <button onClick={() => scrollTo(Section.CONTACT)} className="w-full sm:w-auto px-10 py-5 bg-black text-white font-black text-lg hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none uppercase tracking-wider">
                <UserPlus size={24} />
                {t.btnStart}
              </button>
              <button onClick={() => scrollTo(Section.ABOUT)} className="w-full sm:w-auto px-10 py-5 border-4 border-black text-black font-black text-lg hover:bg-zinc-50 transition-all flex items-center justify-center gap-3 active:translate-y-1 uppercase tracking-wider">
                {t.btnStory}
                <ArrowDown size={24} />
              </button>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id={Section.ABOUT}>
          <GlitchHeader text={t.bioHeader} subtext={t.bioSub} className="mb-16 md:mb-24" />
          <div className="grid lg:grid-cols-12 gap-12 md:gap-20 items-start">
            <div className="lg:col-span-7 order-2 lg:order-1 space-y-8 text-lg md:text-xl leading-relaxed text-zinc-800">
              <div className="p-8 border-4 border-black bg-zinc-50 mb-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                 <p className="font-mono text-xs md:text-sm text-zinc-500 mb-4 font-black uppercase tracking-widest">// {t.identity}</p>
                 <ul className="space-y-3 text-black font-black uppercase text-base md:text-lg">
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-black"></div> {t.idName}</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-black"></div> {t.idAge}</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-black"></div> {t.idMission}</li>
                 </ul>
              </div>
              <p className="font-medium">{t.bioText1}</p>
              <p className="font-medium">{t.bioText2}</p>
              <div className="border-l-[12px] border-black pl-8 py-4 bg-zinc-50">
                <p className="italic text-black font-black text-2xl md:text-3xl leading-tight">{t.bioQuote}</p>
              </div>
            </div>
            <div className="lg:col-span-5 order-1 lg:order-2 relative">
              <div className="aspect-[4/5] bg-white relative border-4 border-black group overflow-hidden shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
                 <img src="https://picsum.photos/800/1000?grayscale" alt="Luka" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale" />
                 <div className="absolute inset-0 border-4 border-black pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 bg-white border-2 border-black px-4 py-2 text-xs text-black font-black uppercase tracking-widest">LUKA_SULAVA_01</div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id={Section.SERVICES}>
          <GlitchHeader text={t.protocolsHeader} subtext={t.protocolsSub} className="mb-16 md:mb-24" />
          <div className="grid md:grid-cols-2 gap-10 md:gap-16">
            {services.map((service) => (
              <TerminalBox key={service.id} title={service.code} className="h-full flex flex-col shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="p-8 md:p-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-8">
                    <h3 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tighter leading-none">{service.title[lang]}</h3>
                    <Heart size={28} className="text-black shrink-0 ml-4" />
                  </div>
                  <p className="text-zinc-600 mb-10 text-base md:text-lg flex-grow font-bold leading-relaxed">{service.description[lang]}</p>
                  <div className="border-t-4 border-black pt-8 mt-auto flex justify-between items-end bg-zinc-50 -mx-8 md:-mx-10 px-8 md:px-10 pb-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">{t.priceLabel}</span>
                      <span className="text-black font-black text-2xl">{service.price[lang]}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">{t.timeLabel}</span>
                      <span className="text-black font-black italic uppercase text-lg">{service.duration[lang]}</span>
                    </div>
                  </div>
                  <button onClick={() => scrollTo(Section.CONTACT)} className="w-full mt-6 bg-black text-white py-5 text-sm uppercase tracking-[0.3em] transition-all border-2 border-black hover:bg-white hover:text-black font-black active:translate-y-1">
                    {t.initBtn}
                  </button>
                </div>
              </TerminalBox>
            ))}
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id={Section.CONTACT} className="pb-40">
          <GlitchHeader text={t.contactHeader} subtext={t.contactSub} className="mb-16 md:mb-24" />
          <div className="border-4 border-black bg-white p-8 md:p-16 lg:p-20 relative overflow-hidden shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
            <div className="grid lg:grid-cols-2 gap-16 md:gap-24 relative z-10">
              <div className="space-y-12">
                <div>
                  <h3 className="text-3xl md:text-4xl font-black text-black mb-8 uppercase italic tracking-tighter underline decoration-black decoration-8 underline-offset-8">{t.contactTitle}</h3>
                  <p className="text-zinc-600 mb-10 text-lg md:text-xl font-bold leading-relaxed">{t.contactDesc}</p>
                  <div className="space-y-8 font-mono">
                    <a href="https://t.me/st0rm1she" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 text-black group">
                      <div className="p-4 border-2 border-black bg-black text-white group-hover:bg-white group-hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"><Send size={24} /></div>
                      <span className="font-black text-lg md:text-xl break-all">Telegram: @st0rm1she</span>
                    </a>
                    <a href="https://wa.me/995557448161" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 text-black group">
                      <div className="p-4 border-2 border-black bg-black text-white group-hover:bg-white group-hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"><MessageCircle size={24} /></div>
                      <span className="font-black text-lg md:text-xl break-all">WhatsApp: +995557448161</span>
                    </a>
                    <a href="https://instagram.com/sulava.psycho" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 text-black group">
                      <div className="p-4 border-2 border-black bg-black text-white group-hover:bg-white group-hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"><Instagram size={24} /></div>
                      <span className="font-black text-lg md:text-xl break-all">Instagram: sulava.psycho</span>
                    </a>
                    <div className="flex items-center gap-6 text-black group pt-4">
                      <div className="p-4 border-2 border-black bg-black text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"><MapPin size={24} /></div>
                      <span className="font-black text-lg md:text-xl">{t.locationInfo}</span>
                    </div>
                  </div>
                </div>
              </div>
              <form className="space-y-8 bg-zinc-50 p-8 md:p-12 border-2 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-3">
                  <label className="text-[11px] uppercase text-black tracking-[0.3em] font-black">{t.formName}</label>
                  <input type="text" className="w-full bg-white border-2 border-black p-4 text-black focus:bg-zinc-100 outline-none transition-all placeholder-zinc-300 font-black text-lg" placeholder="..." />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] uppercase text-black tracking-[0.3em] font-black">{t.formContact}</label>
                  <input type="text" className="w-full bg-white border-2 border-black p-4 text-black focus:bg-zinc-100 outline-none transition-all placeholder-zinc-300 font-black text-lg" placeholder="..." />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] uppercase text-black tracking-[0.3em] font-black">{t.formMsg}</label>
                  <textarea rows={4} className="w-full bg-white border-2 border-black p-4 text-black focus:bg-zinc-100 outline-none transition-all placeholder-zinc-300 font-black text-lg resize-none" placeholder={t.formPlaceholder} />
                </div>
                <button className="w-full bg-black text-white font-black uppercase py-6 hover:bg-zinc-800 transition-all tracking-[0.4em] text-sm md:text-base shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none">
                  {t.formBtn}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-8 border-black bg-black py-16 text-center text-[10px] md:text-xs text-white font-mono uppercase tracking-[0.5em] px-4">
        <p className="font-black text-sm md:text-base mb-4">{t.footer}</p>
        <p className="opacity-40">© 2024</p>
      </footer>
    </div>
  );
};

export default App;