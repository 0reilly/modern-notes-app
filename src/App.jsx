import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import NoteCard from './components/NoteCard';
import NoteEditor from './components/NoteEditor';
import DarkModeToggle from './components/DarkModeToggle';
import PublicNoteView from './components/PublicNoteView';

function App() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

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

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleCreateNote = () => {
    setIsCreating(true);
    setEditingNote({
      id: Date.now().toString(),
      title: '',
      content: '',
      tags: [],
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
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    if (editingNote && editingNote.id === noteId) {
      setEditingNote(null);
      setIsCreating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setIsCreating(false);
  };

  const generateShareUrl = (note) => {
    const baseUrl = window.location.origin;
    const noteData = btoa(JSON.stringify({
      title: note.title,
      content: note.content,
      tags: note.tags,
      createdAt: note.createdAt
    }));
    return `${baseUrl}/share/${note.id}?data=${encodeURIComponent(noteData)}`;
  };

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Routes>
          <Route path="/share/:noteId" element={<PublicNoteView />} />
          <Route path="/" element={
            <div className="max-w-6xl mx-auto px-4 py-8">
              {/* Header */}
              <header className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Modern Notes
                  </h1>
                  <DarkModeToggle />
                </div>
                
                {/* Search and Create */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search notes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={handleCreateNote}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    New Note
                  </button>
                </div>
              </header>

              {/* Editor */}
              {editingNote && (
                <NoteEditor
                  note={editingNote}
                  onSave={handleSaveNote}
                  onCancel={handleCancelEdit}
                  isCreating={isCreating}
                />
              )}

              {/* Notes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map(note => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                    onShare={generateShareUrl}
                  />
                ))}
              </div>

              {/* Empty State */}
              {filteredNotes.length === 0 && !editingNote && (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {searchTerm ? 'No notes found. Try a different search term.' : 'No notes yet. Create your first note!'}
                  </p>
                </div>
              )}
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;