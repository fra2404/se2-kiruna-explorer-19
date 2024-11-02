import { Route, Routes } from 'react-router-dom';
import KirunaMap from './components/Map.tsx'
import ComponentExample from './components/ComponentExample.tsx';

import './App.css'
import LoginPage from './pages/LoginPage.tsx';
import DocumentCreationPage from './pages/DocumentCreationPage.tsx';

// import InputComponent from './components/atoms/input/input';

// const options = [
//   { value: 'US', label: 'United States', code: 'US', prefix: '+1' },
//   { value: 'IT', label: 'Italy', code: 'IT', prefix: '+39' },
//   { value: 'FR', label: 'France', code: 'FR', prefix: '+33' },
// ];
// const [value, setValue] = useState('');

// const handleChange = (
//   event: React.ChangeEvent<
//     HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//   >,
// ) => {
//   setValue(event.target.value);
// };

function App() {


  return (
    <Routes>
      <Route path="/" element={
        <KirunaMap >

        </KirunaMap>
      }/>

      <Route path="/component-example" element={
        <ComponentExample />
      }/>

      <Route path="/login" element={
        <LoginPage />
      }/>

      <Route path="/new-document" element={<DocumentCreationPage />} />
    </Routes>
  );
}

export default App;
