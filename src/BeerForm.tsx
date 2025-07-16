import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button, Form, Input } from 'antd'
import StarRating from './StarRating.tsx'

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
  const { control, handleSubmit, reset } = useForm<BeerFormData>({
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

  return (
    <Form
      onFinish={handleSubmit(onSubmitForm)}
      layout="vertical"
      data-testid="add-beer-form"
      size="large"
      className="space-y-4"
    >
      <Form.Item label="Beer Name" required htmlFor="beer-name">
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => <Input id="beer-name" prefix="🍺" {...field} placeholder="Enter beer name" />}
        />
      </Form.Item>

      <Form.Item label="Brewery" required htmlFor="brewery">
        <Controller
          name="brewery"
          control={control}
          rules={{ required: true }}
          render={({ field }) => <Input id="brewery" prefix="🏠" {...field} placeholder="Enter brewery name" />}
        />
      </Form.Item>

      <Form.Item label="Style" htmlFor="style">
        <Controller
          name="style"
          control={control}
          render={({ field }) => <Input id="style" prefix="💄" {...field} placeholder="e.g., IPA, Stout, Lager" />}
        />
      </Form.Item>

      <Form.Item>
        {/*
        the rating is not a real input element but a collection of stars,
        so a label would not apply here!

        mimic an antd label here to make it visually similar to the real labels
        */}
        <div className="ant-col ant-form-item-label">
          <span id="rating-label" className="ant-form-item-label">
            Rating (1-5)
          </span>
        </div>
        <Controller
          name="rating"
          control={control}
          render={({ field: { value, onChange } }) => (
            <StarRating rating={value} onRatingChange={onChange} aria-labelledby="rating-label" />
          )}
        />
      </Form.Item>

      <Form.Item label="Notes" htmlFor="notes">
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <Input.TextArea
              id="notes"
              {...field}
              placeholder="Your thoughts about this beer..."
              rows={3}
              className="min-h-[100px] resize-y"
            />
          )}
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          className="w-full gradient-background hover:shadow-lg transition-all duration-300"
        >
          Add Beer
        </Button>
      </Form.Item>
    </Form>
  )
}

export default BeerForm
