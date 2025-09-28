import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import ShareButton from '../ShareButton';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn()
  }
});

// Mock window.location
const mockLocation = {
  origin: 'http://localhost:3000'
};
Object.defineProperty(window, 'location', { value: mockLocation });

describe('ShareButton Component', () => {
  beforeEach(() => {
    navigator.clipboard.writeText.mockClear();
  });

  test('should render share button with correct icon', () => {
    const mockNote = {
      id: '123',
      title: 'Test Note',
      content: 'Test content'
    };
    
    render(<ShareButton note={mockNote} />);
    
    const shareButton = screen.getByTitle('Share note');
    expect(shareButton).toBeInTheDocument();
  });

  test('should generate shareable URL when clicked', async () => {
    const mockNote = {
      id: '123',
      title: 'Test Note',
      content: 'Test content'
    };
    
    navigator.clipboard.writeText.mockResolvedValue();
    
    render(<ShareButton note={mockNote} />);
    
    const shareButton = screen.getByTitle('Share note');
    
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://localhost:3000/public/123');
    });
  });

  test('should show success message after copying', async () => {
    const mockNote = {
      id: '123',
      title: 'Test Note',
      content: 'Test content'
    };
    
    navigator.clipboard.writeText.mockResolvedValue();
    
    render(<ShareButton note={mockNote} />);
    
    const shareButton = screen.getByTitle('Share note');
    
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      expect(screen.getByTitle('URL copied!')).toBeInTheDocument();
    });
  });

  test('should handle clipboard errors gracefully', async () => {
    const mockNote = {
      id: '123',
      title: 'Test Note',
      content: 'Test content'
    };
    
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    navigator.clipboard.writeText.mockRejectedValue(new Error('Clipboard error'));
    
    render(<ShareButton note={mockNote} />);
    
    const shareButton = screen.getByTitle('Share note');
    
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Failed to copy URL:', expect.any(Error));
    });
    
    consoleError.mockRestore();
  });

  test('should use fallback clipboard method when navigator.clipboard is not available', async () => {
    const mockNote = {
      id: '123',
      title: 'Test Note',
      content: 'Test content'
    };
    
    // Mock older browser without navigator.clipboard
    const originalClipboard = navigator.clipboard;
    delete navigator.clipboard;
    
    // Mock document.execCommand
    document.execCommand = vi.fn().mockReturnValue(true);
    
    render(<ShareButton note={mockNote} />);
    
    const shareButton = screen.getByTitle('Share note');
    
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });
    
    // Restore clipboard
    Object.assign(navigator, { clipboard: originalClipboard });
  });

  test('should revert to share icon after 2 seconds', async () => {
    const mockNote = {
      id: '123',
      title: 'Test Note',
      content: 'Test content'
    };
    
    navigator.clipboard.writeText.mockResolvedValue();
    
    vi.useFakeTimers();
    
    render(<ShareButton note={mockNote} />);
    
    const shareButton = screen.getByTitle('Share note');
    
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      expect(screen.getByTitle('URL copied!')).toBeInTheDocument();
    });
    
    // Fast-forward time
    vi.advanceTimersByTime(2000);
    
    await waitFor(() => {
      expect(screen.getByTitle('Share note')).toBeInTheDocument();
    });
    
    vi.useRealTimers();
  });
});