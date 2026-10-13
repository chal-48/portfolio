import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { LanguageProvider } from './lib/i18n'
import App from './App'
import '@fontsource-variable/manrope'
import '@fontsource-variable/noto-sans-thai'
import './styles.css'
import './editorial.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <MotionConfig reducedMotion="user"><App /></MotionConfig>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
