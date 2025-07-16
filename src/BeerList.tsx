import React, { createContext, useContext } from 'react'
import { Beer, isValidRating } from './Domain.ts'
import { Button, Card, Modal, Rate } from 'antd'
import { DeleteFilled, ExclamationCircleOutlined } from '@ant-design/icons'
import './BeerList.css'

interface BeerListContextType {
  onDeleteBeer: (id: number) => void
  locale?: string
}

const BeerListContext = createContext<BeerListContextType>({
  onDeleteBeer: () => {},
  locale: undefined,
})

export interface BeerListProps {
  beers: Beer[]
  onDeleteBeer: (id: number) => void
  locale?: string
  labelId?: string
}

const BeerList: React.FC<BeerListProps> = ({ beers, onDeleteBeer, locale, labelId }) => {
  return (
    <BeerListContext.Provider value={{ onDeleteBeer, locale }}>
      {beers.length === 0 ? (
        <div
          role="status"
          aria-label="Beer collection status"
          className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
        >
          No beers added yet. Add your first beer above!
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list" aria-labelledby={labelId}>
          {beers.map(beer => (
            <li key={beer.id}>
              <BeerCard beer={beer} />
            </li>
          ))}
        </ul>
      )}
    </BeerListContext.Provider>
  )
}

interface BeerCardProps {
  beer: Beer
}

const BeerCard: React.FC<BeerCardProps> = ({ beer }) => {
  const { onDeleteBeer, locale } = useContext(BeerListContext)
  const formattedDate = new Date(beer.dateAdded).toLocaleDateString(locale)
  const showDeleteConfirm = () => {
    Modal.confirm({
      title: 'Delete Beer',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete "${beer.name}"?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      closable: true,
      maskClosable: true,
      onOk() {
        onDeleteBeer(beer.id)
      },
    })
  }

  return (
    <Card
      aria-labelledby={`beer-name-${beer.id}`}
      title={<h3 className="text-xl font-semibold">{beer.name}</h3>}
      role="article"
      className="beer-card"
      extra={
        <Button
          color="danger"
          variant="solid"
          onClick={showDeleteConfirm}
          aria-label={`Delete Beer ${beer.name}`}
          shape="circle"
          icon={<DeleteFilled />}
        />
      }
    >
      <dl className="beer-definition-list">
        <dt>Brewery</dt>
        <dd>{beer.brewery}</dd>

        {beer.style && (
          <>
            <dt id={`style-label-${beer.id}`}>Style</dt>
            <dd aria-labelledby={`style-label-${beer.id}`}>{beer.style}</dd>
          </>
        )}

        {isValidRating(beer.rating) && (
          <>
            <dt>Rating</dt>
            <dd>
              <output className="flex items-center gap-2" aria-label="Beer rating">
                <Rate value={beer.rating} disabled />
                <span className="text-gray-600">({beer.rating}/5)</span>
              </output>
            </dd>
          </>
        )}

        {beer.notes && (
          <>
            <dt>Notes</dt>
            <dd>{beer.notes}</dd>
          </>
        )}

        <dt>Added</dt>
        <dd>{formattedDate}</dd>
      </dl>
    </Card>
  )
}

export default BeerList
