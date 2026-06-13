import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EnquiryForm } from '@/components/forms/EnquiryForm'

describe('EnquiryForm', () => {
  it('shows error when required fields empty on submit', () => {
    render(<EnquiryForm />)
    fireEvent.click(screen.getByRole('button', { name: /send enquiry/i }))
    expect(screen.getByText(/required/i)).toBeInTheDocument()
  })
})
