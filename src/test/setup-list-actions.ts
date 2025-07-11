import userEvent from '@testing-library/user-event'
import { screen, within } from '@testing-library/react'

export const setupListActions = () => {
  const user = userEvent.setup()
  return {
    deleteButtons() {
      return screen.getAllByRole('button', { name: /^Delete Beer/ })
    },
    async deleteBeer(name: string = '', confirm: boolean = true) {
      const regex = new RegExp(`^Delete Beer ${name}`)
      const deleteButton = screen.getByRole('button', { name: regex })
      await user.click(deleteButton)

      const dialog = screen.getByRole('dialog')
      const whichButton = confirm ? 'Yes' : 'No'
      await user.click(within(dialog).getByRole('button', { name: whichButton }))
    },
  }
}
