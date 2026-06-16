import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import ScrollVideoLanding from './demos/01-scroll-coffee/ScrollVideoLanding'
import IphoneLanding from './demos/02-iphone-apple/IphoneLanding'
import AlpasionLanding from './demos/03-sticky-split-alpasion/AlpasionLanding'
import MetconLanding from './demos/04-metcon/MetconLanding'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo/scroll-coffee" element={<ScrollVideoLanding />} />
        <Route path="/demo/iphone-apple" element={<IphoneLanding />} />
        <Route path="/demo/alpasion" element={<AlpasionLanding />} />
        <Route path="/demo/metcon" element={<MetconLanding />} />
      </Routes>
    </BrowserRouter>
  )
}
