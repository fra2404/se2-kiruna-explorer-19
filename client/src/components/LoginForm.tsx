import { useState } from 'react';
import InputComponent from './atoms/input/input';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => setEmail(e.target.value as string);
  const handlePasswordChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => setPassword(e.target.value as string);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login button clicked');
    try {
      const result = await login(email, password);
      if (!result.error) {
        console.log('Login successful');
        setError(null);
        // TODO: close modal or redirect to another page
      } else {
        console.log('Login failed');
        setError(result.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid credentials');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      console.log('Enter key pressed');
      handleLogin(event as unknown as React.FormEvent);
    }
  };

  return (
    <div
      className="w-full flex flex-col items-center justify-center"
      onKeyDown={handleKeyDown}
    >
      <form
        onSubmit={handleLogin}
        className="w-full max-w-[600px] bg-white border px-6 py-3 rounded"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <InputComponent
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          required
        />

        <InputComponent
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />

        <div className="w-full flex items-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded mx-auto"
          >
            Login
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
