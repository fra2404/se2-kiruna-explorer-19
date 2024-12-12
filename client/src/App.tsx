import { Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext.tsx';
import { ModalProvider } from './context/ModalContext.tsx';
import { MapStyleProvider } from './context/MapStyleContext.tsx';
import KirunaMap from './pages/KirunaMap.tsx';
import { MunicipalityCoordinatesProvider } from './context/MunicipalityCoordinatesContext.tsx';
import Diagram from './pages/Diagram.tsx';
import LandingPage from './pages/LandingPage.tsx';

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <MapStyleProvider>
          <MunicipalityCoordinatesProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/map" element={<KirunaMap />} />
              <Route path="/diagram/:id?" element={<Diagram />} />  {/* The id of the document is flagged as optional because we want to access the diagram even without a document selected */}
            </Routes>
          </MunicipalityCoordinatesProvider>
        </MapStyleProvider>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
