
import React, { useState, useEffect } from 'react';
import BookmarkSection from './components/BookmarkSection';
import TodoSection from './components/TodoSection';
import CalendarSection from './components/CalendarSection';
import AiAssistant from './components/AiAssistant';
import { Bookmark, Todo, CalendarEvent } from './types';

const App: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('hub_bookmarks');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', title: 'Google', url: 'https://google.com', category: 'www', clickCount: 0 },
      { id: '2', title: 'YouTube', url: 'https://youtube.com', category: 'Video', clickCount: 0 },
      { id: '3', title: 'GitHub', url: 'https://github.com', category: 'Edukacja AI', clickCount: 0 },
      { id: '4', title: 'ChatGPT', url: 'https://chat.openai.com', category: 'Edukacja AI', clickCount: 0 },
      { id: '5', title: 'Canva', url: 'https://canva.com', category: 'Foto', clickCount: 0 },
      { id: '6', title: 'Facebook', url: 'https://facebook.com', category: 'www', clickCount: 0 }
    ];
  });

  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('hub_todos');
    return saved ? JSON.parse(saved) : [];
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('hub_events');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('hub_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('hub_todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('hub_events', JSON.stringify(events));
  }, [events]);

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-10 transition-colors duration-500">
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-8 gap-4">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Monia Hub</h1>
          <p className="text-xs text-indigo-500 font-bold uppercase tracking-[0.4em] mt-2">Personal Management Center</p>
        </div>
        <div className="flex flex-col md:items-end bg-white px-6 py-3 rounded-3xl shadow-sm border border-slate-50">
          <div className="text-lg text-slate-800 font-extrabold">
            {new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}
          </div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            {new Date().toLocaleDateString('pl-PL', { weekday: 'long' })}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto flex flex-col gap-10">
        <section className="animate-in fade-in slide-in-from-top-4 duration-700">
          <BookmarkSection bookmarks={bookmarks} setBookmarks={setBookmarks} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section className="animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
            <TodoSection todos={todos} setTodos={setTodos} />
          </section>
          <section className="animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            <CalendarSection events={events} setEvents={setEvents} />
          </section>
        </div>
      </main>

      <AiAssistant />
    </div>
  );
};

export default App;
