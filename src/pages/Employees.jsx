import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Employees() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', contact: '', role: '', joining_date: '' });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/api/employees');
      setList(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ name: '', contact: '', role: '', joining_date: '' });
    setModal('add');
  };

  const openEdit = (e) => {
    setForm({
      id: e.id,
      name: e.name,
      contact: e.contact || '',
      role: e.role || '',
      joining_date: e.joining_date || '',
    });
    setModal('edit');
  };

  const save = async () => {
    setError('');
    try {
      if (modal === 'add') {
        await api.post('/api/employees', form);
      } else {
        await api.put(`/api/employees/${form.id}`, form);
      }
      setModal(null);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this employee?')) return;
    try {
      await api.delete(`/api/employees/${id}`);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Employee Details</h1>
        <button type="button" className="btn btn-primary" onClick={openAdd}>+ Add Employee</button>
      </div>
      {error && <p className="error-msg">{error}</p>}
      {loading ? (
        <p className="empty-state">Loading...</p>
      ) : list.length === 0 ? (
        <p className="empty-state">No employees yet.</p>
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Joining Date</th>
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.contact || '—'}</td>
                  <td>{emp.role || '—'}</td>
                  <td>{emp.joining_date || '—'}</td>
                  <td>
                    <button type="button" className="btn btn-secondary" style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem' }} onClick={() => openEdit(emp)}>Edit</button>
                    <button type="button" className="btn btn-danger" style={{ padding: '0.4rem 0.8rem' }} onClick={() => remove(emp.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setModal(null)}>
          <div className="card" style={{ maxWidth: '420px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
            <h2>{modal === 'add' ? 'Add Employee' : 'Edit Employee'}</h2>
            <div className="input-group">
              <label>Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Employee name" />
            </div>
            <div className="input-group">
              <label>Contact</label>
              <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Phone / Email" />
            </div>
            <div className="input-group">
              <label>Role</label>
              <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Designation" />
            </div>
            <div className="input-group">
              <label>Joining Date</label>
              <input type="date" value={form.joining_date} onChange={(e) => setForm({ ...form, joining_date: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-primary" onClick={save}>Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
