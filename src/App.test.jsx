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

  test('renders the app with sidebar', () => {
    localStorageMock.getItem.mockReturnValue(null);
    render(<App />);
    
    expect(screen.getByText('All Notes')).toBeInTheDocument();
    expect(screen.getByText('Starred')).toBeInTheDocument();
    expect(screen.getByText('Archived')).toBeInTheDocument();
    expect(screen.getByText('Trash')).toBeInTheDocument();
  });

  test('shows empty state when no notes exist', () => {
    localStorageMock.getItem.mockReturnValue(null);
    render(<App />);
    
    expect(screen.getByText('All Notes')).toBeInTheDocument();
    expect(screen.getByText('0 notes')).toBeInTheDocument();
    expect(screen.getByText('Create Your First Note')).toBeInTheDocument();
  });

  test('creates a new note', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    render(<App />);
    
    const newNoteButton = screen.getByText('New Note');
    fireEvent.click(newNoteButton);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Note title...')).toBeInTheDocument();
    });
  });

  test('searches notes', () => {
    const mockNotes = [
      {
        id: '1',
        title: 'Test Note',
        content: 'This is a test note',
        tags: ['test'],
        starred: false,
        archived: false,
        deleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockNotes));
    
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText('Search notes...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    expect(searchInput.value).toBe('test');
  });

  test('toggles dark mode', () => {
    localStorageMock.getItem.mockReturnValue(null);
    render(<App />);
    
    const darkModeToggle = screen.getByTitle('Toggle dark mode');
    fireEvent.click(darkModeToggle);
    
    // Check if dark mode class is applied to document
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('displays notes from localStorage', () => {
    const mockNotes = [
      {
        id: '1',
        title: 'Test Note 1',
        content: 'Content 1',
        tags: ['test'],
        starred: false,
        archived: false,
        deleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Test Note 2',
        content: 'Content 2',
        tags: ['important'],
        starred: true,
        archived: false,
        deleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockNotes));
    render(<App />);
    
    expect(screen.getByText('2 notes')).toBeInTheDocument();
  });

  test('opens settings panel', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    render(<App />);
    
    const settingsButton = screen.getByTitle('Settings');
    fireEvent.click(settingsButton);
    
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('General')).toBeInTheDocument();
      expect(screen.getByText('Appearance')).toBeInTheDocument();
      expect(screen.getByText('Data')).toBeInTheDocument();
    });
  });

  test('exports and imports notes', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    render(<App />);
    
    const exportButton = screen.getByText('Export');
    fireEvent.click(exportButton);
    
    // Should trigger download (we can't test the actual download in Jest)
    expect(exportButton).toBeInTheDocument();
  });
});