import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/app/parties', label: 'Party Details' },
  { to: '/app/challans', label: 'Challans' },
  { to: '/app/search-by-challan', label: 'Search by Challan' },
  { to: '/app/search-by-party', label: 'Search by Party' },
  { to: '/app/employees', label: 'Employees' },
  { to: '/app/salaries', label: 'Salary' },
  { to: '/app/office-expenses', label: 'Office Expense' },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = () => {
      if (mq.matches) setSidebarOpen(false);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const logout = () => {
    localStorage.removeItem('mk_token');
    window.location.href = '/';
  };

  return (
    <div className="app-layout">
      {/* Mobile header */}
      <header className="app-header">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="hamburger" data-open={sidebarOpen} />
          <span className="hamburger" data-open={sidebarOpen} />
          <span className="hamburger" data-open={sidebarOpen} />
        </button>
        <span className="app-header-title">M.K. Trading</span>
      </header>

      {/* Sidebar overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'sidebar-overlay--open' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-brand">
          <strong>M.K. Trading</strong>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
              onClick={closeSidebar}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button type="button" className="btn btn-secondary sidebar-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="app-main">
        <div className="app-main-inner animate-fade-in">
          <Outlet />
        </div>
      </main>

      <style>{`
        .app-layout {
          display: flex;
          min-height: 100vh;
        }

        .app-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--header-height);
          padding: 0 1rem;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          z-index: 100;
        }

        .sidebar-toggle {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 40px;
          height: 40px;
          padding: 0;
          background: transparent;
          border: none;
          border-radius: var(--radius-sm);
          color: var(--text);
          transition: background var(--transition-fast);
        }
        .sidebar-toggle:hover { background: var(--surface-hover); }
        .sidebar-toggle:active { background: var(--surface-active); }

        .hamburger {
          display: block;
          height: 2px;
          background: currentColor;
          border-radius: 1px;
          width: 20px;
          margin: 0 auto;
          transition: transform var(--transition-normal), opacity var(--transition-fast);
        }
        .sidebar-toggle .hamburger:nth-child(1) {
          transform: translateY(0) rotate(0);
        }
        .sidebar-toggle .hamburger:nth-child(2) {
          opacity: 1;
        }
        .sidebar-toggle .hamburger:nth-child(3) {
          transform: translateY(0) rotate(0);
        }
        .sidebar-toggle [data-open="true"]:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .sidebar-toggle [data-open="true"]:nth-child(2) {
          opacity: 0;
        }
        .sidebar-toggle [data-open="true"]:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        .app-header-title {
          font-weight: 700;
          font-size: 1.1rem;
        }

        .sidebar-overlay {
          display: block;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 150;
          opacity: 0;
          visibility: hidden;
          transition: opacity var(--transition-normal), visibility var(--transition-normal);
        }
        .sidebar-overlay--open {
          opacity: 1;
          visibility: visible;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--surface);
          border-right: 1px solid var(--border);
          padding: 1rem 0;
          z-index: 200;
          display: flex;
          flex-direction: column;
          transform: translateX(-100%);
          transition: transform var(--transition-normal);
          overflow-y: auto;
        }
        .sidebar--open {
          transform: translateX(0);
        }

        .sidebar-brand {
          padding: 0 1.25rem 1rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 1rem;
        }
        .sidebar-brand strong {
          font-size: 1.15rem;
        }

        .sidebar-nav {
          flex: 1;
        }

        .sidebar-link {
          display: block;
          padding: 0.75rem 1.25rem;
          color: var(--text-muted);
          text-decoration: none;
          border-left: 3px solid transparent;
          margin-left: -3px;
          transition: color var(--transition-fast), background var(--transition-fast), border-color var(--transition-fast);
        }
        .sidebar-link:hover {
          color: var(--text);
          background: var(--surface-hover);
        }
        .sidebar-link--active {
          color: var(--accent);
          background: var(--accent-muted);
          border-left-color: var(--accent);
        }

        .sidebar-footer {
          padding: 1rem 1.25rem;
          border-top: 1px solid var(--border);
        }
        .sidebar-logout {
          width: 100%;
        }

        .app-main {
          flex: 1;
          padding: calc(var(--header-height) + 1rem) 1rem 1.5rem;
          overflow: auto;
          min-width: 0;
        }

        .app-main-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (min-width: 1024px) {
          .app-header {
            display: none;
          }
          .sidebar-overlay {
            display: none;
          }
          .sidebar {
            transform: translateX(0);
            top: 0;
            padding-top: 1rem;
          }
          .app-main {
            margin-left: var(--sidebar-width);
            padding: 1.5rem 2rem;
          }
        }
      `}</style>
    </div>
  );
}
