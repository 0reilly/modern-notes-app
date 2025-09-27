import React, { useState, useEffect } from 'react'
import { X, Save, Tags } from 'lucide-react'
import RichTextEditor from './RichTextEditor'
import TagInput from './TagInput'

const NoteEditor = ({ note, onSave, onCancel, isCreating }) => {
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
        id: note?.id || Date.now().toString(),
        title: title.trim() || 'Untitled Note', 
        content: content.trim(),
        tags: tags,
        createdAt: note?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
            {isCreating ? 'Create New Note' : 'Edit Note'}
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
            {/* Title */}
            <div>
              <input
                type="text"
                placeholder="Note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-lg md:text-xl font-semibold bg-transparent border-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                autoFocus
              />
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2">
              <Tags className="w-4 h-4 text-gray-400" />
              <TagInput tags={tags} onChange={setTags} />
            </div>

            {/* Content */}
            <div className="flex-1 min-h-[200px]">
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Start writing your note..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NoteEditor;