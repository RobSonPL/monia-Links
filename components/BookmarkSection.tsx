
import React, { useState, useMemo } from 'react';
import { Bookmark, BookmarkCategory } from '../types';

interface Props {
  bookmarks: Bookmark[];
  setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>;
}

const CATEGORIES: BookmarkCategory[] = ['psychologia', 'Hipnoza', 'Video', 'Foto', 'www', 'Zdrowie'];

const CATEGORY_STYLES: Record<BookmarkCategory, { icon: React.ReactElement, gradient: string, color: string }> = {
  'psychologia': { 
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
    gradient: 'from-indigo-400 to-purple-500',
    color: 'text-indigo-600'
  },
  'Hipnoza': { 
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /></svg>,
    gradient: 'from-fuchsia-500 to-violet-600',
    color: 'text-fuchsia-600'
  },
  'Video': { 
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    gradient: 'from-red-500 to-rose-600',
    color: 'text-red-600'
  },
  'Foto': { 
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    gradient: 'from-purple-400 to-indigo-500',
    color: 'text-purple-600'
  },
  'www': { 
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
    gradient: 'from-blue-400 to-cyan-500',
    color: 'text-blue-600'
  },
  'Zdrowie': { 
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    gradient: 'from-emerald-400 to-teal-500',
    color: 'text-emerald-600'
  }
};

const BookmarkSection: React.FC<Props> = ({ bookmarks, setBookmarks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [formData, setFormData] = useState<{ title: string; url: string; category: BookmarkCategory }>({ title: '', url: '', category: 'www' });
  const [activeTab, setActiveTab] = useState<BookmarkCategory | 'Wszystkie' | 'Ulubione'>('Wszystkie');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const favorites = useMemo(() => {
    return [...bookmarks]
      .filter(b => b.clickCount > 0)
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, 6);
  }, [bookmarks]);

  const filteredBookmarks = useMemo(() => {
    if (activeTab === 'Wszystkie') return bookmarks;
    if (activeTab === 'Ulubione') return favorites;
    return bookmarks.filter(b => b.category === activeTab);
  }, [bookmarks, activeTab, favorites]);

  const getFavicon = (url: string, size: number = 64) => {
    try {
      const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      return `https://www.google.com/s2/favicons?sz=${size}&domain=${domain}`;
    } catch {
      return '';
    }
  };

  const handleClick = (id: string) => {
    setBookmarks(prev => prev.map(b => b.id === id ? { ...b, clickCount: b.clickCount + 1 } : b));
  };

  const handleOpenForm = (bookmark?: Bookmark) => {
    if (bookmark) {
      setEditingBookmark(bookmark);
      setFormData({ title: bookmark.title, url: bookmark.url, category: bookmark.category });
    } else {
      setEditingBookmark(null);
      setFormData({ title: '', url: '', category: 'www' });
    }
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBookmark) {
      setBookmarks(bookmarks.map(b => b.id === editingBookmark.id ? { ...b, ...formData } : b));
    } else {
      setBookmarks([...bookmarks, { ...formData, id: Date.now().toString(), clickCount: 0 }]);
    }
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Szybki Dostęp</h2>
        </div>
        <button 
          onClick={() => handleOpenForm()}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          Dodaj Zakładkę +
        </button>
      </div>

      <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-[1.5rem] border border-slate-100">
        {['Wszystkie', 'Ulubione', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat as any)}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === cat 
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {cat !== 'Wszystkie' && cat !== 'Ulubione' && (
              <span className={CATEGORY_STYLES[cat as BookmarkCategory].color}>
                {CATEGORY_STYLES[cat as BookmarkCategory].icon}
              </span>
            )}
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-6 min-h-[140px]">
        {filteredBookmarks.map((bookmark, index) => {
          const style = CATEGORY_STYLES[bookmark.category];
          
          return (
            <div 
              key={bookmark.id} 
              onMouseEnter={() => setHoveredId(bookmark.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative flex flex-col items-center"
            >
              <a 
                href={bookmark.url.startsWith('http') ? bookmark.url : `https://${bookmark.url}`}
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => handleClick(bookmark.id)}
                className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-3.5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group-hover:border-indigo-100 relative overflow-hidden"
              >
                 <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 ${style.gradient}`} />
                 <img src={getFavicon(bookmark.url)} alt="" className="w-full h-full object-contain relative z-10" />
              </a>
              <span className="mt-3 text-[10px] font-black text-slate-500 uppercase tracking-tighter text-center truncate w-full px-1 group-hover:text-slate-900">
                {bookmark.title}
              </span>

              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex flex-col gap-1 transition-all z-20">
                <button onClick={(e) => { e.preventDefault(); handleOpenForm(bookmark); }} className="p-1.5 bg-white rounded-lg shadow-lg border border-slate-50 text-slate-400 hover:text-indigo-500 transition-colors">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button onClick={(e) => { e.preventDefault(); handleDelete(bookmark.id); }} className="p-1.5 bg-white rounded-lg shadow-lg border border-slate-50 text-slate-400 hover:text-red-500 transition-colors">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-10 transform animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-8">{editingBookmark ? 'Edycja' : 'Nowa Zakładka'}</h3>
            <form onSubmit={handleSave} className="space-y-6">
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 focus:ring-2 focus:ring-indigo-100 outline-none"
                placeholder="Nazwa strony"
                required
              />
              <input 
                type="text" 
                value={formData.url}
                onChange={e => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 focus:ring-2 focus:ring-indigo-100 outline-none"
                placeholder="Adres URL"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: c })}
                    className={`px-4 py-3 rounded-xl border-2 font-black text-[10px] uppercase transition-all tracking-tighter ${
                      formData.category === c 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-white border-slate-50 text-slate-400 hover:border-slate-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 text-slate-400 font-black uppercase text-xs">Anuluj</button>
                <button type="submit" className="flex-[2] py-4 bg-indigo-500 text-white rounded-2xl font-black uppercase text-xs shadow-lg shadow-indigo-100">Zapisz</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarkSection;
