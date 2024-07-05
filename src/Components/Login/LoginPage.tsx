import React, { useState } from 'react';
import  { AxiosError } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useLoginUserMutation } from '../../Services/loginServices';

interface ErrorResponse {
    error: {
        code?: number;
        message?: string;
    };
}

// Define the type for Axios errors
type CustomAxiosError = AxiosError<ErrorResponse>;

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginUserMutation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Reset errors
        setEmailError('');
        setPasswordError('');

        if (!email) {
            setEmailError('Email is required.');
        }

        if (!password) {
            setPasswordError('Password is required.');
        }

        if (!email || !password) {
            return;
        }

        try {
            const response = await login({ email, password }).unwrap();
            console.log(response, "response")
            if (response.success) {
                toast.success('Logged in successfully!');
                navigate('/ProductList');
                // Set Token In LocalStorage
                localStorage.setItem('token', response.token);
            } else {
                toast.error('Login failed. Please check your credentials.');
            }
        } catch (error) {
            const axiosError = error as CustomAxiosError;
            if (axiosError.response && axiosError.response.data && axiosError.response.data.error) {
                toast.error(axiosError.response.data.error.message || 'Invalid Credentials.');
            } else {
                toast.error('Invalid Credentials');
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-md">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
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
                        <label className="block text-sm font-medium text-gray-700">Password</label>
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
                        {isLoading ? 'Loading...' : 'Login'}
                    </button>
                    <p>
                        Don't have an account?{' '}
                        <button onClick={() => navigate('/Register')} className="text-sky-600">
                            Register one!
                        </button>
                    </p>
                </form>
            </div>
            <ToastContainer position="bottom-center" />
        </div>
    );
};

export default LoginPage;
