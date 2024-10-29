import { useState } from 'react'
import './App.css'
import WarrantyRatings from './pages/warranty-ratings'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>        
      <WarrantyRatings />
    </>
  )
}

export default App
