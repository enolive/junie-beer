import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setupFormActions } from './test/setup-form-actions.ts'
import BeerForm, { BeerFormProps } from './BeerForm'

describe('BeerForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('renders all form fields', () => {
    renderComponent()
    const actions = setupFormActions()
    const { nameInput, breweryInput, styleInput, notesInput, saveButton } = actions.getFormInputs()

    expect(nameInput).toBeInTheDocument()
    expect(breweryInput).toBeInTheDocument()
    expect(styleInput).toBeInTheDocument()
    expect(notesInput).toBeInTheDocument()
    expect(saveButton).toBeInTheDocument()
  })

  it('calls onSubmit with form data when submitted with required fields', async () => {
    renderComponent()
    const actions = setupFormActions()

    await actions.fillAllFields({ name: 'Test IPA', brewery: 'Test Brewery' })
    await actions.submitForm()

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Test IPA',
      brewery: 'Test Brewery',
      style: '',
      rating: 0,
      notes: '',
    })
  })

  it('changes the star depending on the rating', async () => {
    renderComponent()
    const actions = setupFormActions()

    await actions.setRating(4)

    expect(screen.getByRole('status')).toHaveTextContent('4/5')
  })

  it('calls onSubmit with all form data when all fields are filled', async () => {
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

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Hoppy IPA',
      brewery: 'Craft Brewery',
      style: 'IPA',
      rating: 4,
      notes: 'Very hoppy and delicious',
    })
  })

  it('clears form after successful submission', async () => {
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

    const { nameInput, breweryInput, styleInput, notesInput } = actions.getFormInputs()
    expect(nameInput).toHaveValue('')
    expect(breweryInput).toHaveValue('')
    expect(styleInput).toHaveValue('')
    expect(notesInput).toHaveValue('')
  })

  it('does not call onSubmit when required fields are missing', async () => {
    renderComponent()
    const actions = setupFormActions()

    await actions.submitForm()

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })
})

const mockOnSubmit = vi.mocked<BeerFormProps['onSubmit']>(vi.fn())

function renderComponent() {
  render(<BeerForm onSubmit={mockOnSubmit} />)
}
