import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('Modern Notes App', () => {
  it('renders the app header', () => {
    render(<App />)
    expect(screen.getByText('Modern Notes')).toBeInTheDocument()
  })

  it('shows empty state when no notes exist', () => {
    render(<App />)
    expect(screen.getByText('No notes yet')).toBeInTheDocument()
  })

  it('opens note editor when new note button is clicked', () => {
    render(<App />)
    const newNoteButton = screen.getByText('New Note')
    fireEvent.click(newNoteButton)
    expect(screen.getByText('Create New Note')).toBeInTheDocument()
  })
})