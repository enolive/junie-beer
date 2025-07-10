import userEvent from '@testing-library/user-event'
import { screen, within } from '@testing-library/react'

export interface BeerFormFields {
  name: string
  brewery: string
  style?: string
  notes?: string
  rating?: number
}

export const setupFormActions = () => {
  const user = userEvent.setup()

  const getFormInputs = () => {
    const form = screen.getByTestId('add-beer-form')
    return {
      nameInput: within(form).getByLabelText('Beer Name *'),
      breweryInput: within(form).getByLabelText('Brewery *'),
      styleInput: within(form).getByLabelText('Style'),
      notesInput: within(form).getByLabelText('Notes'),
      saveButton: within(form).getByRole('button', { name: 'Add Beer' }),
    }
  }

  return {
    getFormInputs,

    async fillAllFields({ name, brewery, style, notes, rating }: BeerFormFields) {
      const { nameInput, breweryInput, styleInput, notesInput } = getFormInputs()

      await user.type(nameInput, name)
      await user.type(breweryInput, brewery)

      if (style) {
        await user.type(styleInput, style)
      }

      if (notes) {
        await user.type(notesInput, notes)
      }

      if (rating) {
        await this.setRating(rating)
      }
    },

    async submitForm() {
      await user.click(screen.getByRole('button', { name: 'Add Beer' }))
    },

    async setRating(stars: number) {
      const starButtons = screen.getAllByRole('button', { name: /^Rate \d star/ })
      await user.click(starButtons[stars - 1])
    },
  }
}
