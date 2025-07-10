import React, { useState } from 'react'

export interface StarRatingProps {
  rating?: number
  onRatingChange: (rating: number) => void
  labelId?: string
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, labelId }) => {
  const [hoverRating, setHoverRating] = useState<number>(0)
  const maxRating = 5
  const validRange = range(1, maxRating)
  const currentRating = rating && validRange.includes(rating) ? rating : 0

  const handleStarClick = (starValue: number) => {
    onRatingChange(starValue)
  }

  const handleStarHover = (starValue: number) => {
    setHoverRating(starValue)
  }

  const handleMouseLeave = () => {
    setHoverRating(0)
  }

  return (
    <div
      className="star-rating"
      onMouseLeave={handleMouseLeave}
      {...(labelId && { 'aria-labelledby': labelId })}
      role="group"
    >
      {range(1, 5).map(star => (
        <button
          key={star}
          type="button"
          className={`star ${star <= (hoverRating || currentRating) ? 'star-filled' : 'star-empty'}`}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          ⭐
        </button>
      ))}
      {currentRating > 0 && (
        <output className="rating-text" aria-label="Current rating">
          ({currentRating}/5)
        </output>
      )}
    </div>
  )
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export default StarRating
