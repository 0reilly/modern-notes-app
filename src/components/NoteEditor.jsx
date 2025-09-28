import React, { useState, useEffect, useRef } from 'react'
import { X, Save, Tags, Eye, Code, Type, Bold, Italic, List, Link, Image, Download } from 'lucide-react'
import TagInput from './TagInput'
import { marked } from 'marked'

const NoteEditor = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])
  const [viewMode, setViewMode] = useState('edit') // 'edit' or 'preview'
  const [isFullscreen, setIsFullscreen] = useState(false)
  const textareaRef = useRef(null)

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
        starred: note?.starred || false,
        archived: note?.archived || false,
        deleted: note?.deleted || false,
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

  const insertText = (before, after = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)
    
    setContent(newText)
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const formatText = (format) => {
    const formats = {
      bold: { before: '**', after: '**' },
      italic: { before: '_', after: '_' },
      code: { before: '`', after: '`' },
      link: { before: '[', after: '](url)' },
      image: { before: '![', after: '](image-url)' },
      list: { before: '- ', after: '' }
    }

    const formatConfig = formats[format]
    if (formatConfig) {
      insertText(formatConfig.before, formatConfig.after)
    }
  }

  const exportAsMarkdown = () => {
    const markdownContent = `# ${title}\n\n${content}`
    const blob = new Blob([markdownContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${title || 'note'}.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getPreviewContent = () => {
    return marked.parse(content || '*Start writing...*')
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50 ${isFullscreen ? 'p-0' : ''}`}>
      <div 
        className={`bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full flex flex-col mx-2 transition-all duration-300 ${
          isFullscreen ? 'h-screen max-w-none rounded-none' : 'max-w-4xl max-h-[90vh] md:max-h-[80vh]'
        }`}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
              {note ? 'Edit Note' : 'Create New Note'}
            </h2>
            
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('edit')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'edit' 
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Type className="w-4 h-4 inline mr-1" />
                Edit
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'preview' 
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Eye className="w-4 h-4 inline mr-1" />
                Preview
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={exportAsMarkdown}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors duration-200"
              title="Export as Markdown"
            >
              <Download className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors duration-200"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <X className="w-5 h-5" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>
            
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        {viewMode === 'edit' && (
          <div className="flex items-center space-x-1 p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <button
              onClick={() => formatText('bold')}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded transition-colors"
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('italic')}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded transition-colors"
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('code')}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded transition-colors"
              title="Code"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('link')}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded transition-colors"
              title="Link"
            >
              <Link className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('image')}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded transition-colors"
              title="Image"
            >
              <Image className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('list')}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded transition-colors"
              title="List"
            >
              <List className="w-4 h-4" />
            </button>
            <div className="flex-1"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {content.length} characters
            </span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Title */}
          <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="w-full text-2xl md:text-3xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
              autoFocus
            />
          </div>

          {/* Editor/Preview */}
          <div className="flex-1 overflow-auto">
            {viewMode === 'edit' ? (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your note... (Supports Markdown)"
                className="w-full h-full p-4 md:p-6 bg-transparent border-none outline-none resize-none text-gray-900 dark:text-white placeholder-gray-400 font-mono text-sm leading-relaxed"
                style={{ minHeight: '300px' }}
              />
            ) : (
              <div 
                className="p-4 md:p-6 prose prose-gray dark:prose-invert max-w-none h-full overflow-auto"
                dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
              />
            )}
          </div>

          {/* Tags */}
          <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <Tags className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</span>
            </div>
            <TagInput tags={tags} onChange={setTags} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 md:p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last saved: {note?.updatedAt ? new Date(note.updatedAt).toLocaleString() : 'Not saved yet'}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() && !content.trim()}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>Save Note</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteEditor;