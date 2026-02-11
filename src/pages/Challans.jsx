import { useState, useEffect } from 'react';
import { api } from '../api';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { EditIcon, TrashIcon } from '../components/Icons';

export default function Challans() {
  const [list, setList] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
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
    try {
      await api.delete(`/api/challans/${id}`);
      setDeleteConfirm(null);
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
        <div className="card table-wrap animate-fade-in-up">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Challan No</th>
                  <th>Party</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody className="stagger-children">
                {list.map((c) => (
                  <tr key={c.id} className="stagger-item">
                    <td>{c.challan_number}</td>
                    <td>{c.party_name || '—'}</td>
                    <td>{c.date || '—'}</td>
                    <td>₹{Number(c.amount).toLocaleString()}</td>
                    <td>{c.description || '—'}</td>
                    <td>
                      <div className="action-buttons">
                        <button type="button" className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(c)} title="Edit"><EditIcon /></button>
                        <button type="button" className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleteConfirm({ id: c.id })} title="Delete"><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="list-cards-mobile">
            {list.map((c) => (
              <div key={c.id} className="list-card-item">
                <div className="detail-row"><span>Challan No</span><span>{c.challan_number}</span></div>
                <div className="detail-row"><span>Party</span><span>{c.party_name || '—'}</span></div>
                <div className="detail-row"><span>Date</span><span>{c.date || '—'}</span></div>
                <div className="detail-row"><span>Amount</span><span>₹{Number(c.amount).toLocaleString()}</span></div>
                <div className="detail-row"><span>Description</span><span>{c.description || '—'}</span></div>
                <div className="card-actions">
                  <button type="button" className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(c)} title="Edit"><EditIcon /></button>
                  <button type="button" className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleteConfirm({ id: c.id })} title="Delete"><TrashIcon /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Add Challan' : 'Edit Challan'}>
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
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={save}>Save</button>
          <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete challan?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteConfirm && remove(deleteConfirm.id)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </>
  );
}
