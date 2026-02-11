import { useState, useEffect } from 'react';
import { api } from '../api';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { EditIcon, TrashIcon } from '../components/Icons';

export default function Payments() {
  const [list, setList] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ party_id: '', amount: '', payment_date: new Date().toISOString().slice(0, 10), notes: '' });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [paymentsData, partiesData] = await Promise.all([
        api.get('/api/payments'),
        api.get('/api/parties'),
      ]);
      setList(paymentsData);
      setParties(partiesData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ party_id: parties[0]?.id || '', amount: '', payment_date: new Date().toISOString().slice(0, 10), notes: '' });
    setModal('add');
  };

  const openEdit = (row) => {
    setForm({
      id: row.id,
      party_id: row.party_id,
      amount: row.amount ?? '',
      payment_date: row.payment_date || '',
      notes: row.notes || '',
    });
    setModal('edit');
  };

  const save = async () => {
    setError('');
    try {
      const payload = { ...form, party_id: Number(form.party_id), amount: Number(form.amount) };
      if (modal === 'add') {
        await api.post('/api/payments', payload);
      } else {
        await api.put(`/api/payments/${form.id}`, payload);
      }
      setModal(null);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/api/payments/${id}`);
      setDeleteConfirm(null);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Payments</h1>
        <button type="button" className="btn btn-primary" onClick={openAdd} disabled={!parties.length}>+ Add Payment</button>
      </div>
      {!parties.length && <p className="error-msg">Add at least one party first.</p>}
      {error && <p className="error-msg">{error}</p>}
      {loading ? (
        <div className="card">
          <div className="empty-state">
            <div className="skeleton" style={{ height: 24, width: '60%', margin: '0 auto 0.5rem' }} />
            <div className="skeleton" style={{ height: 20, width: '40%', margin: '0 auto' }} />
          </div>
        </div>
      ) : list.length === 0 ? (
        <div className="card animate-fade-in-up">
          <p className="empty-state">No payments yet. Record a payment when a party pays.</p>
        </div>
      ) : (
        <div className="card table-wrap animate-fade-in-up">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Party</th>
                  <th>Amount (₹)</th>
                  <th>Notes</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody className="stagger-children">
                {list.map((row) => (
                  <tr key={row.id} className="stagger-item">
                    <td>{row.payment_date || '—'}</td>
                    <td>{row.party_name || '—'}</td>
                    <td>₹{Number(row.amount).toLocaleString()}</td>
                    <td>{row.notes || '—'}</td>
                    <td>
                      <div className="action-buttons">
                        <button type="button" className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(row)} title="Edit"><EditIcon /></button>
                        <button type="button" className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleteConfirm({ id: row.id })} title="Delete"><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="list-cards-mobile">
            {list.map((row) => (
              <div key={row.id} className="list-card-item">
                <div className="detail-row"><span>Date</span><span>{row.payment_date || '—'}</span></div>
                <div className="detail-row"><span>Party</span><span>{row.party_name || '—'}</span></div>
                <div className="detail-row"><span>Amount</span><span>₹{Number(row.amount).toLocaleString()}</span></div>
                <div className="detail-row"><span>Notes</span><span>{row.notes || '—'}</span></div>
                <div className="card-actions">
                  <button type="button" className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(row)} title="Edit"><EditIcon /></button>
                  <button type="button" className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleteConfirm({ id: row.id })} title="Delete"><TrashIcon /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Add Payment' : 'Edit Payment'}>
        <div className="input-group">
          <label>Party *</label>
          <select value={form.party_id} onChange={(e) => setForm({ ...form, party_id: e.target.value })}>
            {parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label>Amount (₹) *</label>
          <input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0" />
        </div>
        <div className="input-group">
          <label>Payment Date *</label>
          <input type="date" value={form.payment_date} onChange={(e) => setForm({ ...form, payment_date: e.target.value })} />
        </div>
        <div className="input-group">
          <label>Notes</label>
          <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Reference, mode, etc." />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={save}>Save</button>
          <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete payment?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteConfirm && remove(deleteConfirm.id)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </>
  );
}
