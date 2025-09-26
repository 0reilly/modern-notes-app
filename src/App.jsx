import React, { useState, useEffect } from 'react'
import { Plus, Search, Trash2, Edit3, Save, X, Menu } from 'lucide-react'
import NoteCard from './components/NoteCard'
import NoteEditor from './components/NoteEditor'
import DarkModeToggle from './components/DarkModeToggle'

function App() {
  const [notes, setNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('modern-notes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('modern-notes', JSON.stringify(notes))
  }, [notes])

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  )

  const createNote = (noteData) => {
    const newNote = {
      id: Date.now().toString(),
      title: noteData.title || 'Untitled Note',
      content: noteData.content || '',
      tags: noteData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setNotes(prev => [newNote, ...prev])
    setIsCreating(false)
  }

  const updateNote = (noteData) => {
    setNotes(prev => prev.map(note =>
      note.id === editingNote.id
        ? { ...note, ...noteData, updatedAt: new Date().toISOString() }
        : note
    ))
    setEditingNote(null)
  }

  const deleteNote = (noteId) => {
    setNotes(prev => prev.filter(note => note.id !== noteId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button 
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-black dark:text-white">Modern Notes</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Vercel-inspired note taking</p>
              </div>
            </div>
            
            {/* Desktop search and actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <DarkModeToggle />
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              
              {/* New Note Button */}
              <button
                onClick={() => setIsCreating(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Note</span>
              </button>
            </div>

            {/* Mobile actions */}
            <div className="flex lg:hidden items-center space-x-2">
              <DarkModeToggle />
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 space-y-3">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              
              {/* Mobile New Note Button */}
              <button
                onClick={() => {
                  setIsCreating(true)
                  setIsMobileMenuOpen(false)
                }}
                className="btn-primary flex items-center space-x-2 w-full justify-center"
              >
                <Plus className="w-4 h-4" />
                <span>New Note</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Create/Edit Modal */}
        {(isCreating || editingNote) && (
          <NoteEditor
            note={editingNote}
            onSave={editingNote ? updateNote : createNote}
            onCancel={() => {
              setIsCreating(false)
              setEditingNote(null)
            }}
          />
        )}

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredNotes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={() => setEditingNote(note)}
              onDelete={() => deleteNote(note.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredNotes.length === 0 && !isCreating && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notes yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm ? 'No notes match your search' : 'Create your first note to get started'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="btn-primary"
                >
                  Create your first note
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App