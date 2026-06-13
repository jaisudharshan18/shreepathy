import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DataTable } from '@/components/admin/DataTable'

describe('DataTable', () => {
  it('renders rows from data', () => {
    render(<DataTable columns={[{ key: 'name', header: 'Name' }]} data={[{ name: 'Pillsbury' }]} />)
    expect(screen.getByText('Pillsbury')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('renders empty state when data is empty', () => {
    render(<DataTable columns={[{ key: 'name', header: 'Name' }]} data={[]} />)
    expect(screen.getByText('No records.')).toBeInTheDocument()
  })

  it('uses custom render function when provided', () => {
    render(
      <DataTable
        columns={[{ key: 'name', header: 'Name', render: (row) => <span>Custom: {row.name}</span> }]}
        data={[{ name: 'Pillsbury' }]}
      />
    )
    expect(screen.getByText('Custom: Pillsbury')).toBeInTheDocument()
  })

  it('applies cursor-pointer class when onRowClick is provided', () => {
    render(
      <DataTable
        columns={[{ key: 'name', header: 'Name' }]}
        data={[{ name: 'Pillsbury' }]}
        onRowClick={() => {}}
      />
    )
    const rows = screen.getAllByRole('row')
    // body row (not header) should have cursor-pointer
    expect(rows[1].className).toMatch(/cursor-pointer/)
  })
})
