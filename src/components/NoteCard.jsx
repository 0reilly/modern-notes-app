import React from 'react';
import { Edit2, Trash2, Calendar, Tag, Folder } from 'lucide-react';
import ShareButton from './ShareButton';

const NoteCard = ({ note, onEdit, onDelete, folders }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const truncateContent = (content, maxLength = 120) => {
    const plainText = stripHtml(content);
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  const getFolderName = (folderId) => {
    if (!folderId || !folders) return null;
    
    const findFolder = (folderList, id) => {
      for (const folder of folderList) {
        if (folder.id === id) return folder.name;
        if (folder.children) {
          const found = findFolder(folder.children, id);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findFolder(folders, folderId);
  };

  const folderName = getFolderName(note.folderId);

  return (
    <div className="card p-4 md:p-6 group hover:scale-105 transition-transform duration-200 active:scale-95">
      {/* Header */}
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base md:text-lg line-clamp-2 flex-1 mr-2">
          {note.title}
        </h3>
        
        {/* Actions - Always visible on mobile, hover on desktop */}
        <div className="flex space-x-1 md:space-x-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
          <ShareButton note={note} />
          <button
            onClick={() => onEdit(note)}
            className="p-1 md:p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            title="Edit note"
          >
            <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1 md:p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            title="Delete note"
          >
            <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-3 md:mb-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base line-clamp-3">
          {truncateContent(note.content)}
        </p>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          {/* Date */}
          <div className="flex items-center">
            <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            {formatDate(note.updatedAt || note.createdAt)}
          </div>
          
          {/* Folder */}
          {folderName && (
            <div className="flex items-center">
              <Folder className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              {folderName}
            </div>
          )}
          
          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex items-center">
              <Tag className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              {note.tags.slice(0, 2).join(', ')}
              {note.tags.length > 2 && ` +${note.tags.length - 2}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;