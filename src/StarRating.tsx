import React from 'react'
import { Rate } from 'antd'
import { isValidRating, maxRating } from './Domain.ts'

export interface StarRatingProps {
  rating?: number
  onRatingChange: (rating: number) => void
  'aria-labelledby'?: string
}

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful']

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, 'aria-labelledby': ariaLabelledby }) => {
  const currentRating = rating && isValidRating(rating) ? rating : 0
  return (
    <div className="flex items-center gap-2">
      <Rate
        value={currentRating}
        onChange={onRatingChange}
        count={maxRating}
        aria-labelledby={ariaLabelledby}
        allowClear
        tooltips={desc}
      />
      {currentRating > 0 && (
        <output className="!p-0" aria-label="Current rating">
          ({currentRating}/5)
        </output>
      )}
    </div>
  )
}

export default StarRating
