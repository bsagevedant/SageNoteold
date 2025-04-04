import React, { useState, useEffect } from 'react';
import { Save, Menu, Plus, Trash2, Sun, Moon, Twitter, X } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      lastModified: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote.id);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, ...updates, lastModified: new Date() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote === id) {
      setSelectedNote(notes[0]?.id || null);
    }
  };

  const handleNoteSelect = (id: string) => {
    setSelectedNote(id);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const currentNote = notes.find(note => note.id === selectedNote);

  return (
    <div className={`h-screen flex ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
        border-r flex flex-col fixed md:relative z-30 h-full
        ${isSidebarOpen ? 'w-full md:w-64' : 'w-0'} 
        transition-all duration-300 overflow-hidden`}>
        <div className={`p-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b flex justify-between items-center`}>
          <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>SageNote</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={createNewNote}
              className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
              title="New Note"
            >
              <Plus className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg md:hidden`}
              >
                <X className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notes.map(note => (
            <div
              key={note.id}
              className={`p-4 cursor-pointer border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} ${
                selectedNote === note.id 
                  ? (theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50')
                  : (theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50')
              }`}
              onClick={() => handleNoteSelect(note.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0"> {/* Added min-w-0 to prevent text overflow */}
                  <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'} truncate`}>
                    {note.title}
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1 truncate`}>
                    {note.content}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className={`p-1 ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} rounded transition-colors ml-2`}
                >
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(note.lastModified).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen relative md:ml-0">
        <div className={`${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} 
          border-b p-4 flex items-center justify-between sticky top-0 z-10`}>
          <div className="flex items-center flex-1 min-w-0"> {/* Added min-w-0 */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors mr-2`}
            >
              <Menu className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            {currentNote && (
              <input
                type="text"
                value={currentNote.title}
                onChange={(e) => updateNote(currentNote.id, { title: e.target.value })}
                className={`flex-1 text-xl font-semibold bg-transparent border-none outline-none truncate ${
                  theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                }`}
                placeholder="Note title"
              />
            )}
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://x.com/sagevedant"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden md:flex items-center ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              <Twitter className="w-5 h-5" />
              <span className="ml-2">@sagevedant</span>
            </a>
            <button
              onClick={toggleTheme}
              className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
        {currentNote ? (
          <textarea
            value={currentNote.content}
            onChange={(e) => updateNote(currentNote.id, { content: e.target.value })}
            className={`flex-1 p-4 md:p-6 resize-none outline-none ${
              theme === 'dark' 
                ? 'bg-gray-900 text-white placeholder-gray-500' 
                : 'bg-transparent text-gray-800 placeholder-gray-400'
            }`}
            placeholder="Start writing..."
          />
        ) : (
          <div className={`flex-1 flex items-center justify-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            <div className="text-center p-4">
              <Plus className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg">Create a new note to get started</p>
            </div>
          </div>
        )}
        {currentNote && (
          <div className={`${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} 
            border-t p-4 flex justify-end sticky bottom-0`}>
            <div className={`flex items-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <Save className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Last saved</span> {new Date(currentNote.lastModified).toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;