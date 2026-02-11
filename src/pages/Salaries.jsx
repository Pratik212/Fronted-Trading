import { useState, useEffect } from 'react';
import { api } from '../api';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Salaries() {
  const [list, setList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ employee_id: '', month: '', year: new Date().getFullYear(), amount: '', paid_date: '', notes: '' });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [salariesData, employeesData] = await Promise.all([
        api.get('/api/salaries'),
        api.get('/api/employees'),
      ]);
      setList(salariesData);
      setEmployees(employeesData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    const d = new Date();
    setForm({
      employee_id: employees[0]?.id || '',
      month: MONTHS[d.getMonth()],
      year: d.getFullYear(),
      amount: '',
      paid_date: d.toISOString().slice(0, 10),
      notes: '',
    });
    setModal('add');
  };

  const openEdit = (s) => {
    setForm({
      id: s.id,
      employee_id: s.employee_id,
      month: s.month || '',
      year: s.year || '',
      amount: s.amount ?? '',
      paid_date: s.paid_date || '',
      notes: s.notes || '',
    });
    setModal('edit');
  };

  const save = async () => {
    setError('');
    try {
      const payload = { ...form, employee_id: Number(form.employee_id), amount: Number(form.amount) };
      if (modal === 'add') {
        await api.post('/api/salaries', payload);
      } else {
        await api.put(`/api/salaries/${form.id}`, payload);
      }
      setModal(null);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this salary record?')) return;
    try {
      await api.delete(`/api/salaries/${id}`);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Salary</h1>
        <button type="button" className="btn btn-primary" onClick={openAdd} disabled={!employees.length}>+ Add Salary</button>
      </div>
      {!employees.length && <p className="error-msg">Add employees first.</p>}
      {error && <p className="error-msg">{error}</p>}
      {loading ? (
        <p className="empty-state">Loading...</p>
      ) : list.length === 0 ? (
        <p className="empty-state">No salary records yet.</p>
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Month / Year</th>
                <th>Amount</th>
                <th>Paid Date</th>
                <th>Notes</th>
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id}>
                  <td>{s.employee_name || '—'}</td>
                  <td>{s.month} {s.year}</td>
                  <td>₹{Number(s.amount).toLocaleString()}</td>
                  <td>{s.paid_date || '—'}</td>
                  <td>{s.notes || '—'}</td>
                  <td>
                    <button type="button" className="btn btn-secondary" style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem' }} onClick={() => openEdit(s)}>Edit</button>
                    <button type="button" className="btn btn-danger" style={{ padding: '0.4rem 0.8rem' }} onClick={() => remove(s.id)}>Delete</button>
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
            <h2>{modal === 'add' ? 'Add Salary' : 'Edit Salary'}</h2>
            <div className="input-group">
              <label>Employee *</label>
              <select value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })}>
                {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label>Month</label>
                <select value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })}>
                  {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Year</label>
                <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} min="2020" max="2030" />
              </div>
            </div>
            <div className="input-group">
              <label>Amount (₹) *</label>
              <input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Paid Date</label>
              <input type="date" value={form.paid_date} onChange={(e) => setForm({ ...form, paid_date: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Notes</label>
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
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
