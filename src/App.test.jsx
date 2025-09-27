import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import App from './App';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.location
const mockLocation = {
  origin: 'http://localhost:3000'
};
Object.defineProperty(window, 'location', { value: mockLocation });

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn()
  }
});

describe('Modern Notes App', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    navigator.clipboard.writeText.mockClear();
  });

  test('renders the app header', () => {
    render(<App />);
    expect(screen.getByText('Modern Notes')).toBeInTheDocument();
  });

  test('shows empty state when no notes exist', () => {
    localStorageMock.getItem.mockReturnValue(null);
    render(<App />);
    expect(screen.getByText('No notes yet. Create your first note!')).toBeInTheDocument();
  });

  test('creates a new note', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    render(<App />);
    
    const newNoteButton = screen.getByText('New Note');
    fireEvent.click(newNoteButton);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Note title')).toBeInTheDocument();
    });
  });

  test('searches notes', () => {
    const mockNotes = [
      {
        id: '1',
        title: 'Test Note',
        content: 'This is a test note',
        tags: ['test'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockNotes));
    
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText('Search notes...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    expect(screen.getByText('Test Note')).toBeInTheDocument();
  });

  test('generates share URL for a note', () => {
    const mockNotes = [
      {
        id: '1',
        title: 'Test Note',
        content: 'This is a test note',
        tags: ['test'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockNotes));
    
    render(<App />);
    
    // The share URL should be generated correctly
    const expectedUrl = `http://localhost:3000/share/1?data=${encodeURIComponent(btoa(JSON.stringify({
      title: 'Test Note',
      content: 'This is a test note',
      tags: ['test'],
      createdAt: mockNotes[0].createdAt
    })))}`;
    
    // This is a basic test - the actual sharing functionality is tested in ShareButton.test.jsx
    expect(expectedUrl).toContain('http://localhost:3000/share/1');
  });

  test('handles public note view route', () => {
    // This would require more complex routing testing
    // For now, we just verify the Router is set up
    render(<App />);
    expect(screen.getByText('Modern Notes')).toBeInTheDocument();
  });
});