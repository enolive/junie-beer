import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
import App from './App.tsx'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
