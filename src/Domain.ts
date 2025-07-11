export const maxRating = 5
export const validRatingRange = range(1, maxRating)
export const isValidRating = (rating: number) => validRatingRange.includes(rating)

export interface Beer {
  id: number
  name: string
  brewery: string
  style: string
  rating: number
  notes: string
  dateAdded: string
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}
