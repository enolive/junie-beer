// BeerRepository.ts
import { Beer } from './BeerList'

const STORAGE_KEY = 'junies-beer-tracker'

export class BeerRepository {
  loadBeers(): Beer[] {
    const savedBeers = localStorage.getItem(STORAGE_KEY)
    return savedBeers ? JSON.parse(savedBeers) : []
  }

  saveBeers(beers: Beer[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(beers))
  }
}

export const beerRepository = new BeerRepository()
