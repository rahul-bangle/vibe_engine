import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { JourneyProvider } from './context/JourneyContext'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <JourneyProvider>
        <App />
      </JourneyProvider>
    </AuthProvider>
  </StrictMode>,
)
