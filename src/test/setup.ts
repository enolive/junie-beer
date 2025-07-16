import '@testing-library/jest-dom/vitest'
import { afterEach, vi, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'

export const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock getComputedStyle, needed for antd
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
    paddingLeft: '0',
    paddingRight: '0',
    borderLeftWidth: '0',
    borderRightWidth: '0',
    marginLeft: '0',
    marginRight: '0',
  }),
})

// Mock matchMedia, needed for antd components
Object.defineProperty(window, 'matchMedia', {
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
})

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})
