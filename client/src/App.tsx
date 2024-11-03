import { Route, Routes } from 'react-router-dom';
import KirunaMap from './components/Map.tsx';
import './App.css';
import { AuthProvider } from './context/AuthContext.tsx';
import LoginPage from './pages/LoginPage.tsx';
import DocumentForm from './components/DocumentForm.tsx';

function App() {
  return ( 
    <AuthProvider>
      <Routes>
        <Route path="/" element={<KirunaMap></KirunaMap>}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/document" element={<DocumentForm />}/>
      </Routes>
    </AuthProvider>
  );
}



export default App;
