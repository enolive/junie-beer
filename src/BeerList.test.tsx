import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import BeerList, { BeerListProps } from './BeerList'
import { setupListActions } from './test/setup-list-actions.ts'
import { Beer } from './Domain.ts'

describe('BeerList', () => {
  beforeEach(() => {
    mockOnDeleteBeer.mockClear()
  })

  it('shows empty state message when no beers are added', () => {
    renderComponent([])

    const emptyStateMessage = screen.getByRole('status', {
      name: 'Beer collection status',
    })

    expect(emptyStateMessage).toHaveTextContent('No beers added yet. Add your first beer above!')
  })

  it('renders beer cards with all information when all fields are filled', () => {
    const singleBeer: Beer = {
      id: 1,
      name: 'Test IPA',
      brewery: 'Test Brewery',
      style: 'IPA',
      rating: 4,
      notes: 'Great beer',
      dateAdded: '2024-02-01',
    }

    renderComponent([singleBeer])

    expect(screen.getByRole('heading', { name: 'Test IPA' })).toBeInTheDocument()
    const article = screen.getByRole('article')
    const terms = within(article).getAllByRole('term')
    const definitions = within(article).getAllByRole('definition')
    expect(terms[0]).toHaveTextContent('Brewery')
    expect(definitions[0]).toHaveTextContent('Test Brewery')
    expect(terms[1]).toHaveTextContent('Style')
    expect(definitions[1]).toHaveTextContent('IPA')
    expect(terms[2]).toHaveTextContent('Rating')
    expect(definitions[2]).toHaveTextContent('⭐⭐⭐⭐ (4/5)')
    expect(terms[3]).toHaveTextContent('Notes')
    expect(definitions[3]).toHaveTextContent('Great beer')
    expect(terms[4]).toHaveTextContent('Added')
    expect(definitions[4]).toHaveTextContent('1.2.2024')
  })

  it('renders beer cards with only required fields when optional fields are empty', () => {
    const singleBeer: Beer = {
      id: 2,
      name: 'Simple Beer',
      brewery: 'Simple Brewery',
      style: '',
      rating: 0,
      notes: '',
      dateAdded: '2024-02-01',
    }

    renderComponent([singleBeer])

    expect(screen.getByRole('heading', { name: 'Simple Beer' })).toBeInTheDocument()
    const article = screen.getByRole('article')
    const terms = within(article).getAllByRole('term')
    const definitions = within(article).getAllByRole('definition')
    expect(terms).toHaveLength(2)
    expect(definitions).toHaveLength(2)
    expect(terms[0]).toHaveTextContent('Brewery')
    expect(definitions[0]).toHaveTextContent('Simple Brewery')
    expect(terms[1]).toHaveTextContent('Added')
    expect(definitions[1]).toHaveTextContent('1.2.2024')
  })

  it('renders multiple beer cards', () => {
    const beers: Beer[] = [
      {
        id: 1,
        name: 'Test IPA',
        brewery: 'Test Brewery',
        style: 'IPA',
        rating: 4,
        notes: 'Great beer',
        dateAdded: '2024-01-01',
      },
      {
        id: 2,
        name: 'Simple Beer',
        brewery: 'Simple Brewery',
        style: '',
        rating: 0,
        notes: '',
        dateAdded: '2024-02-01',
      },
    ]

    renderComponent(beers)

    const list = screen.getByRole('list')
    const listItems = within(list).getAllByRole('listitem')
    expect(listItems).toHaveLength(2)
    expect(listItems[0]).toHaveTextContent('Test IPA')
    expect(listItems[1]).toHaveTextContent('Simple Beer')
  })

  it('calls onDeleteBeer when delete button is clicked', async () => {
    const singleBeer: Beer = {
      id: 1,
      name: 'Test IPA',
      brewery: 'Test Brewery',
      style: 'IPA',
      rating: 4,
      notes: 'Great beer',
      dateAdded: '2024-01-01',
    }
    renderComponent([singleBeer])
    const actions = setupListActions()

    await actions.deleteBeer()

    expect(mockOnDeleteBeer).toHaveBeenCalledWith(1)
  })

  it('calls onDeleteBeer with correct id for multiple beers', async () => {
    const beers: Beer[] = [
      {
        id: 1,
        name: 'Test IPA',
        brewery: 'Test Brewery',
        style: 'IPA',
        rating: 4,
        notes: 'Great beer',
        dateAdded: '1/1/2024',
      },
      {
        id: 2,
        name: 'Simple Beer',
        brewery: 'Simple Brewery',
        style: '',
        rating: 0,
        notes: '',
        dateAdded: '1/2/2024',
      },
    ]
    renderComponent(beers)
    const actions = setupListActions()

    await actions.deleteBeer('Simple Beer')

    expect(mockOnDeleteBeer).toHaveBeenCalledWith(2)
  })

  it('renders delete buttons for all beers', () => {
    const beers: Beer[] = [
      {
        id: 1,
        name: 'Test IPA',
        brewery: 'Test Brewery',
        style: 'IPA',
        rating: 4,
        notes: 'Great beer',
        dateAdded: '1/1/2024',
      },
      {
        id: 2,
        name: 'Simple Beer',
        brewery: 'Simple Brewery',
        style: '',
        rating: 0,
        notes: '',
        dateAdded: '1/2/2024',
      },
    ]

    renderComponent(beers)
    const actions = setupListActions()

    const deleteButtons = actions.deleteButtons()
    expect(deleteButtons).toHaveLength(2)
    expect(deleteButtons[0]).toHaveAccessibleName('Delete Beer Test IPA')
    expect(deleteButtons[1]).toHaveAccessibleName('Delete Beer Simple Beer')
  })
})

function renderComponent(beers: Beer[]) {
  render(<BeerList beers={beers} onDeleteBeer={mockOnDeleteBeer} locale={'de-DE'} />)
}

const mockOnDeleteBeer = vi.mocked<BeerListProps['onDeleteBeer']>(vi.fn())
