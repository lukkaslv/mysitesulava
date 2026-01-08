
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData, DataContextType, Page, Profile, Service, Language } from '../types';
import { DEFAULT_DATA } from '../constants';
import { db } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

const DataContext = createContext<DataContextType & { importData: (newData: AppData) => void, isLoading: boolean } | undefined>(undefined);

const LANG_KEY = 'brutalist_psych_lang';
const FIRESTORE_DOC_ID = 'website_content';

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  // Default language set to Georgian ('ka')
  const [language, setLanguageState] = useState<Language>('ka');
  const [isLoading, setIsLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // 1. Initial Load and Subscription to Real-time Updates
  useEffect(() => {
    const savedLang = localStorage.getItem(LANG_KEY) as Language;
    if (savedLang && (savedLang === 'ka' || savedLang === 'ru')) {
        setLanguageState(savedLang);
    }

    // Subscribe to Firestore document
    const unsub = onSnapshot(doc(db, "content", FIRESTORE_DOC_ID), (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data() as AppData);
      } else {
        // If document doesn't exist, create it with default data
        saveToFirebase(DEFAULT_DATA);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  const saveToFirebase = async (newData: AppData) => {
    try {
      await setDoc(doc(db, "content", FIRESTORE_DOC_ID), newData);
    } catch (e) {
      console.error("Error saving to Firebase:", e);
      alert("Ошибка при сохранении в облако.");
    }
  };

  const setLanguage = (lang: Language) => {
      setLanguageState(lang);
      localStorage.setItem(LANG_KEY, lang);
  };

  const updateProfile = (profile: Profile) => {
    const newData = { ...data, profile };
    setData(newData);
    saveToFirebase(newData);
  };

  const addService = (service: Service) => {
    const newData = { ...data, services: [...data.services, service] };
    setData(newData);
    saveToFirebase(newData);
  };

  const updateService = (updatedService: Service) => {
    const newData = {
      ...data,
      services: data.services.map(s => s.id === updatedService.id ? updatedService : s)
    };
    setData(newData);
    saveToFirebase(newData);
  };

  const deleteService = (id: string) => {
    const newData = {
      ...data,
      services: data.services.filter(s => s.id !== id)
    };
    setData(newData);
    saveToFirebase(newData);
  };

  const addPage = (page: Page) => {
    const newData = { ...data, pages: [...data.pages, page] };
    setData(newData);
    saveToFirebase(newData);
  };

  const updatePage = (updatedPage: Page) => {
    const newData = {
      ...data,
      pages: data.pages.map(p => p.id === updatedPage.id ? updatedPage : p)
    };
    setData(newData);
    saveToFirebase(newData);
  };

  const deletePage = (id: string) => {
    const newData = {
      ...data,
      pages: data.pages.filter(p => p.id !== id)
    };
    setData(newData);
    saveToFirebase(newData);
  };

  const importData = (newData: AppData) => {
    setData(newData);
    saveToFirebase(newData);
    alert('Данные успешно импортированы!');
  };

  const resetToDefaults = () => {
    if (window.confirm("Сбросить все данные в облаке к настройкам по умолчанию?")) {
      saveToFirebase(DEFAULT_DATA);
    }
  };

  if (isLoading) {
      return (
          <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100] p-10">
              <div className="w-full max-w-md border-4 border-black p-8 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                  <h2 className="text-4xl font-black uppercase mb-4 tracking-tighter">SULAVA</h2>
                  <div className="font-mono text-sm mb-8">კავშირის დამყარება... / УСТАНОВКА СВЯЗИ...</div>
                  <div className="h-8 border-2 border-black relative overflow-hidden">
                      <div className="loading-bar absolute inset-0"></div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <DataContext.Provider value={{
      data,
      language,
      setLanguage,
      updateProfile,
      addService,
      updateService,
      deleteService,
      addPage,
      updatePage,
      deletePage,
      resetToDefaults,
      bookingModalOpen,
      setBookingModalOpen,
      importData,
      isLoading
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
