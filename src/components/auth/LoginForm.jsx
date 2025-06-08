import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const LoginForm = ({ onSuccess }) => {
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setFormError('Email and password are required');
      return;
    }
    const res = await login(form);
    if (res.success && onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} className="input" required />
      </div>
      <div>
        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} className="input" required />
      </div>
      {(formError || error) && <div className="text-red-500">{formError || error}</div>}
      <button type="submit" className="btn w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
    </form>
  );
};

export default LoginForm; 