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
          <table>
            <tbody>
              <tr><th style={{ width: '180px' }}>Party Name</th><td>{result.name}</td></tr>
              <tr><th>Contact</th><td>{result.contact || '—'}</td></tr>
              <tr><th>Address</th><td>{result.address || '—'}</td></tr>
              <tr><th>GSTIN</th><td>{result.gstin || '—'}</td></tr>
              <tr><th>Challan Number</th><td>{result.challan_number}</td></tr>
              <tr><th>Challan Date</th><td>{result.challan_date || '—'}</td></tr>
              <tr><th>Challan Amount</th><td>₹{Number(result.challan_amount || 0).toLocaleString()}</td></tr>
              <tr><th>Description</th><td>{result.description || '—'}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
