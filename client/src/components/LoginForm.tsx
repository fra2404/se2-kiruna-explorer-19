import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const LoginForm = (props: any) => {  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

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
    <>
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md border">
            <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Field */}
                <div className='mb-5'>
                    <label htmlFor="email" className="font-medium text-gray-700 mr-1">Email</label>
                    <span className='text-red-600'>*</span>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none"
                        placeholder="Enter your email"
                    />
                </div>
    
                {/* Password Field */}
                <div>
                    <label htmlFor="password" className="font-medium text-gray-700 mr-1">Password</label>
                    <span className='text-red-600'>*</span>
                    <div className='flex items-center w-full px-3 py-2 mt-1 border border-gray-300 rounded '>
                        <input
                            id="password"
                            type={isPasswordVisible ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full focus:outline-none"
                            placeholder="Enter your password"
                        />
                        {isPasswordVisible ? <FaRegEye
                            className="cursor-pointer"
                            onClick={togglePasswordVisibility}
                            /> : <FaRegEyeSlash
                            size={22}
                            className="text-slate-400 cursor-pointer"
                            onClick={togglePasswordVisibility}
                            />
                        }
                    </div>            
                </div>

                { error && <div className="text-red-600">{error}</div> }
    
                {/* Submit Button */}
                <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-black rounded hover:bg-slate-900 focus:outline-none"
                >
                Log In
                </button>
            </form>
        </div>
    </>
  );
};

export default LoginForm;
