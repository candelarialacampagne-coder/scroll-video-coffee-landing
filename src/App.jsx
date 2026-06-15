import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import ScrollVideoLanding from './demos/01-scroll-coffee/ScrollVideoLanding'
import IphoneLanding from './demos/02-iphone-apple/IphoneLanding'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo/scroll-coffee" element={<ScrollVideoLanding />} />
        <Route path="/demo/iphone-apple" element={<IphoneLanding />} />
      </Routes>
    </BrowserRouter>
  )
}
