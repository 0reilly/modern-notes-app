import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import PublicNoteView from '../PublicNoteView';

// Mock window.location
const mockLocation = {
  search: ''
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

const renderWithRouter = (ui, { route = '/share/123' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/share/:noteId" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

describe('PublicNoteView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset location search
    mockLocation.search = '';
  });

  test('should render loading state initially', () => {
    // Set empty search to trigger loading state
    mockLocation.search = '';
    
    renderWithRouter(<PublicNoteView />);
    
    expect(screen.getByText('Loading note...')).toBeInTheDocument();
  });

  test('should display note when data is loaded', async () => {
    const mockNoteData = {
      title: 'Test Note',
      content: '<p>This is a test note</p>',
      tags: ['test', 'example'],
      createdAt: '2023-01-01T00:00:00.000Z'
    };
    
    const encodedData = btoa(JSON.stringify(mockNoteData));
    mockLocation.search = `?data=${encodeURIComponent(encodedData)}`;
    
    renderWithRouter(<PublicNoteView />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Note')).toBeInTheDocument();
      expect(screen.getByText('This is a test note')).toBeInTheDocument();
      expect(screen.getByText('test, example')).toBeInTheDocument();
      expect(screen.getByText('Created January 1, 2023')).toBeInTheDocument();
    });
  });

  test('should show error for invalid note ID', async () => {
    mockLocation.search = '?data=invalid-base64-data';
    
    renderWithRouter(<PublicNoteView />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load note. The link may be invalid or expired.')).toBeInTheDocument();
    });
  });

  test('should show error when no data parameter is present', async () => {
    mockLocation.search = '?other=param';
    
    renderWithRouter(<PublicNoteView />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load note. The link may be invalid or expired.')).toBeInTheDocument();
    });
  });

  test('should handle back button click', async () => {
    const mockNoteData = {
      title: 'Test Note',
      content: '<p>This is a test note</p>',
      tags: [],
      createdAt: '2023-01-01T00:00:00.000Z'
    };
    
    const encodedData = btoa(JSON.stringify(mockNoteData));
    mockLocation.search = `?data=${encodeURIComponent(encodedData)}`;
    
    // Mock window.history.back
    const backMock = vi.fn();
    Object.defineProperty(window, 'history', {
      value: { back: backMock },
      writable: true
    });
    
    renderWithRouter(<PublicNoteView />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Note')).toBeInTheDocument();
    });
    
    const backButton = screen.getByText('Back');
    backButton.click();
    
    expect(backMock).toHaveBeenCalledTimes(1);
  });

  test('should handle URL parameters correctly', async () => {
    const mockNoteData = {
      title: 'URL Test Note',
      content: '<p>Testing URL parameters</p>',
      tags: ['url', 'test'],
      createdAt: '2023-02-01T00:00:00.000Z'
    };
    
    const encodedData = btoa(JSON.stringify(mockNoteData));
    mockLocation.search = `?data=${encodeURIComponent(encodedData)}`;
    
    renderWithRouter(<PublicNoteView />, { route: '/share/456' });
    
    await waitFor(() => {
      expect(screen.getByText('URL Test Note')).toBeInTheDocument();
      expect(screen.getByText('Testing URL parameters')).toBeInTheDocument();
      expect(screen.getByText('url, test')).toBeInTheDocument();
    });
  });
});