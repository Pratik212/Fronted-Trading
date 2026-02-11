import { useState, useEffect } from 'react';
import { api } from '../api';

export default function SearchByParty() {
  const [parties, setParties] = useState([]);
  const [partyId, setPartyId] = useState('');
  const [partyName, setPartyName] = useState('');
  const [searchBy, setSearchBy] = useState('id');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/parties').then(setParties).catch(() => {});
  }, []);

  const search = async () => {
    setError('');
    setList([]);
    setLoaded(false);
    if (searchBy === 'id' && !partyId) {
      setError('Select a party');
      return;
    }
    if (searchBy === 'name' && !partyName.trim()) {
      setError('Enter party name');
      return;
    }
    setLoading(true);
    try {
      const q = searchBy === 'id'
        ? `partyId=${encodeURIComponent(partyId)}`
        : `partyName=${encodeURIComponent(partyName.trim())}`;
      const data = await api.get(`/api/challans/search-by-party?${q}`);
      setList(data);
      setLoaded(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Search Challan by Party</h1>
      </div>
      <div className="card animate-fade-in-up" style={{ maxWidth: '560px' }}>
        <div className="input-group">
          <label>Search by</label>
          <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
            <option value="id">Select Party</option>
            <option value="name">Party Name (text)</option>
          </select>
        </div>
        {searchBy === 'id' && (
          <div className="input-group">
            <label>Party</label>
            <select value={partyId} onChange={(e) => setPartyId(e.target.value)}>
              <option value="">— Select —</option>
              {parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        )}
        {searchBy === 'name' && (
          <div className="input-group">
            <label>Party Name</label>
            <input value={partyName} onChange={(e) => setPartyName(e.target.value)} placeholder="Type party name" />
          </div>
        )}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button type="button" className="btn btn-primary" onClick={search} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && <p className="error-msg">{error}</p>}
      </div>

      {loaded && (
        <div className="card animate-fade-in-up">
          <h2>Challans ({list.length})</h2>
          {list.length === 0 ? (
            <p className="empty-state">No challans found for this party.</p>
          ) : (
            <>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Challan No</th>
                      <th>Party</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((c) => (
                      <tr key={c.id}>
                        <td>{c.challan_number}</td>
                        <td>{c.party_name || '—'}</td>
                        <td>{c.date || '—'}</td>
                        <td>₹{Number(c.amount || 0).toLocaleString()}</td>
                        <td>{c.description || '—'}</td>
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
                    <div className="detail-row"><span>Amount</span><span>₹{Number(c.amount || 0).toLocaleString()}</span></div>
                    <div className="detail-row"><span>Description</span><span>{c.description || '—'}</span></div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
