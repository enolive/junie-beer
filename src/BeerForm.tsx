import React from 'react'
import { useForm } from 'react-hook-form'
import StarRating from './StarRating'

export interface BeerFormData {
  name: string
  brewery: string
  style: string
  rating: number
  notes: string
}

export interface BeerFormProps {
  onSubmit: (beerData: BeerFormData) => void
}

const BeerForm: React.FC<BeerFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit, setValue, reset, watch } = useForm<BeerFormData>({
    defaultValues: {
      name: '',
      brewery: '',
      style: '',
      rating: 0,
      notes: '',
    },
  })

  const onSubmitForm = (data: BeerFormData) => {
    if (data.name && data.brewery) {
      onSubmit(data)
      reset()
    }
  }

  const currentRating = watch('rating')

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="beer-form" data-testid="add-beer-form">
      <div className="form-group">
        <label htmlFor="name">Beer Name *</label>
        <input {...register('name', { required: true })} type="text" id="name" />
      </div>

      <div className="form-group">
        <label htmlFor="brewery">Brewery *</label>
        <input {...register('brewery', { required: true })} type="text" id="brewery" />
      </div>

      <div className="form-group">
        <label htmlFor="style">Style</label>
        <input {...register('style')} type="text" id="style" placeholder="e.g., IPA, Stout, Lager" />
      </div>

      <div className="form-group">
        <label id="rating-label">Rating (1-5)</label>
        <StarRating rating={currentRating} onRatingChange={value => setValue('rating', value)} labelId="rating-label" />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea {...register('notes')} id="notes" placeholder="Your thoughts about this beer..." rows={3} />
      </div>

      <button type="submit" className="submit-btn">
        Add Beer
      </button>
    </form>
  )
}

export default BeerForm
