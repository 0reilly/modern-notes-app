import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import TagInput from './TagInput';

const NoteEditor = ({ note, onSave, onCancel, folders, selectedFolder, isCreating }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [folderId, setFolderId] = useState(selectedFolder || null);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setTags(note.tags || []);
      setFolderId(note.folderId || selectedFolder || null);
    }
  }, [note, selectedFolder]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    onSave({
      id: note?.id || Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      tags,
      folderId: folderId,
      createdAt: note?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

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
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 md:p-6 space-y-4 flex-1 overflow-y-auto">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm md:text-base"
                placeholder="Note title..."
                autoFocus
              />
            </div>

            {/* Folder Selection */}
            <div>
              <label htmlFor="folder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Folder
              </label>
              <select
                id="folder"
                value={folderId || ''}
                onChange={(e) => setFolderId(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm md:text-base"
              >
                <option value="">No Folder</option>
                {folders && folders.map(folder => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none text-sm md:text-base"
                placeholder="Note content..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <TagInput tags={tags} onChange={setTags} />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
              >
                {isCreating ? 'Create Note' : 'Update Note'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteEditor;