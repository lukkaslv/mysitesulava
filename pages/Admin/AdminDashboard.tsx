
import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { BrutalistButton } from '../../components/BrutalistButton';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { 
  Layout, DollarSign, Database, Loader2, User as UserIcon,
  Type, Plus, Trash2, ExternalLink as ExternalLinkIcon, ChevronRight, Link as LinkIcon, Settings
} from 'lucide-react';
import { Page, Service, Profile, UIStrings, ExternalLink, AppData } from '../../types';
import { auth } from '../../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';

type Tab = 'pages' | 'services' | 'profile' | 'system' | 'uiStrings' | 'navigation';

export const AdminDashboard: React.FC = () => {
  const { 
    data, updateProfile, updatePage, addPage, deletePage, updateService, addService, deleteService, 
    updateUI, resetToDefaults, addExternalLink, updateExternalLink, deleteExternalLink, importData
  } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local states for editing to prevent lag
  const [tempProfile, setTempProfile] = useState<Profile>(data.profile);
  const [tempUI, setTempUI] = useState<UIStrings>(data.ui);

  // Ext Link Form
  const [linkForm, setLinkForm] = useState<Partial<ExternalLink>>({});
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);

  // Sync temp states when data changes
  useEffect(() => {
    if (data) {
        setTempProfile(data.profile);
        setTempUI(data.ui);
    }
  }, [data]);

  useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

  const handleSave = async (action: () => Promise<void> | void, message = "Данные обновлены") => {
    setIsSaving(true);
    try {
      await action();
      alert(message);
    } catch (e) {
      alert("Ошибка сохранения");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLinkSave = async () => {
      setIsSaving(true);
      if (editingLinkId && editingLinkId !== 'new') {
          const original = data.externalLinks.find(l => l.id === editingLinkId);
          if (original) await updateExternalLink({ ...original, ...linkForm } as ExternalLink);
      } else {
          await addExternalLink({
              id: uuidv4(),
              url: linkForm.url || 'https://',
              label_ka: linkForm.label_ka || 'New Link',
              label_ru: linkForm.label_ru || 'New Link',
              order: linkForm.order || 0,
              isVisible: true
          });
      }
      setIsSaving(false);
      setEditingLinkId(null);
      setLinkForm({});
  };

  // ----- AUTH SCREEN -----
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <form onSubmit={async (e) => { e.preventDefault(); try { await signInWithEmailAndPassword(auth, emailInput, passwordInput); } catch { alert('Неверный логин или пароль'); } }} className="bg-white p-8 border-4 border-black space-y-4 shadow-[10px_10px_0px_0px_white] w-full max-w-md">
          <h1 className="font-black text-2xl text-center uppercase">SULAVA ADMIN</h1>
          <input className="w-full border-2 border-black p-3 font-mono" placeholder="Email" value={emailInput} onChange={e => setEmailInput(e.target.value)} />
          <input type="password" className="w-full border-2 border-black p-3 font-mono" placeholder="Password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} />
          <BrutalistButton fullWidth type="submit" disabled={isSaving}>{isSaving ? 'Logging in...' : 'Enter Console'}</BrutalistButton>
        </form>
      </div>
    );
  }

  // Helper for safe access to UI strings
  const getUI = (key: keyof UIStrings) => {
     return tempUI[key] || { ka: '', ru: '' };
  };

  const setUI = (key: keyof UIStrings, lang: 'ka' | 'ru', val: string) => {
     const currentObj = tempUI[key] || { ka: '', ru: '' };
     setTempUI({ ...tempUI, [key]: { ...currentObj, [lang]: val } });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json && json.profile) {
            if (window.confirm("Заменить данные в базе?")) {
                importData(json as AppData);
            }
        }
      } catch (err) { alert("Error reading file."); }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col font-sans">
      <header className="bg-black text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="font-black uppercase text-xl tracking-tighter">SULAVA CONTROL</h1>
          {isSaving && <Loader2 className="animate-spin text-white" size={20} />}
        </div>
        <div className="flex gap-4">
          <Link to="/"><BrutalistButton className="py-1 px-4 text-[10px] bg-white text-black">View Site</BrutalistButton></Link>
          <BrutalistButton onClick={() => signOut(auth)} className="py-1 px-4 text-[10px] border-white text-white hover:bg-white hover:text-black">Logout</BrutalistButton>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r-4 border-black hidden lg:flex flex-col sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          {[
            { id: 'profile', icon: UserIcon, label: 'Мой Профиль' },
            { id: 'services', icon: DollarSign, label: 'Услуги и Прайс' },
            { id: 'pages', icon: Layout, label: 'Страницы' },
            { id: 'navigation', icon: LinkIcon, label: 'Навигация / Ссылки' },
            { id: 'uiStrings', icon: Type, label: 'Тексты / Кнопки' },
            { id: 'system', icon: Database, label: 'База Данных' }
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as Tab)} className={`p-5 border-b-2 border-black flex items-center gap-4 transition-colors ${activeTab === t.id ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>
              <t.icon size={18} />
              <span className="font-black uppercase text-[11px] tracking-widest">{t.label}</span>
            </button>
          ))}
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          
           {/* NAVIGATION / EXTERNAL LINKS TAB */}
           {activeTab === 'navigation' && (
            <div className="max-w-5xl space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black uppercase">Внешние Ссылки в Меню</h2>
                    <BrutalistButton onClick={() => { setEditingLinkId('new'); setLinkForm({}); }} className="flex gap-2 items-center">
                        <Plus size={16}/> Добавить Ссылку
                    </BrutalistButton>
                </div>
                <div className="space-y-4">
                    {(data.externalLinks || []).sort((a,b) => a.order - b.order).map(link => (
                         <div key={link.id} className="bg-white border-2 border-black p-5 flex justify-between items-center shadow-[6px_6px_0px_0px_black]">
                            <div className="flex items-center gap-4">
                                <span className="font-mono text-xs border border-black px-2">{link.order}</span>
                                <div>
                                    <div className="font-black uppercase text-sm">{link.label_ru} / {link.label_ka}</div>
                                    <div className="text-xs font-mono text-blue-600 truncate max-w-md">{link.url}</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => {setEditingLinkId(link.id); setLinkForm(link);}} className="p-3 border-2 border-black hover:bg-black hover:text-white transition-colors"><Settings size={18} /></button>
                                <button 
                                    onClick={(e) => { 
                                        e.preventDefault(); 
                                        if(window.confirm('Delete link?')) deleteExternalLink(link.id); 
                                    }} 
                                    className="p-3 border-2 border-black hover:bg-red-600 hover:text-white transition-colors text-red-600"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {data.externalLinks.length === 0 && <p className="opacity-50">Здесь можно добавить ссылки на ваши другие ресурсы.</p>}
                </div>

                {editingLinkId && (
                    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
                        <div className="bg-white border-4 border-black w-full max-w-lg p-6 shadow-[10px_10px_0px_0px_white]">
                            <h3 className="text-xl font-black uppercase mb-6">{editingLinkId === 'new' ? 'New Link' : 'Edit Link'}</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold">LABEL (RU)</label>
                                    <input className="w-full border-2 border-black p-2" value={linkForm.label_ru || ''} onChange={e => setLinkForm({...linkForm, label_ru: e.target.value})} placeholder="ТЕСТ" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold">LABEL (KA)</label>
                                    <input className="w-full border-2 border-black p-2" value={linkForm.label_ka || ''} onChange={e => setLinkForm({...linkForm, label_ka: e.target.value})} placeholder="ტესტი" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold">URL (HTTPS)</label>
                                    <input className="w-full border-2 border-black p-2" value={linkForm.url || ''} onChange={e => setLinkForm({...linkForm, url: e.target.value})} placeholder="https://..." />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold">ORDER</label>
                                    <input type="number" className="w-full border-2 border-black p-2" value={linkForm.order || 0} onChange={e => setLinkForm({...linkForm, order: parseInt(e.target.value)})} />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <BrutalistButton onClick={handleLinkSave} fullWidth>Save</BrutalistButton>
                                    <BrutalistButton onClick={() => setEditingLinkId(null)} variant="secondary" fullWidth>Cancel</BrutalistButton>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
           )}

          {/* UI STRINGS TAB */}
          {activeTab === 'uiStrings' && (
            <div className="max-w-5xl space-y-6">
              <div className="flex justify-between items-center border-b-4 border-black pb-4">
                <h2 className="text-2xl font-black uppercase">Тексты Интерфейса и Кнопки</h2>
                <BrutalistButton onClick={() => handleSave(() => updateUI(tempUI))}>Сохранить</BrutalistButton>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Specifically filter out important_info_text because we have a dedicated editor for it in Services tab */}
                {Object.keys(tempUI).filter(k => k !== 'important_info_text').map((key) => {
                    const typedKey = key as keyof UIStrings;
                    return (
                        <div key={key} className="bg-white border-2 border-black p-4 space-y-2">
                            <h3 className="text-[10px] font-black uppercase opacity-40">{key}</h3>
                            <div className="grid gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-bold w-6">RU</span>
                                    <input className="w-full border border-black p-2 font-mono text-xs" value={getUI(typedKey).ru} onChange={e => setUI(typedKey, 'ru', e.target.value)} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-bold w-6 text-red-600">KA</span>
                                    <input className="w-full border border-black p-2 font-mono text-xs" value={getUI(typedKey).ka} onChange={e => setUI(typedKey, 'ka', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    );
                })}
              </div>
            </div>
          )}

          {/* PAGES TAB */}
          {activeTab === 'pages' && (
            <div className="max-w-5xl space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black uppercase">Управление Страницами</h2>
                <BrutalistButton onClick={() => {
                  const newPage: Page = { id: uuidv4(), slug: 'new-page-' + Date.now(), title_ru: 'Новая страница', title_ka: 'ახალი გვერდი', content_ru: '', content_ka: '', isVisible: true, order: data.pages.length + 1 };
                  addPage(newPage);
                }} className="flex gap-2 items-center"><Plus size={16}/> Добавить страницу</BrutalistButton>
              </div>
              <div className="space-y-4">
                {data.pages.sort((a,b) => a.order - b.order).map(page => (
                  <details key={page.id} className="bg-white border-4 border-black group">
                    <summary className="p-4 cursor-pointer font-black flex justify-between items-center uppercase hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 flex items-center justify-center border-2 border-black bg-black text-white text-xs">{page.order}</span>
                        <span>{page.slug === 'home' ? '🏠 ' : ''}{page.title_ru}</span>
                      </div>
                      <div className="flex gap-4 items-center">
                        <span className={`text-[10px] px-2 py-1 ${page.isVisible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {page.isVisible ? 'VISIBLE' : 'HIDDEN'}
                        </span>
                        <ChevronRight className="group-open:rotate-90 transition-transform" />
                      </div>
                    </summary>
                    <div className="p-6 border-t-2 border-black space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold">SLUG (URL)</label>
                            <input disabled={page.slug === 'home'} className="w-full border-2 border-black p-2 disabled:bg-gray-200" value={page.slug} onChange={e => updatePage({...page, slug: e.target.value})} placeholder="URL Slug" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold">ORDER</label>
                            <input type="number" className="w-full border-2 border-black p-2" value={page.order} onChange={e => updatePage({...page, order: parseInt(e.target.value)})} placeholder="Order" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input className="border-2 border-black p-2" value={page.title_ru} onChange={e => updatePage({...page, title_ru: e.target.value})} placeholder="Title RU" />
                        <input className="border-2 border-black p-2" value={page.title_ka} onChange={e => updatePage({...page, title_ka: e.target.value})} placeholder="Title KA" />
                      </div>
                      <textarea className="w-full border-2 border-black p-4 h-32 font-serif" value={page.content_ru} onChange={e => updatePage({...page, content_ru: e.target.value})} placeholder="Content RU" />
                      <textarea className="w-full border-2 border-black p-4 h-32 font-serif" value={page.content_ka} onChange={e => updatePage({...page, content_ka: e.target.value})} placeholder="Content KA" />
                      <div className="flex justify-between pt-4 border-t border-black">
                        <BrutalistButton variant="secondary" onClick={() => updatePage({...page, isVisible: !page.isVisible})}>Toggle Visibility</BrutalistButton>
                        {page.slug !== 'home' && (
                            <BrutalistButton 
                                variant="danger" 
                                onClick={(e) => { 
                                    e.preventDefault(); 
                                    if(window.confirm('Вы уверены, что хотите удалить эту страницу?')) deletePage(page.id); 
                                }}
                            >
                                <Trash2 size={16}/>
                            </BrutalistButton>
                        )}
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* SERVICES TAB */}
          {activeTab === 'services' && (
            <div className="max-w-5xl space-y-12">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black uppercase">Услуги и Прайс</h2>
                    <BrutalistButton onClick={() => {
                    const newService: Service = { id: uuidv4(), title_ru: 'Новая услуга', title_ka: 'ახალი სერვისი', price: '100 GEL', duration: '50 min', description_ru: '', description_ka: '' };
                    addService(newService);
                    }} className="flex gap-2 items-center"><Plus size={16}/> Добавить услугу</BrutalistButton>
                </div>
                {data.services.length === 0 && <p className="text-center py-10 opacity-50">Услуг пока нет. Добавьте первую.</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.services.map(s => (
                    <div key={s.id} className="bg-white border-4 border-black p-6 space-y-4 shadow-[8px_8px_0px_0px_black]">
                        <div className="grid grid-cols-2 gap-2">
                        <input className="border-2 border-black p-2 font-black text-sm" value={s.title_ru} onChange={e => updateService({...s, title_ru: e.target.value})} />
                        <input className="border-2 border-black p-2 font-black text-sm" value={s.title_ka} onChange={e => updateService({...s, title_ka: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                        <input className="border-2 border-black p-2 font-mono text-xs" value={s.price} onChange={e => updateService({...s, price: e.target.value})} />
                        <input className="border-2 border-black p-2 font-mono text-xs" value={s.duration} onChange={e => updateService({...s, duration: e.target.value})} />
                        </div>
                        <textarea className="w-full border-2 border-black p-2 text-xs h-20" value={s.description_ru} onChange={e => updateService({...s, description_ru: e.target.value})} placeholder="Description RU" />
                        <textarea className="w-full border-2 border-black p-2 text-xs h-20" value={s.description_ka} onChange={e => updateService({...s, description_ka: e.target.value})} placeholder="Description KA" />
                        <BrutalistButton 
                            variant="danger" 
                            fullWidth 
                            onClick={(e) => { 
                                e.preventDefault();
                                if(window.confirm('Удалить услугу?')) deleteService(s.id); 
                            }}
                        >
                            <Trash2 size={16}/>
                        </BrutalistButton>
                    </div>
                    ))}
                </div>
              </div>
              
              <div className="border-t-4 border-black pt-8 space-y-6">
                  <div className="flex justify-between items-center">
                     <h3 className="text-xl font-black uppercase">Блок «Важная Информация»</h3>
                     <BrutalistButton onClick={() => handleSave(() => updateUI(tempUI))}>Сохранить Информацию</BrutalistButton>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <label className="font-bold text-xs uppercase">RU Текст (Новая строка = Новый пункт)</label>
                          <textarea className="w-full border-2 border-black p-4 h-48 font-mono text-xs leading-relaxed" value={getUI('important_info_text').ru} onChange={e => setUI('important_info_text', 'ru', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                          <label className="font-bold text-xs uppercase text-red-600">KA Текст (Новая строка = Новый пункт)</label>
                          <textarea className="w-full border-2 border-black p-4 h-48 font-mono text-xs leading-relaxed" value={getUI('important_info_text').ka} onChange={e => setUI('important_info_text', 'ka', e.target.value)} />
                      </div>
                  </div>
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="max-w-3xl space-y-8 bg-white border-4 border-black p-10 shadow-[12px_12px_0px_0px_black]">
                <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-6">
                  <h2 className="text-2xl font-black uppercase">Персональные данные</h2>
                  <BrutalistButton onClick={() => handleSave(() => updateProfile(tempProfile))}>Обновить Профиль</BrutalistButton>
                </div>
                <div className="grid gap-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase">Имя (RU)</label>
                        <input className="w-full border-2 border-black p-3" value={tempProfile.name_ru} onChange={e => setTempProfile({...tempProfile, name_ru: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase">Имя (KA)</label>
                        <input className="w-full border-2 border-black p-3" value={tempProfile.name_ka} onChange={e => setTempProfile({...tempProfile, name_ka: e.target.value})} />
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase">Специальность (RU)</label>
                        {/* Fixed missing event parameter 'e' below */}
                        <input className="w-full border-2 border-black p-3" value={tempProfile.title_ru} onChange={e => setTempProfile({...tempProfile, title_ru: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase">Специальность (KA)</label>
                        <input className="w-full border-2 border-black p-3" value={tempProfile.title_ka} onChange={e => setTempProfile({...tempProfile, title_ka: e.target.value})} />
                      </div>
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase">Bio (RU)</label>
                     <textarea className="w-full border-2 border-black p-3 h-32" value={tempProfile.bio_ru} onChange={e => setTempProfile({...tempProfile, bio_ru: e.target.value})} />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase">Bio (KA)</label>
                     <textarea className="w-full border-2 border-black p-3 h-32" value={tempProfile.bio_ka} onChange={e => setTempProfile({...tempProfile, bio_ka: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-4 border-t-2 border-black pt-6">
                      <input className="border-2 border-black p-3" placeholder="Phone" value={tempProfile.phone} onChange={e => setTempProfile({...tempProfile, phone: e.target.value})} />
                      <input className="border-2 border-black p-3" placeholder="Email" value={tempProfile.email} onChange={e => setTempProfile({...tempProfile, email: e.target.value})} />
                      <input className="border-2 border-black p-3" placeholder="Telegram username" value={tempProfile.telegram} onChange={e => setTempProfile({...tempProfile, telegram: e.target.value})} />
                      <input className="border-2 border-black p-3" placeholder="Instagram username" value={tempProfile.instagram} onChange={e => setTempProfile({...tempProfile, instagram: e.target.value})} />
                      <input className="border-2 border-black p-3" placeholder="Location RU" value={tempProfile.location_ru} onChange={e => setTempProfile({...tempProfile, location_ru: e.target.value})} />
                      <input className="border-2 border-black p-3" placeholder="Location KA" value={tempProfile.location_ka} onChange={e => setTempProfile({...tempProfile, location_ka: e.target.value})} />
                   </div>
                </div>
            </div>
          )}

          {/* SYSTEM TAB */}
          {activeTab === 'system' && (
            <div className="max-w-2xl bg-white border-4 border-black p-10 space-y-8 shadow-[10px_10px_0px_0px_red]">
                <h2 className="text-2xl font-black uppercase text-red-600">Опасная Зона</h2>
                <div className="flex gap-4">
                  <BrutalistButton variant="danger" fullWidth onClick={resetToDefaults}>Полный Сброс Базы (Reset)</BrutalistButton>
                </div>
                <div className="pt-8 border-t-2 border-black/20">
                     <h3 className="font-bold mb-4">Резервное копирование (JSON)</h3>
                     <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />
                     <div className="flex gap-4">
                         <BrutalistButton onClick={() => {
                            try {
                                const dataStr = JSON.stringify(data, null, 2);
                                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                                const linkElement = document.createElement('a');
                                linkElement.setAttribute('href', dataUri);
                                linkElement.setAttribute('download', 'sulava_backup.json');
                                linkElement.click();
                            } catch (e) {
                                alert("Ошибка создания резервной копии: " + e);
                            }
                         }}>Скачать Backup</BrutalistButton>
                         <BrutalistButton variant="secondary" onClick={() => fileInputRef.current?.click()}>Загрузить Backup</BrutalistButton>
                     </div>
                </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
