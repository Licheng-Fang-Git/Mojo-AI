import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import CompanionWidget from './components/CompanionWidget'

function App() {
  
  return (
    <>
      {/* TEMPORARY: mock props just to preview CompanionWidget's CSS. Real wiring comes later. */}
      <CompanionWidget
        pendingAiRequest={false}
        activityCaptureStatus="running"
        hasUnreadInsights={[{ id: '1', read: false }]}
      />
    </>
  )
}

export default App
