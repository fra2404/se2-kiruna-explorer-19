import { Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext.tsx';
import { ModalProvider } from './context/ModalContext.tsx';
import { MapStyleProvider } from './context/MapStyleContext.tsx';
import API from './API.ts';
import DocumentForm from './components/organisms/DocumentForm.tsx';
import KirunaMap from './pages/KirunaMap.tsx';

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <MapStyleProvider>
          <Routes>
            <Route path="/" element={<KirunaMap />} />
          </Routes>
        </MapStyleProvider>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
