import { Route, Routes } from 'react-router-dom';
import KirunaMap from './components/Map.tsx';
import './App.css';
import { AuthProvider } from './context/AuthContext.tsx';
import LoginPage from './pages/LoginPage.tsx';

function App() {
  return ( 
    <AuthProvider>
      <Routes>
        <Route path="/" element={<KirunaMap></KirunaMap>}/>
        <Route path="/login" element={<LoginPage />}/>
      </Routes>
    </AuthProvider>
  );
}


export default App;
