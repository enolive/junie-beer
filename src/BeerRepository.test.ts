import { beforeEach, describe, expect, it } from 'vitest'
import { beerRepository } from './BeerRepository'
import { localStorageMock } from './test/setup'

describe('BeerRepository', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('loads empty array when localStorage is empty', () => {
    const beers = beerRepository.loadBeers()
    expect(beers).toEqual([])
  })

  it('saves beers to localStorage', () => {
    const toSave = [
      {
        id: 1,
        name: 'Test Beer',
        brewery: 'Test Brewery',
        style: 'IPA',
        rating: 4,
        notes: 'Test notes',
        dateAdded: '1/1/2024',
      },
      {
        id: 2,
        name: 'Another Beer',
        brewery: 'Another Brewery',
        style: 'Stout',
        rating: 5,
        notes: 'More notes',
        dateAdded: '1/2/2024',
      },
    ]
    beerRepository.saveBeers(toSave)

    const beers = beerRepository.loadBeers()
    expect(beers).toEqual(toSave)
  })
})
