import { useState } from 'react';
import { api } from '../api';

export default function SearchByChallan() {
  const [challanNumber, setChallanNumber] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    if (!challanNumber.trim()) {
      setError('Enter challan number');
      return;
    }
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const data = await api.get(`/api/parties/search-by-challan?challanNumber=${encodeURIComponent(challanNumber.trim())}`);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Search Party by Challan Number</h1>
      </div>
      <div className="card animate-fade-in-up" style={{ maxWidth: '500px' }}>
        <div className="input-group">
          <label>Challan Number</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              value={challanNumber}
              onChange={(e) => setChallanNumber(e.target.value)}
              placeholder="Enter challan number"
              onKeyDown={(e) => e.key === 'Enter' && search()}
            />
            <button type="button" className="btn btn-primary" onClick={search} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
        {error && <p className="error-msg">{error}</p>}
      </div>

      {result && (
        <div className="card animate-fade-in-up">
          <h2>Party Details</h2>
          <div className="detail-grid">
            <div className="detail-item"><span className="detail-label">Party Name</span><span className="detail-value">{result.name}</span></div>
            <div className="detail-item"><span className="detail-label">Contact</span><span className="detail-value">{result.contact || '—'}</span></div>
            <div className="detail-item"><span className="detail-label">Address</span><span className="detail-value">{result.address || '—'}</span></div>
            <div className="detail-item"><span className="detail-label">GSTIN</span><span className="detail-value">{result.gstin || '—'}</span></div>
            <div className="detail-item"><span className="detail-label">Challan Number</span><span className="detail-value">{result.challan_number}</span></div>
            <div className="detail-item"><span className="detail-label">Challan Date</span><span className="detail-value">{result.challan_date || '—'}</span></div>
            <div className="detail-item"><span className="detail-label">Challan Amount</span><span className="detail-value">₹{Number(result.challan_amount || 0).toLocaleString()}</span></div>
            <div className="detail-item"><span className="detail-label">Description</span><span className="detail-value">{result.description || '—'}</span></div>
          </div>
        </div>
      )}
    </>
  );
}
