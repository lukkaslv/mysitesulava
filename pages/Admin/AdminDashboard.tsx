
import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { BrutalistButton } from '../../components/BrutalistButton';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { 
  Trash2, Plus, GripVertical, Settings, Layout, 
  DollarSign, LogOut, Lock, Download, Upload, 
  Database, Loader2, User as UserIcon, Globe, 
  Phone, Mail, MessageSquare, Instagram, MapPin 
} from 'lucide-react';
import { Page, Service, AppData, Profile } from '../../types';
import { auth } from '../../firebase';
// Fix: Import auth functions as values and User as a type to resolve "no exported member" errors in TypeScript environments
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';

type Tab = 'pages' | 'services' | 'profile' | 'system';

export const AdminDashboard: React.FC = () => {
  const { 
    data, updateProfile, addPage, updatePage, deletePage, 
    addService, updateService, deleteService, resetToDefaults, 
    importData 
  } = useData();
  
  const [activeTab, setActiveTab] = useState<Tab>('pages');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ----- Auth State -----
  const [user, setUser] = useState<User | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState('');

  // ----- Form States -----
  const [profileForm, setProfileForm] = useState<Profile>(data.profile);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [pageForm, setPageForm] = useState<Partial<Page>>({});
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<Partial<Service>>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (data.profile) {
      setProfileForm(data.profile);
    }
  }, [data.profile]);

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      try {
          await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      } catch (err: any) {
          setError('ავტორიზაციის შეცდომა / Ошибка входа. Проверьте данные.');
      }
  };

  const handleLogout = async () => {
      await signOut(auth);
      navigate('/');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `sulava_backup_${new Date().toISOString().slice(0,10)}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json && json.profile && json.pages && json.services) {
            if (window.confirm("გსურთ მონაცემების შეცვლა? / ЗАМЕНИТЬ ДАННЫЕ В ОБЛАКЕ?")) {
                setIsSaving(true);
                await importData(json as AppData);
                setIsSaving(false);
            }
        }
      } catch (err) { alert("Error reading file."); }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleProfileSave = async () => {
    setIsSaving(true);
    await updateProfile(profileForm);
    setIsSaving(false);
    alert('პროფილი განახლდა / Профиль обновлен');
  };

  const handlePageSave = async () => {
    setIsSaving(true);
    if (editingPageId && editingPageId !== 'new') {
        const pageToUpdate = data.pages.find(p => p.id === editingPageId);
        if(pageToUpdate) await updatePage({ ...pageToUpdate, ...pageForm } as Page);
    } else {
        await addPage({
            id: uuidv4(),
            isVisible: true,
            order: data.pages.length + 1,
            slug: pageForm.slug || `page-${Date.now()}`,
            title_ka: pageForm.title_ka || '',
            title_ru: pageForm.title_ru || '',
            content_ka: pageForm.content_ka || '',
            content_ru: pageForm.content_ru || ''
        } as Page);
    }
    setIsSaving(false);
    setEditingPageId(null);
    setPageForm({});
  };

  const handleServiceSave = async () => {
    setIsSaving(true);
    if (editingServiceId && editingServiceId !== 'new') {
        const sToUpdate = data.services.find(s => s.id === editingServiceId);
        if(sToUpdate) await updateService({ ...sToUpdate, ...serviceForm } as Service);
    } else {
        await addService({
            id: uuidv4(),
            title_ka: serviceForm.title_ka || '',
            title_ru: serviceForm.title_ru || '',
            price: serviceForm.price || '',
            duration: serviceForm.duration || '',
            description_ka: serviceForm.description_ka || '',
            description_ru: serviceForm.description_ru || ''
        });
    }
    setIsSaving(false);
    setEditingServiceId(null);
    setServiceForm({});
  };

  if (authLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center font-mono font-bold">
      კავშირი... / CONNECTING...
    </div>
  );

  if (!user) {
      return (
          <div className="min-h-screen bg-black flex items-center justify-center p-4">
              <div className="bg-white p-8 max-w-md w-full border-4 border-black shadow-[12px_12px_0px_0px_#333]">
                  <div className="flex justify-center mb-6">
                    <Lock size={48} />
                  </div>
                  <h1 className="text-2xl font-black uppercase text-center mb-6 tracking-tighter">SULAVA ADMIN</h1>
                  <form onSubmit={handleLogin} className="space-y-4">
                      <input 
                        type="email" 
                        className="w-full border-2 border-black p-3 font-mono focus:bg-gray-50 outline-none" 
                        placeholder="EMAIL" 
                        value={emailInput} 
                        onChange={e => setEmailInput(e.target.value)} 
                        required 
                      />
                      <input 
                        type="password" 
                        className="w-full border-2 border-black p-3 font-mono focus:bg-gray-50 outline-none" 
                        placeholder="PASSWORD" 
                        value={passwordInput} 
                        onChange={e => setPasswordInput(e.target.value)} 
                        required 
                      />
                      {error && <p className="text-red-600 font-bold text-center text-xs">{error}</p>}
                      <BrutalistButton fullWidth type="submit">Authorize</BrutalistButton>
                  </form>
                  <Link to="/" className="block mt-6 text-center text-xs font-mono underline uppercase opacity-50 hover:opacity-100 transition-opacity">
                    Back to Public Website
                  </Link>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] font-sans text-black">
      {isSaving && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
              <div className="bg-white border-4 border-black p-6 flex items-center gap-4 shadow-[12px_12px_0px_0px_black]">
                  <Loader2 className="animate-spin" />
                  <span className="font-black uppercase tracking-widest">Pushing to Cloud...</span>
              </div>
          </div>
      )}

      {/* Admin Top Nav */}
      <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-white text-black p-1">
            <Settings size={20} />
          </div>
          <h1 className="text-lg md:text-xl font-black uppercase tracking-tighter">Manager Console</h1>
        </div>
        <div className="flex gap-2">
            <Link to="/"><BrutalistButton className="text-[10px] py-1 px-3 border-white bg-black text-white hover:bg-white hover:text-black">Public Site</BrutalistButton></Link>
            <BrutalistButton onClick={handleLogout} className="text-[10px] py-1 px-3 border-white bg-black text-white hover:bg-red-600 hover:text-white"><LogOut size={16} /></BrutalistButton>
        </div>
      </div>

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-68px)]">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r-4 border-black flex flex-row md:flex-col sticky top-[68px] h-fit md:h-[calc(100vh-68px)] z-20">
            <button onClick={() => setActiveTab('pages')} className={`flex-1 md:flex-none p-4 md:p-6 font-bold uppercase border-b-2 border-black flex items-center gap-3 hover:bg-black hover:text-white transition-colors ${activeTab === 'pages' ? 'bg-black text-white' : ''}`}>
              <Layout size={20} /> <span className="hidden md:inline">Pages</span>
            </button>
            <button onClick={() => setActiveTab('services')} className={`flex-1 md:flex-none p-4 md:p-6 font-bold uppercase border-b-2 border-black flex items-center gap-3 hover:bg-black hover:text-white transition-colors ${activeTab === 'services' ? 'bg-black text-white' : ''}`}>
              <DollarSign size={20} /> <span className="hidden md:inline">Services</span>
            </button>
            <button onClick={() => setActiveTab('profile')} className={`flex-1 md:flex-none p-4 md:p-6 font-bold uppercase border-b-2 border-black flex items-center gap-3 hover:bg-black hover:text-white transition-colors ${activeTab === 'profile' ? 'bg-black text-white' : ''}`}>
              <UserIcon size={20} /> <span className="hidden md:inline">Profile</span>
            </button>
            <button onClick={() => setActiveTab('system')} className={`flex-1 md:flex-none p-4 md:p-6 font-bold uppercase md:border-b-2 border-black flex items-center gap-3 hover:bg-black hover:text-white transition-colors ${activeTab === 'system' ? 'bg-black text-white' : ''}`}>
              <Database size={20} /> <span className="hidden md:inline">System</span>
            </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-10 overflow-y-auto">
            {activeTab === 'pages' && (
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex justify-between items-end border-b-4 border-black pb-4">
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Content / Pages</h2>
                        <BrutalistButton onClick={() => {setEditingPageId('new'); setPageForm({});}} className="flex items-center gap-2"><Plus size={18} /> New Page</BrutalistButton>
                    </div>

                    <div className="grid gap-4">
                        {data.pages.sort((a,b) => a.order - b.order).map(page => (
                            <div key={page.id} className="bg-white border-2 border-black p-5 flex justify-between items-center shadow-[6px_6px_0px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 border-2 border-black bg-gray-50"><GripVertical size={20} /></div>
                                    <div>
                                        <div className="font-black uppercase text-lg">{page.title_ka || page.title_ru}</div>
                                        <div className="text-xs font-mono text-gray-400">slug: /{page.slug} {page.isVisible ? '' : '[HIDDEN]'}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => {setEditingPageId(page.id); setPageForm(page);}} className="p-3 border-2 border-black hover:bg-black hover:text-white transition-colors"><Settings size={18} /></button>
                                    <button onClick={() => { if(window.confirm('Delete page?')) deletePage(page.id); }} className="p-3 border-2 border-black hover:bg-red-600 hover:text-white transition-colors text-red-600"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {editingPageId && (
                        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
                            <div className="bg-white border-4 border-black w-full max-w-3xl p-6 md:p-10 shadow-[15px_15px_0px_0px_white] overflow-y-auto max-h-[90vh]">
                                <h3 className="text-2xl font-black uppercase mb-8 border-b-2 border-black pb-2">{editingPageId === 'new' ? 'Create Page' : 'Edit Page'}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="md:col-span-1">
                                        <label className="block text-[10px] font-black uppercase mb-1">Slug (URL endpoint)</label>
                                        <input className="w-full border-2 border-black p-3 font-mono text-sm" value={pageForm.slug || ''} onChange={e => setPageForm({...pageForm, slug: e.target.value})} placeholder="e.g. bio" />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-[10px] font-black uppercase mb-1">Display Order</label>
                                        <input type="number" className="w-full border-2 border-black p-3 font-mono text-sm" value={pageForm.order || 0} onChange={e => setPageForm({...pageForm, order: parseInt(e.target.value)})} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase mb-1">Title (Georgian)</label>
                                        <input className="w-full border-2 border-black p-3 font-bold" value={pageForm.title_ka || ''} onChange={e => setPageForm({...pageForm, title_ka: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase mb-1">Title (Russian)</label>
                                        <input className="w-full border-2 border-black p-3 font-bold" value={pageForm.title_ru || ''} onChange={e => setPageForm({...pageForm, title_ru: e.target.value})} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black uppercase mb-1">Content (Georgian)</label>
                                        <textarea className="w-full border-2 border-black p-3 font-sans h-40 leading-relaxed" value={pageForm.content_ka || ''} onChange={e => setPageForm({...pageForm, content_ka: e.target.value})} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black uppercase mb-1">Content (Russian)</label>
                                        <textarea className="w-full border-2 border-black p-3 font-sans h-40 leading-relaxed" value={pageForm.content_ru || ''} onChange={e => setPageForm({...pageForm, content_ru: e.target.value})} />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" id="isVisible" className="w-5 h-5 accent-black" checked={pageForm.isVisible ?? true} onChange={e => setPageForm({...pageForm, isVisible: e.target.checked})} />
                                        <label htmlFor="isVisible" className="text-xs font-black uppercase">Visible in main navigation</label>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <BrutalistButton onClick={handlePageSave} fullWidth>Commit Changes</BrutalistButton>
                                    <BrutalistButton onClick={() => setEditingPageId(null)} variant="secondary" fullWidth>Cancel</BrutalistButton>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'services' && (
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex justify-between items-end border-b-4 border-black pb-4">
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Services & Pricing</h2>
                        <BrutalistButton onClick={() => {setEditingServiceId('new'); setServiceForm({});}} className="flex items-center gap-2"><Plus size={18} /> New Service</BrutalistButton>
                    </div>
                    <div className="grid gap-4">
                        {data.services.map(service => (
                            <div key={service.id} className="bg-white border-2 border-black p-5 flex justify-between items-center shadow-[6px_6px_0px_0px_black]">
                                <div>
                                    <div className="font-black uppercase text-lg">{service.title_ka} / {service.title_ru}</div>
                                    <div className="text-sm font-mono text-gray-500">{service.price} — {service.duration}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => {setEditingServiceId(service.id); setServiceForm(service);}} className="p-3 border-2 border-black hover:bg-black hover:text-white transition-colors"><Settings size={18} /></button>
                                    <button onClick={() => { if(window.confirm('Delete service?')) deleteService(service.id); }} className="p-3 border-2 border-black hover:bg-red-600 hover:text-white text-red-600"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {editingServiceId && (
                        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
                            <div className="bg-white border-4 border-black w-full max-w-2xl p-6 md:p-10 shadow-[15px_15px_0px_0px_white]">
                                <h3 className="text-2xl font-black uppercase mb-8 border-b-2 border-black pb-2">{editingServiceId === 'new' ? 'New Service' : 'Edit Service'}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <input className="border-2 border-black p-3 font-bold" placeholder="Title (Georgian)" value={serviceForm.title_ka || ''} onChange={e => setServiceForm({...serviceForm, title_ka: e.target.value})} />
                                    <input className="border-2 border-black p-3 font-bold" placeholder="Title (Russian)" value={serviceForm.title_ru || ''} onChange={e => setServiceForm({...serviceForm, title_ru: e.target.value})} />
                                    <input className="border-2 border-black p-3 font-mono" placeholder="Price (e.g. 100 GEL)" value={serviceForm.price || ''} onChange={e => setServiceForm({...serviceForm, price: e.target.value})} />
                                    <input className="border-2 border-black p-3 font-mono" placeholder="Duration (e.g. 50 min)" value={serviceForm.duration || ''} onChange={e => setServiceForm({...serviceForm, duration: e.target.value})} />
                                    <textarea className="md:col-span-2 border-2 border-black p-3 h-24" placeholder="Description (Georgian)" value={serviceForm.description_ka || ''} onChange={e => setServiceForm({...serviceForm, description_ka: e.target.value})} />
                                    <textarea className="md:col-span-2 border-2 border-black p-3 h-24" placeholder="Description (Russian)" value={serviceForm.description_ru || ''} onChange={e => setServiceForm({...serviceForm, description_ru: e.target.value})} />
                                </div>
                                <div className="flex gap-4">
                                    <BrutalistButton onClick={handleServiceSave} fullWidth>Save Service</BrutalistButton>
                                    <BrutalistButton onClick={() => setEditingServiceId(null)} variant="secondary" fullWidth>Cancel</BrutalistButton>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'profile' && (
                <div className="max-w-3xl mx-auto space-y-10 pb-20">
                    <div className="flex justify-between items-end border-b-4 border-black pb-4">
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Psychologist Profile</h2>
                        <BrutalistButton onClick={handleProfileSave}>Sync All Data</BrutalistButton>
                    </div>

                    {/* Personal Info */}
                    <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[10px_10px_0px_0px_black] space-y-6">
                        <h3 className="text-xl font-black uppercase flex items-center gap-2 border-b-2 border-black pb-2">
                          <UserIcon size={24}/> Identity & Bio
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div><label className="block text-[10px] font-black uppercase mb-1">Name (KA)</label><input className="w-full border-2 border-black p-3 font-black text-lg" value={profileForm.name_ka} onChange={e => setProfileForm({...profileForm, name_ka: e.target.value})} /></div>
                                <div><label className="block text-[10px] font-black uppercase mb-1">Title (KA)</label><input className="w-full border-2 border-black p-3" value={profileForm.title_ka} onChange={e => setProfileForm({...profileForm, title_ka: e.target.value})} /></div>
                                <div><label className="block text-[10px] font-black uppercase mb-1">Bio (KA)</label><textarea className="w-full h-32 border-2 border-black p-3 text-sm" value={profileForm.bio_ka} onChange={e => setProfileForm({...profileForm, bio_ka: e.target.value})} /></div>
                            </div>
                            <div className="space-y-4">
                                <div><label className="block text-[10px] font-black uppercase mb-1">Name (RU)</label><input className="w-full border-2 border-black p-3 font-black text-lg" value={profileForm.name_ru} onChange={e => setProfileForm({...profileForm, name_ru: e.target.value})} /></div>
                                <div><label className="block text-[10px] font-black uppercase mb-1">Title (RU)</label><input className="w-full border-2 border-black p-3" value={profileForm.title_ru} onChange={e => setProfileForm({...profileForm, title_ru: e.target.value})} /></div>
                                <div><label className="block text-[10px] font-black uppercase mb-1">Bio (RU)</label><textarea className="w-full h-32 border-2 border-black p-3 text-sm" value={profileForm.bio_ru} onChange={e => setProfileForm({...profileForm, bio_ru: e.target.value})} /></div>
                            </div>
                        </div>
                    </div>

                    {/* Contacts & Socials */}
                    <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[10px_10px_0px_0px_black] space-y-6">
                        <h3 className="text-xl font-black uppercase flex items-center gap-2 border-b-2 border-black pb-2">
                          <Globe size={24}/> Connectivity
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <div className="flex items-center gap-3"><Mail className="opacity-40" /> <div className="flex-1"><label className="block text-[10px] font-black uppercase">Email</label><input className="w-full border-2 border-black p-2 font-mono" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} /></div></div>
                             <div className="flex items-center gap-3"><Phone className="opacity-40" /> <div className="flex-1"><label className="block text-[10px] font-black uppercase">Phone</label><input className="w-full border-2 border-black p-2 font-mono" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} /></div></div>
                          </div>
                          <div className="space-y-4">
                             <div className="flex items-center gap-3"><MessageSquare className="opacity-40" /> <div className="flex-1"><label className="block text-[10px] font-black uppercase">Telegram (@)</label><input className="w-full border-2 border-black p-2 font-mono" value={profileForm.telegram} onChange={e => setProfileForm({...profileForm, telegram: e.target.value})} /></div></div>
                             <div className="flex items-center gap-3"><Instagram className="opacity-40" /> <div className="flex-1"><label className="block text-[10px] font-black uppercase">Instagram (@)</label><input className="w-full border-2 border-black p-2 font-mono" value={profileForm.instagram} onChange={e => setProfileForm({...profileForm, instagram: e.target.value})} /></div></div>
                          </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[10px_10px_0px_0px_black] space-y-6">
                        <h3 className="text-xl font-black uppercase flex items-center gap-2 border-b-2 border-black pb-2">
                          <MapPin size={24}/> Location Info
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div><label className="block text-[10px] font-black uppercase mb-1">Location / Office (KA)</label><input className="w-full border-2 border-black p-3" value={profileForm.location_ka} onChange={e => setProfileForm({...profileForm, location_ka: e.target.value})} /></div>
                          <div><label className="block text-[10px] font-black uppercase mb-1">Location / Office (RU)</label><input className="w-full border-2 border-black p-3" value={profileForm.location_ru} onChange={e => setProfileForm({...profileForm, location_ru: e.target.value})} /></div>
                        </div>
                    </div>

                    <div className="pt-4">
                      <BrutalistButton fullWidth onClick={handleProfileSave}>Sync All Profile Data to Cloud</BrutalistButton>
                    </div>
                </div>
            )}

            {activeTab === 'system' && (
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="border-b-4 border-black pb-4">
                      <h2 className="text-3xl font-black uppercase tracking-tighter">System & Data</h2>
                    </div>
                    
                    <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_0px_black] space-y-6">
                        <h3 className="font-bold uppercase text-xl flex items-center gap-3 border-b-2 border-black pb-2"><Download size={24} /> Database Portability</h3>
                        <p className="text-sm font-mono leading-relaxed opacity-60">
                          Use these tools to backup your current website content into a local file, or restore from a previously saved JSON backup.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <BrutalistButton onClick={handleExport} className="flex-1 flex items-center justify-center gap-2"><Download size={20} /> Export (JSON)</BrutalistButton>
                            <BrutalistButton onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2" variant="secondary"><Upload size={20} /> Import (JSON)</BrutalistButton>
                            <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />
                        </div>
                    </div>

                    <div className="bg-red-50 border-4 border-red-600 p-8 shadow-[10px_10px_0px_0px_#dc2626] space-y-6">
                        <h3 className="font-bold uppercase text-xl text-red-600 flex items-center gap-3 border-b-2 border-red-200 pb-2"><Trash2 size={24} /> Danger Zone</h3>
                        <p className="text-sm text-red-700 font-mono font-bold">
                          WARNING: This action will completely overwrite all your cloud data with the initial system defaults. All your custom changes will be lost.
                        </p>
                        <BrutalistButton onClick={resetToDefaults} variant="danger" fullWidth>Wipe & Reset to Default</BrutalistButton>
                    </div>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};
