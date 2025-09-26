import React, { useState, useEffect } from 'react'
import { X, Save, Tags } from 'lucide-react'
import RichTextEditor from './RichTextEditor'
import TagInput from './TagInput'

const NoteEditor = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
      setTags(note.tags || [])
    } else {
      setTitle('')
      setContent('')
      setTags([])
    }
  }, [note])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim() || content.trim()) {
      onSave({ 
        title: title.trim(), 
        content: content.trim(),
        tags: tags
      })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel()
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
      <div 
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] md:max-h-[80vh] flex flex-col mx-2"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
            {note ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="flex-1 p-4 md:p-6 space-y-3 md:space-y-4 overflow-y-auto">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                className="input-field text-base md:text-lg font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                autoFocus
              />
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Tags className="w-4 h-4 inline mr-1" />
                Tags
              </label>
              <TagInput
                tags={tags}
                onChange={setTags}
                placeholder="Add tags (press Enter or comma)"
              />
            </div>

            {/* Content Rich Text Editor */}
            <div className="flex-1">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content
              </label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Start writing your note..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
              <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
                Press Ctrl+S to save, Esc to cancel
              </span>
              <div className="flex space-x-2 md:space-x-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="btn-secondary flex-1 md:flex-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() && !content.trim()}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed flex-1 md:flex-none"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NoteEditor