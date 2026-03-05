import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { JourneyProvider } from './context/JourneyContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <JourneyProvider>
      <App />
    </JourneyProvider>
  </StrictMode>,
)
