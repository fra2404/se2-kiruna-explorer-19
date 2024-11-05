import { Route, Routes } from 'react-router-dom';
import KirunaMap from './components/Map.tsx';
import './App.css';
import { AuthProvider } from './context/AuthContext.tsx';
import API from './API.ts';

function App() {
  return ( 
    <AuthProvider>
      <Routes>
        <Route path="/" element={<KirunaMap></KirunaMap>}/>
      </Routes>
    </AuthProvider>
  );
}


export default App;
