import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

const ShareButton = ({ onShare }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    try {
      const shareUrl = onShare();
      
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
      className="share-btn flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
      title="Share note"
    >
      {isCopied ? (
        <>
          <Check className="w-4 h-4" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          Share
        </>
      )}
    </button>
  );
};

export default ShareButton;