import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { name: user.name, email: user.email };
    localStorage.setItem('user', JSON.stringify(userData));
    alert("Registration Successful! Please Login 🚖");
    navigate('/login');
  };

  // Official Google OAuth Login Handler (Opens Google's real account popup)
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Fetch profile info of the selected Google account
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUserData = await res.json();

        const userData = {
          name: googleUserData.name,
          email: googleUserData.email,
          picture: googleUserData.picture
        };

        localStorage.setItem('user', JSON.stringify(userData));
        alert(`Welcome ${googleUserData.name}! Signed in with Google 🚖`);
        navigate('/dashboard');
      } catch (err) {
        console.error("Google Profile Fetch Error:", err);
      }
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '32px',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#0f172a', fontSize: '24px', fontWeight: 'bold' }}>Sign Up</h2>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Create your account to start riding</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="text" 
            name="name" 
            placeholder="Full Name" 
            required 
            value={user.name} 
            onChange={handleChange}
            style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none' }}
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            required 
            value={user.email} 
            onChange={handleChange}
            style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none' }}
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            required 
            value={user.password} 
            onChange={handleChange}
            style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none' }}
          />
          <button 
            type="submit" 
            style={{ padding: '12px', backgroundColor: '#fbbf24', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', color: '#0f172a', cursor: 'pointer', transition: '0.2s' }}
          >
            Register
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
          <div style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }}></div>
          <span style={{ padding: '0 12px', color: '#94a3b8', fontSize: '13px', fontWeight: 'bold' }}>OR</span>
          <div style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }}></div>
        </div>

        {/* Real Google Account Popup Button */}
        <button 
          type="button"
          onClick={() => loginWithGoogle()}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '15px',
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ marginTop: '24px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#2563eb', fontWeight: 'bold' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;