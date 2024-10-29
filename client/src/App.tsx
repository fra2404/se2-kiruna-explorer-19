import { Route, Routes, useParams } from 'react-router-dom';
import KirunaMap from './components/Map.tsx'
import ComponentExample from './components/ComponentExample.tsx';

import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <KirunaMap >

        </KirunaMap>
      }/>
      <Route path="/component-example" element={
        <ComponentExample />
      }/>
    </Routes>
  )
}

export default App;
