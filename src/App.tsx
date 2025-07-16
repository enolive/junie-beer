import React, { useEffect, useState } from 'react'
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
    <div className="max-w-7xl mx-auto px-5">
      <header className="text-center mb-10 p-8 gradient-background rounded-2xl shadow-lg text-white mt-5">
        <h1 className="text-4xl font-bold mb-2 drop-shadow-md">🍺 Junie's Beer Tracker</h1>
        <p role="complementary" className="text-lg opacity-90">
          Keep track of your favorite beers!
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section
          role="region"
          aria-labelledby="beer-form-heading"
          className="md:col-span-1 bg-white p-8 rounded-2xl shadow-lg"
        >
          <h2 id="beer-form-heading" className="section-header">
            Add New Beer
          </h2>
          <BeerForm onSubmit={handleBeerSubmit} />
        </section>

        <section
          role="region"
          aria-labelledby="beer-collection-heading"
          className="md:col-span-2 bg-white p-8 rounded-2xl shadow-lg"
        >
          <h2 id="beer-collection-heading" className="section-header">
            Your Beer Collection ({beers.length})
          </h2>
          <BeerList beers={beers} onDeleteBeer={handleDeleteBeer} labelId="beer-collection-heading" />
        </section>
      </main>

      <footer className="text-center mt-10 mb-5 p-6 gradient-background rounded-2xl shadow-lg text-white">
        <p className="mb-2 opacity-90">
          Created with the <b>help</b> of the almighty AI
        </p>
        <a
          href="https://www.jetbrains.com/junie"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white font-semibold border-b-2 border-white/50 hover:border-white transition-colors"
        >
          Visit Junie AI's website
        </a>
      </footer>
    </div>
  )
}

export default App
