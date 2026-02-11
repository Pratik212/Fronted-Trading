import { useState, useEffect } from 'react';
import { api } from '../api';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { EditIcon, TrashIcon } from '../components/Icons';

export default function OfficeExpenses() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
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
    try {
      await api.delete(`/api/office-expenses/${id}`);
      setDeleteConfirm(null);
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
        <div className="card animate-fade-in-up" style={{ marginBottom: '1rem' }}>
          <strong>Total Expense: ₹{total.toLocaleString()}</strong>
        </div>
      )}
      {loading ? (
        <p className="empty-state">Loading...</p>
      ) : list.length === 0 ? (
        <div className="card animate-fade-in-up">
          <p className="empty-state">No office expenses yet.</p>
        </div>
      ) : (
        <div className="card table-wrap animate-fade-in-up">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody className="stagger-children">
                {list.map((e) => (
                  <tr key={e.id} className="stagger-item">
                    <td>{e.date || '—'}</td>
                    <td>{e.category || '—'}</td>
                    <td>{e.description || '—'}</td>
                    <td>₹{Number(e.amount).toLocaleString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button type="button" className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(e)} title="Edit"><EditIcon /></button>
                        <button type="button" className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleteConfirm({ id: e.id })} title="Delete"><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Add Office Expense' : 'Edit Expense'}>
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
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={save}>Save</button>
          <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete expense?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteConfirm && remove(deleteConfirm.id)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </>
  );
}
