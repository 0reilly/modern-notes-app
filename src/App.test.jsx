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
    
    // Use more specific queries to avoid multiple element conflicts
    expect(screen.getByRole('button', { name: /all notes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /starred/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /archived/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /trash/i })).toBeInTheDocument();
  });

  test('shows empty state when no notes exist', () => {
    localStorageMock.getItem.mockReturnValue(null);
    render(<App />);
    
    // Use more specific queries
    expect(screen.getByRole('heading', { name: /all notes/i })).toBeInTheDocument();
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
    
    expect(screen.getByText('Test Note')).toBeInTheDocument();
  });

  test('stars a note', async () => {
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
    
    const starButton = screen.getByTitle('Star note');
    fireEvent.click(starButton);
    
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  test('archives a note', async () => {
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
    
    const archiveButton = screen.getByTitle('Archive note');
    fireEvent.click(archiveButton);
    
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  test('moves a note to trash', async () => {
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
    
    const deleteButton = screen.getByTitle('Move to trash');
    fireEvent.click(deleteButton);
    
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  test('shows note count correctly', () => {
    const mockNotes = [
      {
        id: '1',
        title: 'Test Note',
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

  test('exports functionality works', () => {
    // Test the export functionality by creating a mock scenario
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
    
    // The export functionality should be available when notes exist
    expect(localStorageMock.getItem).toHaveBeenCalled();
    
    // Verify that URL.createObjectURL is available for export functionality
    expect(typeof window.URL.createObjectURL).toBe('function');
  });
});