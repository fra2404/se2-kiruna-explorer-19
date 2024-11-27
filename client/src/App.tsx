import { Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext.tsx';
import { ModalProvider } from './context/ModalContext.tsx';
import { MapStyleProvider } from './context/MapStyleContext.tsx';
import KirunaMap from './pages/KirunaMap.tsx';
import { MunicipalityCoordinatesProvider } from './context/MunicipalityCoordinatesContext.tsx';

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <MapStyleProvider>
          <MunicipalityCoordinatesProvider>
            <Routes>
              <Route path="/" element={<KirunaMap />} />
            </Routes>
          </MunicipalityCoordinatesProvider>
        </MapStyleProvider>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
