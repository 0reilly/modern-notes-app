import React from 'react'
import { Edit3, Trash2, Calendar, Tag, Star, Archive, RotateCcw, Undo2 } from 'lucide-react'
import ShareButton from './ShareButton'

const NoteCard = ({ 
  note, 
  onEdit, 
  onDelete, 
  onRestore,
  onPermanentDelete,
  onToggleStar,
  onToggleArchive,
  view = 'all'
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
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

  const getCardVariant = () => {
    if (note.deleted) return 'deleted'
    if (note.archived) return 'archived'
    if (note.starred) return 'starred'
    return 'normal'
  }

  const variantStyles = {
    normal: 'border-gray-200 dark:border-gray-700',
    starred: 'border-yellow-200 dark:border-yellow-700 bg-yellow-50/50 dark:bg-yellow-900/20',
    archived: 'border-green-200 dark:border-green-700 bg-green-50/50 dark:bg-green-900/20',
    deleted: 'border-red-200 dark:border-red-700 bg-red-50/50 dark:bg-red-900/20'
  }

  const variant = getCardVariant()

  return (
    <div className={`
      card p-4 md:p-6 group transition-all duration-200 
      ${variantStyles[variant]}
      ${view !== 'trash' ? 'hover:scale-105 active:scale-95' : ''}
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            {note.starred && (
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            )}
            {note.archived && (
              <Archive className="w-4 h-4 text-green-500" />
            )}
            {note.deleted && (
              <Trash2 className="w-4 h-4 text-red-500" />
            )}
            <h3 className="font-semibold text-gray-900 dark:text-white text-base md:text-lg line-clamp-2">
              {note.title || 'Untitled Note'}
            </h3>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-1 md:space-x-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
          {view === 'trash' ? (
            <>
              <button
                onClick={() => onRestore(note.id)}
                className="p-1 md:p-2 text-gray-400 hover:text-green-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                title="Restore note"
              >
                <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
              </button>
              <button
                onClick={() => onPermanentDelete(note.id)}
                className="p-1 md:p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                title="Delete permanently"
              >
                <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </>
          ) : (
            <>
              {!note.archived && !note.deleted && (
                <ShareButton note={note} />
              )}
              
              {!note.deleted && (
                <button
                  onClick={() => onToggleStar(note.id)}
                  className={`p-1 md:p-2 rounded-lg transition-colors duration-200 ${
                    note.starred 
                      ? 'text-yellow-500 hover:text-yellow-600' 
                      : 'text-gray-400 hover:text-yellow-500'
                  } hover:bg-gray-50 dark:hover:bg-gray-700`}
                  title={note.starred ? 'Unstar note' : 'Star note'}
                >
                  <Star className={`w-3 h-3 md:w-4 md:h-4 ${note.starred ? 'fill-current' : ''}`} />
                </button>
              )}
              
              {!note.deleted && (
                <button
                  onClick={() => onToggleArchive(note.id)}
                  className={`p-1 md:p-2 rounded-lg transition-colors duration-200 ${
                    note.archived 
                      ? 'text-green-500 hover:text-green-600' 
                      : 'text-gray-400 hover:text-green-500'
                  } hover:bg-gray-50 dark:hover:bg-gray-700`}
                  title={note.archived ? 'Unarchive note' : 'Archive note'}
                >
                  <Archive className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              )}
              
              {!note.deleted && (
                <button
                  onClick={() => onEdit(note)}
                  className="p-1 md:p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  title="Edit note"
                >
                  <Edit3 className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              )}
              
              {!note.deleted && (
                <button
                  onClick={() => onDelete(note.id)}
                  className="p-1 md:p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  title="Move to trash"
                >
                  <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content Preview */}
      <div className="mb-3 md:mb-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
          {truncateContent(note.content)}
        </p>
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3 md:mb-4">
          {note.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              +{note.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(note.updatedAt)}</span>
          </div>
          <span>•</span>
          <span>{formatTime(note.updatedAt)}</span>
        </div>
        
        {note.createdAt !== note.updatedAt && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            edited
          </span>
        )}
      </div>
    </div>
  )
}

export default NoteCard;