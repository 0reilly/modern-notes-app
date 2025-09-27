import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';

const PublicNoteView = () => {
  const { noteId } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadNote = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Small delay to ensure loading state is visible
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const urlParams = new URLSearchParams(window.location.search);
        const noteData = urlParams.get('data');
        
        if (!noteData) {
          throw new Error('No note data found in URL');
        }

        const decodedData = JSON.parse(atob(decodeURIComponent(noteData)));
        setNote({
          id: noteId,
          ...decodedData
        });
      } catch (err) {
        setError('Failed to load note. The link may be invalid or expired.');
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [noteId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading note...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {note.title}
          </h1>
          
          {/* Metadata */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Created {formatDate(note.createdAt)}
            </div>
            
            {note.tags && note.tags.length > 0 && (
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                {note.tags.join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none">
          <div 
            className="text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            This note was shared from Modern Notes App
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicNoteView;