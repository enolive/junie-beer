import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { setupFormActions } from './test/setup-form-actions'
import { setupListActions } from './test/setup-list-actions'
import { beerRepository } from './BeerRepository.ts'

vi.mock('./BeerRepository')

describe('App', () => {
  beforeEach(() => {
    mockedLoadBeers.mockClear()
    mockedLoadBeers.mockReturnValue([])
  })

  it('renders the main header and sections', () => {
    renderComponent()

    expect(screen.getByRole('banner')).toHaveTextContent("🍺 Junie's Beer Tracker")
    expect(screen.getByRole('complementary')).toHaveTextContent('Keep track of your favorite beers!')
    expect(screen.getByRole('region', { name: 'Add New Beer' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Your Beer Collection (0)' })).toBeInTheDocument()
  })

  it('renders the footer with correct text and link', () => {
    renderComponent()

    const footer = screen.getByRole('contentinfo')
    expect(footer).toMatchSnapshot()
  })

  it('shows empty state message when no beers are added', () => {
    renderComponent()

    expect(screen.getByText('No beers added yet. Add your first beer above!')).toBeInTheDocument()
  })

  it('adds a beer with required fields only', async () => {
    renderComponent()
    const actions = setupFormActions()

    await actions.fillAllFields({ name: 'Test IPA', brewery: 'Test Brewery' })
    await actions.submitForm()

    expect(screen.getByText('Your Beer Collection (1)')).toBeInTheDocument()
    expect(screen.getByText('Test IPA')).toBeInTheDocument()
    expect(screen.getByText('Test Brewery')).toBeInTheDocument()
    expect(screen.queryByText('No beers added yet')).not.toBeInTheDocument()
  })

  it('adds a beer with all fields filled', async () => {
    renderComponent()
    const actions = setupFormActions()

    await actions.fillAllFields({
      name: 'Hoppy IPA',
      brewery: 'Craft Brewery',
      style: 'IPA',
      notes: 'Very hoppy and delicious',
      rating: 4,
    })
    await actions.submitForm()

    expect(screen.getByText('Your Beer Collection (1)')).toBeInTheDocument()
    expect(screen.getByText('Hoppy IPA')).toBeInTheDocument()
    expect(screen.getByText('Craft Brewery')).toBeInTheDocument()
    expect(screen.getByText('IPA')).toBeInTheDocument()
    expect(screen.getByText('Very hoppy and delicious')).toBeInTheDocument()
    expect(screen.getByText('(4/5)')).toBeInTheDocument()
  })

  it('deletes a beer when delete button is clicked', async () => {
    renderComponent()
    const formActions = setupFormActions()
    const listActions = setupListActions()

    await formActions.fillAllFields({ name: 'Beer to Delete', brewery: 'Delete Brewery' })
    await formActions.submitForm()

    expect(screen.getByText('Your Beer Collection (1)')).toBeInTheDocument()
    expect(screen.getByText('Beer to Delete')).toBeInTheDocument()

    await listActions.deleteBeer('Beer to Delete')

    expect(screen.getByText('Your Beer Collection (0)')).toBeInTheDocument()
    expect(screen.queryByText('Beer to Delete')).not.toBeInTheDocument()
    expect(screen.getByText('No beers added yet. Add your first beer above!')).toBeInTheDocument()
  })

  it('adds multiple beers and displays correct count', async () => {
    renderComponent()
    const actions = setupFormActions()

    await actions.fillAllFields({ name: 'First Beer', brewery: 'First Brewery' })
    await actions.submitForm()
    await actions.fillAllFields({ name: 'Second Beer', brewery: 'Second Brewery' })
    await actions.submitForm()
    await actions.fillAllFields({ name: 'Third Beer', brewery: 'Third Brewery' })
    await actions.submitForm()

    expect(screen.getByText('Your Beer Collection (3)')).toBeInTheDocument()
    expect(screen.getByText('First Beer')).toBeInTheDocument()
    expect(screen.getByText('Second Beer')).toBeInTheDocument()
    expect(screen.getByText('Third Beer')).toBeInTheDocument()
  })

  it('loads beers from localStorage on initialization', () => {
    const mockBeers = [
      {
        id: 1,
        name: 'Saved Beer',
        brewery: 'Saved Brewery',
        style: 'IPA',
        rating: 4,
        notes: 'Loaded from storage',
        dateAdded: '1/1/2024',
      },
    ]
    mockedLoadBeers.mockReturnValueOnce(mockBeers)

    renderComponent()

    expect(screen.getByText('Your Beer Collection (1)')).toBeInTheDocument()
    expect(screen.getByText('Saved Beer')).toBeInTheDocument()
    expect(screen.getByText('Saved Brewery')).toBeInTheDocument()
  })

  it('saves beers to localStorage when a beer is added', async () => {
    const mockBeers = [
      {
        id: 1,
        name: 'Saved Beer',
        brewery: 'Saved Brewery',
        style: 'IPA',
        rating: 4,
        notes: 'Loaded from storage',
        dateAdded: '1/1/2024',
      },
    ]
    mockedLoadBeers.mockReturnValueOnce(mockBeers)
    renderComponent()
    const actions = setupFormActions()

    await actions.fillAllFields({
      name: 'New Beer',
      brewery: 'New Brewery',
      rating: 4,
      notes: 'Great beer!',
      style: 'IPA',
    })
    await actions.submitForm()

    expect(mockedSaveBeers).toHaveBeenCalledWith([
      ...mockBeers,
      {
        id: 2,
        name: 'New Beer',
        brewery: 'New Brewery',
        style: 'IPA',
        rating: 4,
        notes: 'Great beer!',
        dateAdded: '2025-07-11',
      },
    ])
  })

  it('updates localStorage when a beer is deleted', async () => {
    const mockBeers = [
      {
        id: 123,
        name: 'Beer to Delete',
        brewery: 'Delete Brewery',
        style: '',
        rating: 0,
        notes: '',
        dateAdded: '1/1/2024',
      },
    ]
    mockedLoadBeers.mockReturnValueOnce(mockBeers)
    renderComponent()
    const listActions = setupListActions()

    await listActions.deleteBeer('Beer to Delete')

    expect(mockedSaveBeers).toHaveBeenCalled()
    const lastCall = mockedSaveBeers.mock.calls[mockedSaveBeers.mock.calls.length - 1]
    const savedBeers = lastCall[0]
    expect(savedBeers).toHaveLength(0)
  })
})

function renderComponent() {
  render(<App dateFn={() => new Date('2025-07-11T00:00Z')} />)
}

const mockedLoadBeers = vi.mocked(beerRepository.loadBeers)
const mockedSaveBeers = vi.mocked(beerRepository.saveBeers)
