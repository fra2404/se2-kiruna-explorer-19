import { Route, Routes, useParams } from 'react-router-dom';
import KirunaMap from './components/Map.tsx';
import ComponentExample from './components/ComponentExample.tsx';

import './App.css';
import LoginForm from './components/LoginForm';
import { AuthProvider } from './context/AuthContext.tsx';

function App() {


  return ( 
    <Routes>
      <Route path="/" element={<KirunaMap></KirunaMap>}/>
    </Routes>
  );
}



export default App;
