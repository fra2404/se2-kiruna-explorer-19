import { useState } from 'react';
import InputComponent from './atoms/input/input';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (e : any) => setEmail(e.target.value);
    const handlePasswordChange = (e : any) => setPassword(e.target.value);

    const handleSubmit = async (e : any) => {
        e.preventDefault();
    };

    return (
      <form onSubmit={handleSubmit} className="w-full max-w-[600px] mt-36 bg-white border px-6 py-3 rounded">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <InputComponent label="Email" type="email" value={email} onChange={handleEmailChange} required />

        <InputComponent label="Password" type="password" value={password} onChange={handlePasswordChange} required />

        <div className="w-full flex items-center">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded mx-auto">
            Login
          </button>
        </div>
      </form>
    );
}

export default LoginForm;