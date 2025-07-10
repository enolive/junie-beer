import React from 'react'

export interface Beer {
  id: number
  name: string
  brewery: string
  style: string
  rating: string
  notes: string
  dateAdded: string
}

export interface BeerListProps {
  beers: Beer[]
  onDeleteBeer: (id: number) => void
}

const BeerList: React.FC<BeerListProps> = ({ beers, onDeleteBeer }) => {
  return (
    <>
      {beers.length === 0 ? (
        <div role="status" aria-label="Beer collection status" className="no-beers">
          No beers added yet. Add your first beer above!
        </div>
      ) : (
        <ul className="beer-grid" role="list">
          {beers.map(beer => (
            <li key={beer.id}>
              <article className="beer-card" aria-labelledby={`beer-name-${beer.id}`}>
                <div className="beer-header">
                  <h3 id={`beer-name-${beer.id}`}>{beer.name}</h3>
                  <button
                    onClick={() => onDeleteBeer(beer.id)}
                    className="delete-btn"
                    aria-label={`Delete Beer ${beer.name}`}
                  >
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

                  {beer.rating && (
                    <>
                      <dt>Rating</dt>
                      <dd>
                        {'⭐'.repeat(parseInt(beer.rating))} ({beer.rating}/5)
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
                  <dd>{beer.dateAdded}</dd>
                </dl>
              </article>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default BeerList
