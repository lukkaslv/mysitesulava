export type Language = 'ka' | 'ru';

export interface Service {
  id: string;
  title_ka: string;
  title_ru: string;
  price: string;
  description_ka: string;
  description_ru: string;
  duration: string;
}

export interface Page {
  id: string;
  slug: string;
  title_ka: string;
  title_ru: string;
  content_ka: string;
  content_ru: string;
  isVisible: boolean;
  order: number;
}

export interface Profile {
  name_ka: string;
  name_ru: string;
  title_ka: string;
  title_ru: string;
  bio_ka: string;
  bio_ru: string;
  email: string;
  phone: string;
  telegram: string;
  instagram: string;
  location_ka: string;
  location_ru: string;
}

export interface AppData {
  profile: Profile;
  services: Service[];
  pages: Page[];
}

export interface DataContextType {
  data: AppData;
  language: Language;
  setLanguage: (lang: Language) => void;
  updateProfile: (profile: Profile) => void;
  addService: (service: Service) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  addPage: (page: Page) => void;
  updatePage: (page: Page) => void;
  deletePage: (id: string) => void;
  resetToDefaults: () => void;
  bookingModalOpen: boolean;
  setBookingModalOpen: (open: boolean) => void;
}