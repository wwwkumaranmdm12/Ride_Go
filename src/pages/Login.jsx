import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Already register panra appo Name store aayirukka nu check panrom
    const existingUser = JSON.parse(localStorage.getItem('user'));
    
    // Name irundha adhe Name-a vachipom, illana email-a fallback-a vachipom
    const userData = {
      name: existingUser?.name || credentials.email.split('@')[0],
      email: credentials.email
    };

    localStorage.setItem('user', JSON.stringify(userData));

    alert("Login Successful! Welcome back 🚖");
    navigate('/dashboard');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          required 
          value={credentials.email} 
          onChange={handleChange}
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          required 
          value={credentials.password} 
          onChange={handleChange}
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#fbbf24', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;