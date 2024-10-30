import LoginForm from './components/LoginForm';
// import InputComponent from './components/atoms/input/input';

// const options = [
//   { value: 'US', label: 'United States', code: 'US', prefix: '+1' },
//   { value: 'IT', label: 'Italy', code: 'IT', prefix: '+39' },
//   { value: 'FR', label: 'France', code: 'FR', prefix: '+33' },
// ];

function App() {
  // const [value, setValue] = useState('');

  // const handleChange = (
  //   event: React.ChangeEvent<
  //     HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  //   >,
  // ) => {
  //   setValue(event.target.value);
  // };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <LoginForm />
    </div>
  );
}

export default App;
