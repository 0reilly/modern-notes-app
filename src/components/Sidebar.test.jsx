import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import Sidebar from './Sidebar';

describe('Sidebar Component', () => {
  const defaultProps = {
    activeView: 'all',
    onViewChange: vi.fn(),
    collapsed: false,
    onToggleCollapse: vi.fn(),
    notesCount: 10,
    starredCount: 3,
    archivedCount: 2,
    trashCount: 1
  };

  test('renders sidebar with correct structure', () => {
    render(<Sidebar {...defaultProps} />);
    
    // Check sidebar container
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveClass('fixed', 'md:relative', 'h-screen');
    
    // Check collapse toggle button
    expect(screen.getByRole('button', { name: /collapse/i })).toBeInTheDocument();
    
    // Check navigation items (should be visible when expanded)
    expect(screen.getByRole('button', { name: /all notes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /starred/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /archived/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /trash/i })).toBeInTheDocument();
  });

  test('shows correct width when expanded', () => {
    render(<Sidebar {...defaultProps} collapsed={false} />);
    
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('w-64');
    expect(sidebar).not.toHaveClass('w-16');
  });

  test('shows correct width when collapsed', () => {
    render(<Sidebar {...defaultProps} collapsed={true} />);
    
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('w-16');
    expect(sidebar).not.toHaveClass('w-64');
  });

  test('collapses and expands when toggle button is clicked', () => {
    const mockToggleCollapse = vi.fn();
    render(<Sidebar {...defaultProps} onToggleCollapse={mockToggleCollapse} />);
    
    const collapseButton = screen.getByRole('button', { name: /collapse/i });
    fireEvent.click(collapseButton);
    
    expect(mockToggleCollapse).toHaveBeenCalledTimes(1);
  });

  test('calls onViewChange when navigation item is clicked', () => {
    const mockOnViewChange = vi.fn();
    render(<Sidebar {...defaultProps} onViewChange={mockOnViewChange} />);
    
    const starredButton = screen.getByRole('button', { name: /starred/i });
    fireEvent.click(starredButton);
    
    expect(mockOnViewChange).toHaveBeenCalledWith('starred');
  });

  test('highlights active view correctly', () => {
    render(<Sidebar {...defaultProps} activeView="starred" />);
    
    // The starred button should have active styling
    const starredButton = screen.getByRole('button', { name: /starred/i });
    expect(starredButton).toHaveClass('bg-blue-50', 'dark:bg-blue-900/20');
    
    // Other buttons should not have active styling
    const allNotesButton = screen.getByRole('button', { name: /all notes/i });
    expect(allNotesButton).not.toHaveClass('bg-blue-50', 'dark:bg-blue-900/20');
  });

  test('shows correct counts for each category', () => {
    render(<Sidebar {...defaultProps} />);
    
    // Check counts in navigation items - use getAllByText since there are multiple elements with same count
    const allNotesCounts = screen.getAllByText('10');
    expect(allNotesCounts.length).toBe(2); // One in navigation, one in quick stats
    
    const starredCounts = screen.getAllByText('3');
    expect(starredCounts.length).toBe(2); // One in navigation, one in quick stats
    
    const archivedCounts = screen.getAllByText('2');
    expect(archivedCounts.length).toBe(2); // One in navigation, one in quick stats
    
    const trashCount = screen.getByText('1');
    expect(trashCount).toBeInTheDocument();
  });

  test('hides navigation labels when collapsed', () => {
    render(<Sidebar {...defaultProps} collapsed={true} />);
    
    // When collapsed, navigation labels should not be visible
    expect(screen.queryByText('All Notes')).not.toBeInTheDocument();
    expect(screen.queryByText('Starred')).not.toBeInTheDocument();
    expect(screen.queryByText('Archived')).not.toBeInTheDocument();
    expect(screen.queryByText('Trash')).not.toBeInTheDocument();
    
    // But icons should still be present
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  test('shows quick stats when expanded', () => {
    render(<Sidebar {...defaultProps} collapsed={false} />);
    
    expect(screen.getByText('Quick Stats')).toBeInTheDocument();
    expect(screen.getByText('Total Notes')).toBeInTheDocument();
    // Use getAllByText for 'Starred' since it appears in both navigation and quick stats
    const starredElements = screen.getAllByText('Starred');
    expect(starredElements.length).toBe(2);
    expect(screen.getByText('Archived')).toBeInTheDocument();
  });

  });

  test('hides quick stats when collapsed', () => {
    render(<Sidebar {...defaultProps} collapsed={true} />);
    
    expect(screen.queryByText('Quick Stats')).not.toBeInTheDocument();
    expect(screen.queryByText('Total Notes')).not.toBeInTheDocument();
  });

  test('shows footer when expanded', () => {
    render(<Sidebar {...defaultProps} collapsed={false} />);
    
    expect(screen.getByText('Modern Notes v1.0')).toBeInTheDocument();
  });

  test('hides footer when collapsed', () => {
    render(<Sidebar {...defaultProps} collapsed={true} />);
    
    expect(screen.queryByText('Modern Notes v1.0')).not.toBeInTheDocument();
  });

  test('applies correct responsive classes', () => {
    render(<Sidebar {...defaultProps} />);
    
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('fixed', 'md:relative');
  });
});