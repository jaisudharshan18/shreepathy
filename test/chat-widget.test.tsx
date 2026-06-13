import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChatWidget } from '@/components/chatbot/ChatWidget'

describe('ChatWidget', () => {
  it('opens on button click', () => {
    render(<ChatWidget />)
    fireEvent.click(screen.getByLabelText(/open chat/i))
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument()
  })
})
