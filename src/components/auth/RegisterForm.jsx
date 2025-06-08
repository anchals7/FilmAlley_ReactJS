import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = ({ onSuccess }) => {
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.username || !form.password || !form.confirmPassword) {
      setFormError('All fields except first/last name are required');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }
    if (form.username.length < 3) {
      setFormError('Username must be at least 3 characters long');
      return;
    }
    const res = await register(form);
    if (!res.success) {
      setFormError(error || 'Registration failed. Please try again.');
    } else if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} className="input" required />
      </div>
      <div>
        <label>Username</label>
        <input type="text" name="username" value={form.username} onChange={handleChange} className="input" required />
      </div>
      <div>
        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} className="input" required />
      </div>
      <div>
        <label>Confirm Password</label>
        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="input" required />
      </div>
      <div>
        <label>First Name</label>
        <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="input" />
      </div>
      <div>
        <label>Last Name</label>
        <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="input" />
      </div>
      {(formError || error) && (
        <div className="text-red-500 p-2 bg-red-100 rounded">
          {formError || error}
        </div>
      )}
      <button type="submit" className="btn w-full" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
    </form>
  );
};

export default RegisterForm; 