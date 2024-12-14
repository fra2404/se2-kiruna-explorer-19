import { Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext.tsx';
import { ModalProvider } from './context/ModalContext.tsx';
import { MapStyleProvider } from './context/MapStyleContext.tsx';
import KirunaMap from './pages/KirunaMap.tsx';
import { MunicipalityCoordinatesProvider } from './context/MunicipalityCoordinatesContext.tsx';
import Diagram from './pages/Diagram.tsx';
import LandingPage from './pages/LandingPage.tsx';
import { SidebarProvider } from './context/SidebarContext.tsx';

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <MapStyleProvider>
          <SidebarProvider>
            <MunicipalityCoordinatesProvider>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/map" element={<KirunaMap />} />
                <Route path="/diagram/:id?" element={<Diagram />} />
              </Routes>
            </MunicipalityCoordinatesProvider>
          </SidebarProvider>
        </MapStyleProvider>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
