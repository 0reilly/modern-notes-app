import React, { useState, useRef, useEffect } from 'react'
import { Bold, Italic, List, ListOrdered, Quote, Code } from 'lucide-react'

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
      
      // Update toolbar states
      const selection = window.getSelection()
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const parentElement = range.commonAncestorContainer.parentElement
        
        setIsBold(parentElement?.tagName === 'B' || parentElement?.tagName === 'STRONG')
        setIsItalic(parentElement?.tagName === 'I' || parentElement?.tagName === 'EM')
      }
    }
  }

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value)
    handleInput()
    editorRef.current?.focus()
  }

  const insertFormat = (tag) => {
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const selectedText = range.toString()
      
      if (selectedText) {
        let formattedText
        
        switch (tag) {
          case 'bold':
            formattedText = `<strong>${selectedText}</strong>`
            break
          case 'italic':
            formattedText = `<em>${selectedText}</em>`
            break
          case 'code':
            formattedText = `<code>${selectedText}</code>`
            break
          case 'quote':
            formattedText = `<blockquote>${selectedText}</blockquote>`
            break
          default:
            formattedText = selectedText
        }
        
        range.deleteContents()
        range.insertNode(document.createRange().createContextualFragment(formattedText))
        handleInput()
      }
    }
  }

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
      {/* Toolbar */}
      <div className="flex items-center space-x-1 p-2 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-t-lg">
        <button
          type="button"
          onClick={() => formatText('bold')}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            isBold ? 'bg-gray-300 dark:bg-gray-500' : ''
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => formatText('italic')}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            isItalic ? 'bg-gray-300 dark:bg-gray-500' : ''
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-1" />
        
        <button
          type="button"
          onClick={() => formatText('insertUnorderedList')}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => formatText('insertOrderedList')}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-1" />
        
        <button
          type="button"
          onClick={() => insertFormat('quote')}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => insertFormat('code')}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Code"
        >
          <Code className="w-4 h-4" />
        </button>
      </div>
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={(e) => {
          e.preventDefault()
          const text = e.clipboardData.getData('text/plain')
          document.execCommand('insertText', false, text)
        }}
        className="min-h-[150px] md:min-h-[200px] p-4 outline-none text-gray-900 dark:text-white leading-relaxed prose prose-sm dark:prose-invert max-w-none"
        placeholder={placeholder}
        style={{ 
          minHeight: '150px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}
      />
    </div>
  )
}

export default RichTextEditor