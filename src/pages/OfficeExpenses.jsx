import { useState, useEffect } from 'react';
import { api } from '../api';

export default function OfficeExpenses() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ category: '', description: '', amount: '', date: new Date().toISOString().slice(0, 10) });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/api/office-expenses');
      setList(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ category: '', description: '', amount: '', date: new Date().toISOString().slice(0, 10) });
    setModal('add');
  };

  const openEdit = (e) => {
    setForm({
      id: e.id,
      category: e.category || '',
      description: e.description || '',
      amount: e.amount ?? '',
      date: e.date || '',
    });
    setModal('edit');
  };

  const save = async () => {
    setError('');
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (modal === 'add') {
        await api.post('/api/office-expenses', payload);
      } else {
        await api.put(`/api/office-expenses/${form.id}`, payload);
      }
      setModal(null);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await api.delete(`/api/office-expenses/${id}`);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const total = list.reduce((s, x) => s + Number(x.amount || 0), 0);

  return (
    <>
      <div className="page-header">
        <h1>Office Expense</h1>
        <button type="button" className="btn btn-primary" onClick={openAdd}>+ Add Expense</button>
      </div>
      {error && <p className="error-msg">{error}</p>}
      {list.length > 0 && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <strong>Total Expense: ₹{total.toLocaleString()}</strong>
        </div>
      )}
      {loading ? (
        <p className="empty-state">Loading...</p>
      ) : list.length === 0 ? (
        <p className="empty-state">No office expenses yet.</p>
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id}>
                  <td>{e.date || '—'}</td>
                  <td>{e.category || '—'}</td>
                  <td>{e.description || '—'}</td>
                  <td>₹{Number(e.amount).toLocaleString()}</td>
                  <td>
                    <button type="button" className="btn btn-secondary" style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem' }} onClick={() => openEdit(e)}>Edit</button>
                    <button type="button" className="btn btn-danger" style={{ padding: '0.4rem 0.8rem' }} onClick={() => remove(e.id)}>Delete</button>
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
            <h2>{modal === 'add' ? 'Add Office Expense' : 'Edit Expense'}</h2>
            <div className="input-group">
              <label>Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Rent, Utilities" />
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div className="input-group">
              <label>Amount (₹) *</label>
              <input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
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
