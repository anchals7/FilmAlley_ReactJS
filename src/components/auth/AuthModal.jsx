import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('login');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">&times;</button>
        <div className="mb-4 flex justify-center space-x-4">
          <button
            className={`btn ${mode === 'login' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`btn ${mode === 'register' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>
        {mode === 'login' ? (
          <LoginForm onSuccess={onClose} />
        ) : (
          <RegisterForm onSuccess={onClose} />
        )}
      </div>
    </div>
  );
};

export default AuthModal; 