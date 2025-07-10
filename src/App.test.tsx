import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'
import { setupFormActions } from './test/setup-form-actions.ts'
import { setupListActions } from './test/setup-list-actions.ts'

describe('App', () => {
  it('renders the main header and sections', () => {
    renderComponent()

    expect(screen.getByRole('banner')).toHaveTextContent("🍺 Junie's Beer Tracker")
    expect(screen.getByRole('complementary')).toHaveTextContent('Keep track of your favorite beers!')
    expect(screen.getByRole('region', { name: 'Add New Beer' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Your Beer Collection (0)' })).toBeInTheDocument()
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
    expect(screen.getByText('⭐⭐⭐⭐ (4/5)')).toBeInTheDocument()
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
})

function renderComponent() {
  render(<App />)
}
