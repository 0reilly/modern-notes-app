import React from 'react'
import { Edit3, Trash2, Calendar, Tag } from 'lucide-react'

const NoteCard = ({ note, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const stripHtml = (html) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  const truncateContent = (content, maxLength = 120) => {
    const plainText = stripHtml(content)
    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength) + '...'
  }

  return (
    <div className="card p-4 md:p-6 group hover:scale-105 transition-transform duration-200 active:scale-95">
      {/* Header */}
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base md:text-lg line-clamp-2 flex-1 mr-2">
          {note.title}
        </h3>
        
        {/* Actions - Always visible on mobile, hover on desktop */}
        <div className="flex space-x-1 md:space-x-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={onEdit}
            className="p-1 md:p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            title="Edit note"
          >
            <Edit3 className="w-3 h-3 md:w-4 md:h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 md:p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            title="Delete note"
          >
            <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
              +{note.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div 
        className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 line-clamp-3 md:line-clamp-4 leading-relaxed text-sm md:text-base prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: note.content || '<p class="text-gray-400">No content</p>' }}
      />

      {/* Footer */}
      <div className="flex items-center justify-between text-xs md:text-sm text-gray-400 dark:text-gray-500">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(note.updatedAt)}</span>
        </div>
        
        {(note.content && stripHtml(note.content).length > 120) && (
          <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            Read more
          </span>
        )}
      </div>
    </div>
  )
}

export default NoteCard