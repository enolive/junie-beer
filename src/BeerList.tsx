import React, { createContext, useContext } from 'react'

import { Beer, isValidRating } from './Domain.ts'
import { Modal, Rate } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

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
        <div role="status" aria-label="Beer collection status" className="no-beers">
          No beers added yet. Add your first beer above!
        </div>
      ) : (
        <ul className="beer-grid" role="list" aria-labelledby={labelId}>
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
    <article className="beer-card" aria-labelledby={`beer-name-${beer.id}`}>
      <div className="beer-header">
        <h3 id={`beer-name-${beer.id}`}>{beer.name}</h3>
        <button onClick={showDeleteConfirm} className="delete-btn" aria-label={`Delete Beer ${beer.name}`}>
          ×
        </button>
      </div>
      <dl>
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
              <output className="rating-text" aria-label="Beer rating">
                <Rate value={beer.rating} disabled />({beer.rating}/5)
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
    </article>
  )
}

export default BeerList
