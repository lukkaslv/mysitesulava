
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

export interface ExternalLink {
  id: string;
  url: string;
  label_ka: string;
  label_ru: string;
  order: number;
  isVisible: boolean;
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

export interface UIStrings {
  // Navigation & Buttons
  book_btn: { ka: string; ru: string };
  services_nav: { ka: string; ru: string };
  contact_footer: { ka: string; ru: string };
  rights_footer: { ka: string; ru: string };
  
  // Services Page
  important_info_title: { ka: string; ru: string };
  important_info_text: { ka: string; ru: string };
}

export interface AppData {
  profile: Profile;
  services: Service[];
  pages: Page[];
  externalLinks: ExternalLink[];
  ui: UIStrings;
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
  // External Link Actions
  addExternalLink: (link: ExternalLink) => void;
  updateExternalLink: (link: ExternalLink) => void;
  deleteExternalLink: (id: string) => void;
  
  updateUI: (ui: UIStrings) => void;
  resetToDefaults: () => void;
  bookingModalOpen: boolean;
  setBookingModalOpen: (open: boolean) => void;
  importData: (newData: AppData) => void;
  isLoading: boolean;
}
