import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Search, Plus, Settings, Folder, Star, Trash2, Archive, Download, Upload, Users } from 'lucide-react';
import NoteCard from './components/NoteCard';
import NoteEditor from './components/NoteEditor';
import DarkModeToggle from './components/DarkModeToggle';
import PublicNoteView from './components/PublicNoteView';
import Sidebar from './components/Sidebar';
import SettingsPanel from './components/SettingsPanel';

function App() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeView, setActiveView] = useState('all'); // all, starred, archived, trash
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('modern-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('modern-notes', JSON.stringify(notes));
  }, [notes]);

  const getFilteredNotes = () => {
    let filtered = notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    switch (activeView) {
      case 'starred':
        filtered = filtered.filter(note => note.starred);
        break;
      case 'archived':
        filtered = filtered.filter(note => note.archived);
        break;
      case 'trash':
        filtered = filtered.filter(note => note.deleted);
        break;
      default:
        filtered = filtered.filter(note => !note.deleted && !note.archived);
    }

    return filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  };

  const filteredNotes = getFilteredNotes();

  const handleCreateNote = () => {
    setIsCreating(true);
    setEditingNote({
      id: Date.now().toString(),
      title: '',
      content: '',
      tags: [],
      starred: false,
      archived: false,
      deleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  const handleSaveNote = (noteData) => {
    if (editingNote) {
      if (isCreating) {
        // Creating new note
        setNotes(prev => [noteData, ...prev]);
      } else {
        // Updating existing note
        const updatedNotes = notes.map(note =>
          note.id === editingNote.id 
            ? { ...noteData, updatedAt: new Date().toISOString() }
            : note
        );
        setNotes(updatedNotes);
      }
    }
    setEditingNote(null);
    setIsCreating(false);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsCreating(false);
  };

  const handleDeleteNote = (noteId) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId 
        ? { ...note, deleted: true, updatedAt: new Date().toISOString() }
        : note
    ));
  };

  const handleRestoreNote = (noteId) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId 
        ? { ...note, deleted: false, updatedAt: new Date().toISOString() }
        : note
    ));
  };

  const handlePermanentDelete = (noteId) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const handleToggleStar = (noteId) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId 
        ? { ...note, starred: !note.starred, updatedAt: new Date().toISOString() }
        : note
    ));
  };

  const handleToggleArchive = (noteId) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId 
        ? { ...note, archived: !note.archived, updatedAt: new Date().toISOString() }
        : note
    ));
  };

  const exportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'modern-notes-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importNotes = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedNotes = JSON.parse(e.target.result);
          setNotes(prev => [...importedNotes, ...prev]);
        } catch (error) {
          alert('Error importing notes: Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  if (editingNote) {
    return (
      <NoteEditor
        note={editingNote}
        onSave={handleSaveNote}
        onCancel={() => {
          setEditingNote(null);
          setIsCreating(false);
        }}
      />
    );
  }

  if (showSettings) {
    return (
      <SettingsPanel
        onClose={() => setShowSettings(false)}
        onExport={exportNotes}
        onImport={importNotes}
      />
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Routes>
          <Route path="/public/:noteId" element={<PublicNoteView />} />
          <Route path="/" element={
            <div className="flex">
              {/* Sidebar */}
              <Sidebar
                activeView={activeView}
                onViewChange={setActiveView}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                notesCount={notes.length}
                starredCount={notes.filter(n => n.starred && !n.deleted).length}
                archivedCount={notes.filter(n => n.archived && !n.deleted).length}
                trashCount={notes.filter(n => n.deleted).length}
              />
              
              {/* Main Content */}
              <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 max-w-2xl">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search notes..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="input-field pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={exportNotes}
                        className="btn-secondary flex items-center space-x-2"
                        title="Export notes"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                      </button>
                      
                      <label className="btn-secondary flex items-center space-x-2 cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <span>Import</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={importNotes}
                          className="hidden"
                        />
                      </label>
                      
                      <button
                        onClick={handleCreateNote}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>New Note</span>
                      </button>
                      
                      <button
                        onClick={() => setShowSettings(true)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        title="Settings"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      
                      <DarkModeToggle />
                    </div>
                  </div>
                </header>

                {/* Notes Grid */}
                <main className="p-6">
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                      {activeView === 'all' ? 'All Notes' : activeView}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
                    </p>
                  </div>

                  {filteredNotes.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 dark:text-gray-600 mb-4">
                        {activeView === 'trash' ? (
                          <Trash2 className="w-16 h-16 mx-auto" />
                        ) : activeView === 'archived' ? (
                          <Archive className="w-16 h-16 mx-auto" />
                        ) : activeView === 'starred' ? (
                          <Star className="w-16 h-16 mx-auto" />
                        ) : (
                          <Folder className="w-16 h-16 mx-auto" />
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No {activeView === 'all' ? '' : activeView} notes found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {activeView === 'all' && searchTerm ? 'Try adjusting your search terms' : 
                         activeView === 'all' ? 'Create your first note to get started' :
                         `No ${activeView} notes yet`}
                      </p>
                      {activeView === 'all' && !searchTerm && (
                        <button onClick={handleCreateNote} className="btn-primary">
                          Create Your First Note
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredNotes.map(note => (
                        <NoteCard
                          key={note.id}
                          note={note}
                          onEdit={handleEditNote}
                          onDelete={handleDeleteNote}
                          onRestore={handleRestoreNote}
                          onPermanentDelete={handlePermanentDelete}
                          onToggleStar={handleToggleStar}
                          onToggleArchive={handleToggleArchive}
                          view={activeView}
                        />
                      ))}
                    </div>
                  )}
                </main>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;