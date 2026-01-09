
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData, DataContextType, Page, Profile, Service, Language, UIStrings, ExternalLink } from '../types';
import { DEFAULT_DATA } from '../constants';
import { db } from '../firebase';
import { doc, setDoc, onSnapshot, getDocFromCache } from 'firebase/firestore';

const DataContext = createContext<DataContextType | undefined>(undefined);

const LANG_KEY = 'brutalist_psych_lang';
const FIRESTORE_DOC_ID = 'website_content';

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [language, setLanguageState] = useState<Language>('ka');
  const [isLoading, setIsLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem(LANG_KEY) as Language;
    if (savedLang && (savedLang === 'ka' || savedLang === 'ru')) {
        setLanguageState(savedLang);
    }

    const docRef = doc(db, "content", FIRESTORE_DOC_ID);

    // 1. Try to load from cache immediately for fast startup
    const loadCache = async () => {
        try {
            const cacheSnap = await getDocFromCache(docRef);
            if (cacheSnap.exists()) {
                const cachedData = cacheSnap.data() as Partial<AppData>;
                setData(mergeData(cachedData));
                setIsLoading(false);
            }
        } catch (e) {
            // Cache miss is fine
        }
    };
    loadCache();

    // 2. Safety timeout: if we don't get a response in 3 seconds, show whatever we have
    const safetyTimeout = setTimeout(() => {
        setIsLoading(false);
    }, 3000);

    // 3. Real-time subscription
    const unsub = onSnapshot(docRef, (docSnap) => {
      clearTimeout(safetyTimeout);
      if (docSnap.exists()) {
        const remoteData = docSnap.data() as Partial<AppData>;
        setData(mergeData(remoteData));
      } else {
        // If document doesn't exist, create it with defaults
        saveToFirebase(DEFAULT_DATA).catch(() => {});
      }
      setIsLoading(false);
    }, (error) => {
      console.warn("Firestore snapshot error (expected if offline):", error);
      clearTimeout(safetyTimeout);
      setIsLoading(false);
    });

    return () => { 
        unsub(); 
        clearTimeout(safetyTimeout); 
    };
  }, []);

  // Helper to merge remote data with defaults deeply for critical objects
  // AND sanitize to avoid circular refs or unknown fields
  const mergeData = (remote: Partial<AppData>): AppData => {
      return {
          profile: {
              ...DEFAULT_DATA.profile,
              ...(remote.profile || {})
          },
          // Explicitly check for arrays to avoid non-serializable objects slipping in
          services: Array.isArray(remote.services) ? remote.services : DEFAULT_DATA.services,
          pages: Array.isArray(remote.pages) ? remote.pages : DEFAULT_DATA.pages,
          externalLinks: Array.isArray(remote.externalLinks) ? remote.externalLinks : DEFAULT_DATA.externalLinks,
          ui: {
              ...DEFAULT_DATA.ui,
              ...(remote.ui || {})
          }
      };
  };

  const saveToFirebase = async (newData: AppData) => {
    try {
      await setDoc(doc(db, "content", FIRESTORE_DOC_ID), newData);
    } catch (e) {
      console.error("Error saving to Firebase:", e);
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

  const updateUI = (ui: UIStrings) => {
    const newData = { ...data, ui };
    setData(newData);
    saveToFirebase(newData);
  };

  const addService = (service: Service) => {
    const newData = { ...data, services: [...data.services, service] };
    setData(newData);
    saveToFirebase(newData);
  };

  const updateService = (updatedService: Service) => {
    const newData = { ...data, services: data.services.map(s => s.id === updatedService.id ? updatedService : s) };
    setData(newData);
    saveToFirebase(newData);
  };

  const deleteService = (id: string) => {
    const newData = { ...data, services: data.services.filter(s => s.id !== id) };
    setData(newData);
    saveToFirebase(newData);
  };

  const addPage = (page: Page) => {
    const newData = { ...data, pages: [...data.pages, page] };
    setData(newData);
    saveToFirebase(newData);
  };

  const updatePage = (updatedPage: Page) => {
    const newData = { ...data, pages: data.pages.map(p => p.id === updatedPage.id ? updatedPage : p) };
    setData(newData);
    saveToFirebase(newData);
  };

  const deletePage = (id: string) => {
    const newData = { ...data, pages: data.pages.filter(p => p.id !== id) };
    setData(newData);
    saveToFirebase(newData);
  };

  // External Links CRUD
  const addExternalLink = (link: ExternalLink) => {
    const newData = { ...data, externalLinks: [...(data.externalLinks || []), link] };
    setData(newData);
    saveToFirebase(newData);
  };

  const updateExternalLink = (updatedLink: ExternalLink) => {
    const newData = { ...data, externalLinks: (data.externalLinks || []).map(l => l.id === updatedLink.id ? updatedLink : l) };
    setData(newData);
    saveToFirebase(newData);
  };

  const deleteExternalLink = (id: string) => {
    const newData = { ...data, externalLinks: (data.externalLinks || []).filter(l => l.id !== id) };
    setData(newData);
    saveToFirebase(newData);
  };

  const importData = (newData: AppData) => {
    setData(newData);
    saveToFirebase(newData);
    alert('Данные импортированы!');
  };

  const resetToDefaults = () => {
    if (window.confirm("Сбросить всё?")) {
        setData(DEFAULT_DATA);
        saveToFirebase(DEFAULT_DATA);
    }
  };

  if (isLoading) {
      return (
          <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100] p-10">
            <div className="font-black text-4xl mb-4">SULAVA</div>
            <div className="w-48 h-2 bg-gray-200 border-2 border-black relative overflow-hidden">
                <div className="loading-bar absolute inset-0"></div>
            </div>
            <div className="mt-4 font-mono text-[10px] uppercase opacity-50 tracking-widest">establishing connection...</div>
          </div>
      );
  }

  return (
    <DataContext.Provider value={{
      data, language, setLanguage, updateProfile, addService, updateService, deleteService,
      addPage, updatePage, deletePage, 
      addExternalLink, updateExternalLink, deleteExternalLink,
      updateUI, resetToDefaults,
      bookingModalOpen, setBookingModalOpen, importData, isLoading
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};
