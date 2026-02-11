import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await login(username, password);
      localStorage.setItem('mk_token', token);
      navigate('/app/parties', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card animate-fade-in-up">
        <div className="login-header">
          <h1 className="login-title">M.K. Trading</h1>
          <p className="login-subtitle">Sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              autoComplete="username"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: linear-gradient(160deg, var(--bg) 0%, var(--bg-subtle) 50%, var(--surface) 100%);
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          padding: 2rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow-lg);
        }

        .login-header {
          text-align: center;
          margin-bottom: 1.75rem;
        }

        .login-title {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .login-subtitle {
          color: var(--text-muted);
          margin: 0.4rem 0 0 0;
          font-size: 0.95rem;
        }

        .login-form {
          margin-top: 0.5rem;
        }

        .login-submit {
          width: 100%;
          margin-top: 0.5rem;
          padding: 0.75rem;
        }
      `}</style>
    </div>
  );
}
