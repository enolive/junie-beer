import React from 'react'
import { Rate } from 'antd'
import { isValidRating, maxRating } from './Domain.ts'

export interface StarRatingProps {
  rating?: number
  onRatingChange: (rating: number) => void
  labelId?: string
}

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful']

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, labelId }) => {
  const currentRating = rating && isValidRating(rating) ? rating : 0
  return (
    <>
      <Rate
        value={currentRating}
        onChange={onRatingChange}
        count={maxRating}
        aria-labelledby={labelId}
        allowClear
        tooltips={desc}
      />
      {currentRating > 0 && (
        <output className="rating-text" aria-label="Current rating">
          ({currentRating}/5)
        </output>
      )}
    </>
  )
}

export default StarRating
