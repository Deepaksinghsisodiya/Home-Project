import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// Define the expected structure of the error response
interface ErrorResponse {
  error: {
    code?: number;
    message?: string;
  };
}

// Define the type for Axios errors
type CustomAxiosError = AxiosError<ErrorResponse>;

const App: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      setFullNameError(fullName ? '' : 'Full name is required.');
      setEmailError(email ? '' : 'Email is required.');
      setPasswordError(password ? '' : 'Password is required.');
      return;
    }

    try {
      const response = await axios.post('https://r18brnk5-5000.inc1.devtunnels.ms/register/', {
        fullName: fullName,
        email: email,
        password: password,
      });

      if (response.data.success) {
        toast.success('Registered successfully!');
        navigate('/');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      const axiosError = error as CustomAxiosError;
      if (axiosError.response && axiosError.response.data && axiosError.response.data.error) {
        if (axiosError.response.data.error.code === 11000) {
          toast.error('Email already exists. Please use a different email.');
        } else {
          toast.error(axiosError.response.data.error.message || 'An error occurred. Please try again.');
        }
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className='relative'>
              <input
                placeholder="Please enter full name"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setFullNameError('');
                }}
                className="w-full px-3 py-2 pl-10 border rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 sm:text-sm"
              />
              <FontAwesomeIcon icon={faUser} className="absolute left-3 top-2 text-gray-400" />
            </div>
            {fullNameError && <p className="text-red-500 text-sm">{fullNameError}</p>}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <input
                placeholder="Please enter email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                className="w-full px-3 py-2 pl-10 border rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 sm:text-sm"
              />
              <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-2 text-gray-400" />

            </div>
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                placeholder="Please enter password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                className="w-full px-3 py-2 pl-10 pr-10 border rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 sm:text-sm"
              />
              <FontAwesomeIcon icon={faLock} className="absolute left-3 top-2 text-gray-400" />

              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="absolute right-3 top-2 cursor-pointer text-gray-400"
                onClick={togglePasswordVisibility}
              />
            </div>
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register
          </button>
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default App;
