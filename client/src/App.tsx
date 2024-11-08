import { Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext.tsx';
import { ModalProvider } from './context/ModalContext.tsx';
import API from './API.ts';
import DocumentForm from './components/organisms/DocumentForm.tsx';
import KirunaMap from './pages/KirunaMap.tsx';

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Routes>
          <Route path="/" element={<KirunaMap />} />
        </Routes>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
