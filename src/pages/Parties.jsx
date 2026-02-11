import { useState, useEffect } from 'react';
import { api } from '../api';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { EditIcon, TrashIcon } from '../components/Icons';

export default function Parties() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
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
    try {
      await api.delete(`/api/parties/${id}`);
      setDeleteConfirm(null);
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
        <div className="card">
          <div className="empty-state">
            <div className="skeleton" style={{ height: 24, width: '60%', margin: '0 auto 0.5rem' }} />
            <div className="skeleton" style={{ height: 20, width: '40%', margin: '0 auto' }} />
          </div>
        </div>
      ) : list.length === 0 ? (
        <div className="card animate-fade-in-up">
          <p className="empty-state">No parties yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="card table-wrap animate-fade-in-up">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>GSTIN</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody className="stagger-children">
                {list.map((p) => (
                  <tr key={p.id} className="stagger-item">
                    <td>{p.name}</td>
                    <td>{p.contact || '—'}</td>
                    <td>{p.address || '—'}</td>
                    <td>{p.gstin || '—'}</td>
                    <td>
                      <div className="action-buttons">
                        <button type="button" className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(p)} title="Edit"><EditIcon /></button>
                        <button type="button" className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleteConfirm({ id: p.id })} title="Delete"><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="list-cards-mobile">
            {list.map((p) => (
              <div key={p.id} className="list-card-item">
                <div className="detail-row"><span>Name</span><span>{p.name}</span></div>
                <div className="detail-row"><span>Contact</span><span>{p.contact || '—'}</span></div>
                <div className="detail-row"><span>Address</span><span>{p.address || '—'}</span></div>
                <div className="detail-row"><span>GSTIN</span><span>{p.gstin || '—'}</span></div>
                <div className="card-actions">
                  <button type="button" className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(p)} title="Edit"><EditIcon /></button>
                  <button type="button" className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleteConfirm({ id: p.id })} title="Delete"><TrashIcon /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        title={modal === 'add' ? 'Add Party' : 'Edit Party'}
      >
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
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={save}>Save</button>
          <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete party?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteConfirm && remove(deleteConfirm.id)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </>
  );
}
