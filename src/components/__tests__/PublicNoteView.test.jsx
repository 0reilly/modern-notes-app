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

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
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

  test('should handle back button click', async () => {
    const mockNoteData = {
      title: 'Test Note',
      content: '<p>This is a test note</p>',
      tags: [],
      createdAt: '2023-01-01T00:00:00.000Z'
    };
    
    const encodedData = btoa(JSON.stringify(mockNoteData));
    mockLocation.search = `?data=${encodeURIComponent(encodedData)}`;
    
    renderWithRouter(<PublicNoteView />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Note')).toBeInTheDocument();
    });
    
    const backButton = screen.getByText('Back');
    backButton.click();
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  test('should handle error state back button click', async () => {
    mockLocation.search = '?data=invalid-base64-data';
    
    renderWithRouter(<PublicNoteView />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load note. The link may be invalid or expired.')).toBeInTheDocument();
    });
    
    const backButton = screen.getByText('Go Back');
    backButton.click();
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  test('should handle missing data parameter', async () => {
    mockLocation.search = '';
    
    renderWithRouter(<PublicNoteView />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load note. The link may be invalid or expired.')).toBeInTheDocument();
    });
  });
});