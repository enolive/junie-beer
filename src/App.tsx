import React, { useEffect, useState } from 'react'
import './App.css'
import BeerForm, { BeerFormData } from './BeerForm'
import BeerList from './BeerList'
import { beerRepository } from './BeerRepository'
import { Beer } from './Domain.ts'

interface AppProps {
  dateFn?: () => Date
}

const App: React.FC<AppProps> = ({ dateFn }) => {
  const [beers, setBeers] = useState<Beer[]>(() => beerRepository.loadBeers())
  const getDate = dateFn || (() => new Date())

  useEffect(() => {
    beerRepository.saveBeers(beers)
  }, [beers])

  const handleBeerSubmit = (beerData: BeerFormData) => {
    const isoDate = getDate().toISOString().split('T')[0]
    const beer: Beer = {
      ...beerData,
      id: 0,
      dateAdded: isoDate,
    }
    setBeers(prev => [...prev, { ...beer, id: prev.length + 1 }])
  }

  const handleDeleteBeer = (id: number) => {
    setBeers(prev => prev.filter(beer => beer.id !== id))
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🍺 Junie's Beer Tracker</h1>
        <p role="complementary">Keep track of your favorite beers!</p>
      </header>

      <main className="App-main">
        <section role="region" aria-labelledby="beer-form-heading" className="add-beer-section">
          <h2 id="beer-form-heading">Add New Beer</h2>
          <BeerForm onSubmit={handleBeerSubmit} />
        </section>

        <section role="region" aria-labelledby="beer-collection-heading" className="beer-list-section">
          <h2 id="beer-collection-heading">Your Beer Collection ({beers.length})</h2>
          <BeerList beers={beers} onDeleteBeer={handleDeleteBeer} />
        </section>
      </main>
    </div>
  )
}

export default App
