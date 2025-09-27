import React, { useState } from 'react';
import { Folder, FolderPlus, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

const FolderManager = ({ folders, selectedFolder, onFolderSelect, onFolderCreate, onFolderRename, onFolderDelete }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onFolderCreate(newFolderName.trim());
      setNewFolderName('');
      setShowCreateForm(false);
    }
  };

  const handleRenameFolder = (folderId, newName) => {
    if (newName.trim()) {
      onFolderRename(folderId, newName.trim());
      setEditingFolder(null);
    }
  };

  const renderFolder = (folder, level = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolder === folder.id;
    const isEditing = editingFolder === folder.id;

    return (
      <div key={folder.id}>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${
            isSelected
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => onFolderSelect(folder.id)}
        >
          {folder.children && folder.children.length > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}
          
          <Folder className="w-4 h-4 flex-shrink-0" />
          
          {isEditing ? (
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onBlur={() => handleRenameFolder(folder.id, newFolderName)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleRenameFolder(folder.id, newFolderName);
                } else if (e.key === 'Escape') {
                  setEditingFolder(null);
                  setNewFolderName('');
                }
              }}
              className="flex-1 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          ) : (
            <>
              <span className="flex-1 truncate">{folder.name}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingFolder(folder.id);
                    setNewFolderName(folder.name);
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFolderDelete(folder.id);
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </>
          )}
        </div>
        
        {isExpanded && folder.children && folder.children.map(child => 
          renderFolder(child, level + 1)
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">Folders</h3>
          <button
            onClick={() => setShowCreateForm(true)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            title="Create new folder"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
        </div>
        
        {showCreateForm && (
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCreateFolder();
                } else if (e.key === 'Escape') {
                  setShowCreateForm(false);
                  setNewFolderName('');
                }
              }}
            />
            <button
              onClick={handleCreateFolder}
              className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div
          className={`px-3 py-2 rounded-md cursor-pointer transition-colors ${
            selectedFolder === null
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          onClick={() => onFolderSelect(null)}
        >
          <span className="font-medium">All Notes</span>
        </div>
        
        {folders.map(folder => renderFolder(folder))}
      </div>
    </div>
  );
};

export default FolderManager;