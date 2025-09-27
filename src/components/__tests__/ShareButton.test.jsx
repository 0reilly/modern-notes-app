import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import ShareButton from '../ShareButton';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn()
  }
});

describe('ShareButton Component', () => {
  beforeEach(() => {
    navigator.clipboard.writeText.mockClear();
  });

  test('should render share button with correct icon', () => {
    const mockOnShare = vi.fn().mockReturnValue('http://example.com/share/123');
    render(<ShareButton onShare={mockOnShare} />);
    
    expect(screen.getByText('Share')).toBeInTheDocument();
    expect(screen.getByTitle('Share note')).toBeInTheDocument();
  });

  test('should generate shareable URL when clicked', async () => {
    const mockOnShare = vi.fn().mockReturnValue('http://example.com/share/123');
    render(<ShareButton onShare={mockOnShare} />);
    
    const shareButton = screen.getByText('Share');
    
    await act(async () => {
      fireEvent.click(shareButton);
    });
    
    expect(mockOnShare).toHaveBeenCalledTimes(1);
  });

  test('should copy URL to clipboard', async () => {
    const mockOnShare = vi.fn().mockReturnValue('http://example.com/share/123');
    navigator.clipboard.writeText.mockResolvedValue();
    
    render(<ShareButton onShare={mockOnShare} />);
    
    const shareButton = screen.getByText('Share');
    
    await act(async () => {
      fireEvent.click(shareButton);
    });
    
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://example.com/share/123');
    });
  });

  test('should show success message after copying', async () => {
    const mockOnShare = vi.fn().mockReturnValue('http://example.com/share/123');
    navigator.clipboard.writeText.mockResolvedValue();
    
    render(<ShareButton onShare={mockOnShare} />);
    
    const shareButton = screen.getByText('Share');
    
    await act(async () => {
      fireEvent.click(shareButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  test('should handle clipboard errors gracefully', async () => {
    const mockOnShare = vi.fn().mockReturnValue('http://example.com/share/123');
    navigator.clipboard.writeText.mockRejectedValue(new Error('Clipboard error'));
    
    // Mock console.error to avoid test noise
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<ShareButton onShare={mockOnShare} />);
    
    const shareButton = screen.getByText('Share');
    
    await act(async () => {
      fireEvent.click(shareButton);
    });
    
    // Should not show success message on error
    await waitFor(() => {
      expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });

  test('should use fallback clipboard method when modern API is unavailable', async () => {
    const mockOnShare = vi.fn().mockReturnValue('http://example.com/share/123');
    
    // Remove modern clipboard API
    delete navigator.clipboard;
    
    // Mock document.execCommand
    const execCommandMock = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, 'execCommand', { value: execCommandMock });
    
    render(<ShareButton onShare={mockOnShare} />);
    
    const shareButton = screen.getByText('Share');
    
    await act(async () => {
      fireEvent.click(shareButton);
    });
    
    await waitFor(() => {
      expect(execCommandMock).toHaveBeenCalledWith('copy');
    });
    
    // Restore clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn()
      }
    });
  });
});