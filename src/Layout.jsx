import { Outlet, NavLink } from 'react-router-dom';

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
  const logout = () => {
    localStorage.removeItem('mk_token');
    window.location.href = '/';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside
        style={{
          width: '240px',
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          padding: '1rem 0',
          flexShrink: 0,
        }}
      >
        <div style={{ padding: '0 1rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
          <strong style={{ fontSize: '1.1rem' }}>M.K. Trading</strong>
        </div>
        <nav>
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'block',
                padding: '0.65rem 1.25rem',
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                textDecoration: 'none',
                borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                marginLeft: '-3px',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '1rem 1.25rem', marginTop: 'auto' }}>
          <button type="button" className="btn btn-secondary" onClick={logout} style={{ width: '100%' }}>
            Logout
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: '1.5rem 2rem', overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
