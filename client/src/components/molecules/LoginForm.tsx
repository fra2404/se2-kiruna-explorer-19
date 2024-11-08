import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import InputComponent from '../atoms/input/input';
import ButtonRounded from '../atoms/button/ButtonRounded';

const LoginForm = (props: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login button clicked');

    if (email === '' || password === '' || !validateEmail(email)) {
      setError('Invalid credentials');
      return;
    }

    try {
      const result = await login(email, password);
      if (!result.error) {
        console.log('Login successful');
        setError(null);
        props.setLoginModalOpen(false);
      } else {
        setError(result.message || 'Invalid credentials');

        console.log('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid credentials');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      console.log('Enter key pressed');
      handleLogin(event as unknown as React.FormEvent);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md border">
      <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
      <div className="space-y-4">
        <InputComponent
          label="Email"
          type="email"
          value={email}
          onChange={(v) => {
            if ('target' in v) {
              setEmail(v.target.value);
            }
          }}
          required={true}
          placeholder="Enter your email"
          onKeyDown={handleKeyDown}
        />
        <InputComponent
          label="Password"
          type="password"
          value={password}
          onChange={(v) => {
            if ('target' in v) {
              setPassword(v.target.value);
            }
          }}
          required={true}
          placeholder="Enter your password"
          onKeyDown={handleKeyDown}
        />
        {error && <div className="text-red-600">{error}</div>}
        <ButtonRounded
          // type="submit"
          text="Log In"
          variant="filled"
          className="w-full bg-black text-white"
          onClick={handleLogin}
        />
      </div>
    </div>
  );
};

export default LoginForm;
