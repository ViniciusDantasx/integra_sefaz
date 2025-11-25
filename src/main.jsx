import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // Importa o componente principal que faremos a seguir
import './index.css' // Importa nosso CSS global

// A mágica do React acontece aqui:
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)