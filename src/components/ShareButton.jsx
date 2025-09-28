import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

const ShareButton = ({ note }) => {
  const [isCopied, setIsCopied] = useState(false);

  const generateShareUrl = () => {
    // In a real app, this would generate a proper shareable URL
    // For now, we'll create a simple public URL simulation
    const baseUrl = window.location.origin;
    return `${baseUrl}/public/${note.id}`;
  };

  const handleShare = async () => {
    try {
      const shareUrl = generateShareUrl();
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy URL:', error);
      // You could show an error message here
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`p-1 md:p-2 rounded-lg transition-colors duration-200 ${
        isCopied 
          ? 'text-green-500' 
          : 'text-gray-400 hover:text-blue-500'
      } hover:bg-gray-50 dark:hover:bg-gray-700`}
      title={isCopied ? 'URL copied!' : 'Share note'}
    >
      {isCopied ? (
        <Check className="w-3 h-3 md:w-4 md:h-4" />
      ) : (
        <Share2 className="w-3 h-3 md:w-4 md:h-4" />
      )}
    </button>
  );
};

export default ShareButton;