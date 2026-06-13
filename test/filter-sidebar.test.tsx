import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterSidebar } from '@/components/catalog/FilterSidebar'
import { categories, brands } from '@/lib/mock/data'
describe('FilterSidebar', () => {
  it('calls onChange with selected category', () => {
    const onChange = vi.fn()
    render(<FilterSidebar categories={categories} brands={brands} onChange={onChange} />)
    fireEvent.click(screen.getByText(categories[0].name))
    expect(onChange).toHaveBeenCalled()
  })
})
