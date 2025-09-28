import React from 'react';
import { 
  Home, 
  Star, 
  Archive, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Folder,
  FileText,
  Users
} from 'lucide-react';

const Sidebar = ({ 
  activeView, 
  onViewChange, 
  collapsed, 
  onToggleCollapse,
  notesCount,
  starredCount,
  archivedCount,
  trashCount
}) => {
  const menuItems = [
    {
      id: 'all',
      label: 'All Notes',
      icon: Home,
      count: notesCount,
      color: 'text-blue-500'
    },
    {
      id: 'starred',
      label: 'Starred',
      icon: Star,
      count: starredCount,
      color: 'text-yellow-500'
    },
    {
      id: 'archived',
      label: 'Archived',
      icon: Archive,
      count: archivedCount,
      color: 'text-green-500'
    },
    {
      id: 'trash',
      label: 'Trash',
      icon: Trash2,
      count: trashCount,
      color: 'text-red-500'
    }
  ];

  return (
    <aside className={`
      bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
      fixed top-0 left-0 h-full z-20 transition-all duration-300
      ${collapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Collapse Toggle */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 
                   dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg
                   hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="ml-2 text-sm font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }
                ${collapsed ? 'justify-center' : 'justify-between'}
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${item.color}`} />
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </div>
              
              {!collapsed && item.count > 0 && (
                <span className={`
                  px-2 py-1 text-xs rounded-full font-medium
                  ${isActive 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }
                `}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Stats (only visible when expanded) */}
      {!collapsed && (
        <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            Quick Stats
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Total Notes</span>
              <span className="font-medium">{notesCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Starred</span>
              <span className="font-medium text-yellow-600 dark:text-yellow-400">{starredCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Archived</span>
              <span className="font-medium text-green-600 dark:text-green-400">{archivedCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer (only visible when expanded) */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <FileText className="w-4 h-4" />
            <span>Modern Notes v1.0</span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;