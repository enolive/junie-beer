import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import StarRating, { StarRatingProps } from './StarRating'
import userEvent from '@testing-library/user-event'

describe('StarRating', () => {
  beforeEach(() => {
    mockOnRatingChange.mockClear()
  })

  it('renders 5 star buttons', () => {
    renderComponent()

    const starButtons = screen.getAllByRole('radio')
    expect(starButtons).toHaveLength(5)
  })

  it('displays rating text when rating is provided', () => {
    renderComponent(4)

    const ratingStatus = screen.getByRole('status', { name: 'Current rating' })
    expect(ratingStatus).toHaveTextContent('(4/5)')
    const starButtons = screen.getAllByRole('radio')
    expect(starButtons[0]).toBeChecked()
    expect(starButtons[1]).toBeChecked()
    expect(starButtons[2]).toBeChecked()
    expect(starButtons[3]).toBeChecked()
    expect(starButtons[4]).not.toBeChecked()
  })

  describe('does not display rating text when rating is invalid or empty', () => {
    it.each([undefined, -1, 0, 6, 42])('%j', rating => {
      renderComponent(rating)

      const ratingStatus = screen.queryByRole('status', { name: 'Current rating' })
      expect(ratingStatus).not.toBeInTheDocument()
      const starButtons = screen.getAllByRole('radio')
      starButtons.forEach(button => expect(button).not.toBeChecked())
    })
  })

  it('calls onRatingChange when a star is clicked', async () => {
    const user = userEvent.setup()
    renderComponent()

    const thirdStar = screen.getAllByRole('radio')[2]
    await user.click(thirdStar)

    expect(mockOnRatingChange).toHaveBeenCalledWith(3)
  })

  it('supports labelling', () => {
    renderComponent(3, 'test-label')

    const container = screen.getByRole('list')
    expect(container).toHaveAttribute('aria-labelledby', 'test-label')
  })

  it('works without labelId prop', () => {
    renderComponent(3)

    const container = screen.getByRole('list')
    expect(container).not.toHaveAttribute('aria-labelledby')
  })

  it('handles rating at maximum value', () => {
    renderComponent(5)

    const starButtons = screen.getAllByRole('radio')

    // All stars should be filled
    starButtons.forEach(button => {
      expect(button).toBeChecked()
    })

    expect(screen.getByText('(5/5)')).toBeInTheDocument()
  })

  it('allows clicking a star to set the rating', async () => {
    const user = userEvent.setup()
    renderComponent()

    const thirdStar = screen.getAllByRole('radio')[2]
    await user.click(thirdStar)

    expect(mockOnRatingChange).toHaveBeenCalledWith(3)
  })

  it('allows clicking the same star multiple times to reset the rating', async () => {
    const user = userEvent.setup()
    renderComponent(3)

    const thirdStar = screen.getAllByRole('radio')[2]
    await user.click(thirdStar)

    expect(mockOnRatingChange).toHaveBeenCalledWith(0)
  })
})

function renderComponent(stars?: number, labelId?: string) {
  render(<StarRating rating={stars} onRatingChange={mockOnRatingChange} aria-labelledby={labelId} />)
}

const mockOnRatingChange = vi.mocked<StarRatingProps['onRatingChange']>(vi.fn())
