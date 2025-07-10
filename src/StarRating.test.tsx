import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import StarRating, { StarRatingProps } from './StarRating'
import userEvent from '@testing-library/user-event'

describe('StarRating', () => {
  beforeEach(() => {
    mockOnRatingChange.mockClear()
  })

  it('renders 5 star buttons', () => {
    renderComponent()

    const starButtons = screen.getAllByRole('button')
    expect(starButtons).toHaveLength(5)
    expect(starButtons[0]).toHaveAccessibleName('Rate 1 star')
    expect(starButtons[1]).toHaveAccessibleName('Rate 2 stars')
    expect(starButtons[2]).toHaveAccessibleName('Rate 3 stars')
    expect(starButtons[3]).toHaveAccessibleName('Rate 4 stars')
    expect(starButtons[4]).toHaveAccessibleName('Rate 5 stars')
  })

  it('displays the correct number of filled stars based on rating', () => {
    renderComponent(3)

    const starButtons = screen.getAllByRole('button')
    expect(starButtons[0]).toHaveClass('star-filled')
    expect(starButtons[1]).toHaveClass('star-filled')
    expect(starButtons[2]).toHaveClass('star-filled')
    expect(starButtons[3]).toHaveClass('star-empty')
    expect(starButtons[4]).toHaveClass('star-empty')
  })

  it('displays rating text when rating is provided', () => {
    renderComponent(4)

    const ratingStatus = screen.getByRole('status', { name: 'Current rating' })
    expect(ratingStatus).toHaveTextContent('(4/5)')
  })

  describe('does not display rating text when rating is invalid or empty', () => {
    it.each([undefined, -1, 0, 6, 42])('%j', rating => {
      renderComponent(rating)

      const ratingStatus = screen.queryByRole('status', { name: 'Current rating' })
      expect(ratingStatus).not.toBeInTheDocument()
      const starButtons = screen.getAllByRole('button')
      starButtons.forEach(button => expect(button).toHaveClass('star-empty'))
    })
  })

  it('calls onRatingChange when a star is clicked', async () => {
    const user = userEvent.setup()
    renderComponent()

    const thirdStar = screen.getByRole('button', { name: 'Rate 3 stars' })
    await user.click(thirdStar)

    expect(mockOnRatingChange).toHaveBeenCalledWith(3)
  })

  it('updates hover state on mouse enter and leave', async () => {
    const user = userEvent.setup()
    renderComponent(1)

    const starButtons = screen.getAllByRole('button')
    const fourthStar = starButtons[3]

    await user.hover(fourthStar)

    // The first 4 stars should be filled due to hover
    expect(starButtons[0]).toHaveClass('star-filled')
    expect(starButtons[1]).toHaveClass('star-filled')
    expect(starButtons[2]).toHaveClass('star-filled')
    expect(starButtons[3]).toHaveClass('star-filled')
    expect(starButtons[4]).toHaveClass('star-empty')

    // Mouse leave should reset to the original rating
    const container = screen.getByRole('group')
    await user.unhover(container)

    // Should go back to showing only 1 star filled
    expect(starButtons[0]).toHaveClass('star-filled')
    expect(starButtons[1]).toHaveClass('star-empty')
    expect(starButtons[2]).toHaveClass('star-empty')
    expect(starButtons[3]).toHaveClass('star-empty')
    expect(starButtons[4]).toHaveClass('star-empty')
  })

  it('works without labelId prop', () => {
    renderComponent(3)

    const container = screen.getByRole('group')
    expect(container).not.toHaveAttribute('aria-labelledby')
  })

  it('handles rating at maximum value', () => {
    renderComponent(5)

    const starButtons = screen.getAllByRole('button')

    // All stars should be filled
    starButtons.forEach(button => {
      expect(button).toHaveClass('star-filled')
    })

    expect(screen.getByText('(5/5)')).toBeInTheDocument()
  })

  it('allows clicking the same star multiple times', () => {
    renderComponent(3)

    const thirdStar = screen.getAllByRole('button')[2]

    fireEvent.click(thirdStar)
    expect(mockOnRatingChange).toHaveBeenCalledWith(3)

    fireEvent.click(thirdStar)
    expect(mockOnRatingChange).toHaveBeenCalledTimes(2)
    expect(mockOnRatingChange).toHaveBeenLastCalledWith(3)
  })
})

function renderComponent(stars?: number, labelId?: string) {
  render(<StarRating rating={stars} onRatingChange={mockOnRatingChange} labelId={labelId} />)
}

const mockOnRatingChange = vi.mocked<StarRatingProps['onRatingChange']>(vi.fn())
