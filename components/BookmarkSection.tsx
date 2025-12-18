
import React, { useState, useMemo } from 'react';
import { Bookmark, BookmarkCategory } from '../types';

interface Props {
  bookmarks: Bookmark[];
  setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>;
}

const CATEGORIES: BookmarkCategory[] = ['e-book', 'Video', 'Foto', 'www', 'Zdrowie', 'Edukacja AI'];

const BookmarkSection: React.FC<Props> = ({ bookmarks, setBookmarks }) => {
  const [activeTab, setActiveTab] = useState<BookmarkCategory | 'Wszystkie'>('Wszystkie');
  const [isAdding, setIsAdding] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '', category: 'www' as BookmarkCategory });

  const filteredBookmarks = useMemo(() => {
    return activeTab === 'Wszystkie' ? bookmarks : bookmarks.filter(b => b.category === activeTab);
  }, [bookmarks, activeTab]);

  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
    } catch {
      return '';
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url) return;
    setBookmarks([...bookmarks, { ...newLink, id: Date.now().toString(), clickCount: 0 }]);
    setIsAdding(false);
    setNewLink({ title: '', url: '', category: 'www' });
  };

  const removeBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
          {['Wszystkie', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                activeTab === cat 
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100 active:scale-95"
        >
          Dodaj Link +
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-6">
        {filteredBookmarks.map(bookmark => (
          <div key={bookmark.id} className="group relative flex flex-col items-center">
            <a 
              href={bookmark.url.startsWith('http') ? bookmark.url : `https://${bookmark.url}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-3 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <img src={getFavicon(bookmark.url)} alt="" className="w-full h-full object-contain" />
            </a>
            <span className="mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-tight text-center truncate w-full px-1">
              {bookmark.title}
            </span>
            <button 
              onClick={() => removeBookmark(bookmark.id)}
              className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-red-50 text-red-400 p-1 rounded-lg hover:bg-red-100 transition-all"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black mb-6 uppercase tracking-tight">Nowy Link</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <input 
                placeholder="Nazwa strony"
                className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none font-bold text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                value={newLink.title}
                onChange={e => setNewLink({...newLink, title: e.target.value})}
              />
              <input 
                placeholder="URL (np. google.com)"
                className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none font-bold text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                value={newLink.url}
                onChange={e => setNewLink({...newLink, url: e.target.value})}
              />
              <select 
                className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none font-bold text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                value={newLink.category}
                onChange={e => setNewLink({...newLink, category: e.target.value as BookmarkCategory})}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 text-slate-400 font-bold uppercase text-[10px]">Anuluj</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-500 text-white rounded-xl font-black uppercase text-[10px]">Dodaj</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarkSection;
