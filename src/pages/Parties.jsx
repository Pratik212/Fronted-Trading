import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Parties() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', contact: '', address: '', gstin: '' });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/api/parties');
      setList(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ name: '', contact: '', address: '', gstin: '' });
    setModal('add');
  };

  const openEdit = (p) => {
    setForm({ id: p.id, name: p.name, contact: p.contact || '', address: p.address || '', gstin: p.gstin || '' });
    setModal('edit');
  };

  const save = async () => {
    setError('');
    try {
      if (modal === 'add') {
        await api.post('/api/parties', form);
      } else {
        await api.put(`/api/parties/${form.id}`, form);
      }
      setModal(null);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this party?')) return;
    try {
      await api.delete(`/api/parties/${id}`);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Party Details</h1>
        <button type="button" className="btn btn-primary" onClick={openAdd}>+ Add Party</button>
      </div>
      {error && <p className="error-msg">{error}</p>}
      {loading ? (
        <p className="empty-state">Loading...</p>
      ) : list.length === 0 ? (
        <p className="empty-state">No parties yet. Add one to get started.</p>
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Address</th>
                <th>GSTIN</th>
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.contact || '—'}</td>
                  <td>{p.address || '—'}</td>
                  <td>{p.gstin || '—'}</td>
                  <td>
                    <button type="button" className="btn btn-secondary" style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem' }} onClick={() => openEdit(p)}>Edit</button>
                    <button type="button" className="btn btn-danger" style={{ padding: '0.4rem 0.8rem' }} onClick={() => remove(p.id)}>Delete</button>
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
            <h2>{modal === 'add' ? 'Add Party' : 'Edit Party'}</h2>
            <div className="input-group">
              <label>Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Party name" />
            </div>
            <div className="input-group">
              <label>Contact</label>
              <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Phone / Email" />
            </div>
            <div className="input-group">
              <label>Address</label>
              <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" rows={2} />
            </div>
            <div className="input-group">
              <label>GSTIN</label>
              <input value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} placeholder="GST number" />
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
