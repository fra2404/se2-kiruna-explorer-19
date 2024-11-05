import { Route, Routes } from 'react-router-dom';
import KirunaMap from './components/Map.tsx';
import './App.css';
import { AuthProvider } from './context/AuthContext.tsx';
import { ModalProvider } from './context/ModalContext.tsx';
import API from './API.ts';

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Routes>
          <Route path="/" element={<KirunaMap></KirunaMap>} />

        </Routes>
      </ModalProvider>
    </AuthProvider>
  );
}


export default App;
