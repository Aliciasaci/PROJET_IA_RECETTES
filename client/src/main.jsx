import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { FavoritesProvider } from './context/FavoritesProvider.jsx'
import { RatingProvider } from './context/RatingProvider.jsx' 

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <AuthProvider>
    <FavoritesProvider>
      <RatingProvider>
        <App />
      </RatingProvider>
    </FavoritesProvider>
  </AuthProvider>
  // {/* </React.StrictMode>, */}
)
