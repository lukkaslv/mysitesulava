export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
}

export interface ServiceItem {
  id: string;
  code: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  price: Record<Language, string>;
  duration: Record<Language, string>;
}

export type Language = 'ru' | 'ka';

export enum Section {
  HOME = 'INIT',
  ABOUT = 'BIO',
  SERVICES = 'SERVICES',
  CONTACT = 'CONTACT',
}