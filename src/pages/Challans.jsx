import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Challans() {
  const [list, setList] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ challan_number: '', party_id: '', date: '', amount: '', description: '' });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [challansData, partiesData] = await Promise.all([
        api.get('/api/challans'),
        api.get('/api/parties'),
      ]);
      setList(challansData);
      setParties(partiesData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ challan_number: '', party_id: parties[0]?.id || '', date: new Date().toISOString().slice(0, 10), amount: '', description: '' });
    setModal('add');
  };

  const openEdit = (c) => {
    setForm({
      id: c.id,
      challan_number: c.challan_number,
      party_id: c.party_id,
      date: c.date || '',
      amount: c.amount ?? '',
      description: c.description || '',
    });
    setModal('edit');
  };

  const save = async () => {
    setError('');
    try {
      const payload = { ...form, party_id: Number(form.party_id), amount: Number(form.amount) || 0 };
      if (modal === 'add') {
        await api.post('/api/challans', payload);
      } else {
        await api.put(`/api/challans/${form.id}`, payload);
      }
      setModal(null);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this challan?')) return;
    try {
      await api.delete(`/api/challans/${id}`);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Challan Number</h1>
        <button type="button" className="btn btn-primary" onClick={openAdd} disabled={!parties.length}>+ Add Challan</button>
      </div>
      {!parties.length && <p className="error-msg">Add at least one party before adding challans.</p>}
      {error && <p className="error-msg">{error}</p>}
      {loading ? (
        <p className="empty-state">Loading...</p>
      ) : list.length === 0 ? (
        <p className="empty-state">No challans yet.</p>
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Challan No</th>
                <th>Party</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Description</th>
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td>{c.challan_number}</td>
                  <td>{c.party_name || '—'}</td>
                  <td>{c.date || '—'}</td>
                  <td>₹{Number(c.amount).toLocaleString()}</td>
                  <td>{c.description || '—'}</td>
                  <td>
                    <button type="button" className="btn btn-secondary" style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem' }} onClick={() => openEdit(c)}>Edit</button>
                    <button type="button" className="btn btn-danger" style={{ padding: '0.4rem 0.8rem' }} onClick={() => remove(c.id)}>Delete</button>
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
            <h2>{modal === 'add' ? 'Add Challan' : 'Edit Challan'}</h2>
            <div className="input-group">
              <label>Challan Number *</label>
              <input value={form.challan_number} onChange={(e) => setForm({ ...form, challan_number: e.target.value })} placeholder="e.g. CH-001" />
            </div>
            <div className="input-group">
              <label>Party *</label>
              <select value={form.party_id} onChange={(e) => setForm({ ...form, party_id: e.target.value })}>
                {parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Amount (₹)</label>
              <input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0" />
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
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
