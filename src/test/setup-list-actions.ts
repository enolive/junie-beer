import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'

export const setupListActions = () => {
  const user = userEvent.setup()
  return {
    deleteButtons() {
      return screen.getAllByRole('button', { name: /^Delete Beer/ })
    },
    async deleteBeer(name: string = '') {
      const regex = new RegExp(`^Delete Beer ${name}`)
      const deleteButton = screen.getByRole('button', { name: regex })
      await user.click(deleteButton)
    },
  }
}
