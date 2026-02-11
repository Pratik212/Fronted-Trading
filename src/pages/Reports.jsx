import { useState, useEffect } from 'react';
import { api } from '../api';

function ReportCard({ title, children, className = '' }) {
  return (
    <div className={`card report-card animate-fade-in-up ${className}`}>
      <h2 className="report-card-title">{title}</h2>
      {children}
    </div>
  );
}

function PartWiseTable({ rows, emptyMsg }) {
  if (!rows || rows.length === 0) {
    return <p className="empty-state">{emptyMsg}</p>;
  }
  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Party</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.party_id}>
              <td>{r.party_name}</td>
              <td>₹{Number(r.total_payment || r.outstanding || 0).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Reports() {
  const [lastMonth, setLastMonth] = useState([]);
  const [currentMonth, setCurrentMonth] = useState([]);
  const [outstanding, setOutstanding] = useState([]);
  const [totalIncoming, setTotalIncoming] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [last, current, out, incoming] = await Promise.all([
        api.get('/api/reports/last-month-payments'),
        api.get('/api/reports/current-month-payments'),
        api.get('/api/reports/outstanding'),
        api.get('/api/reports/total-incoming'),
      ]);
      setLastMonth(last);
      setCurrentMonth(current);
      setOutstanding(out);
      setTotalIncoming(incoming.total_incoming);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const totalOutstanding = outstanding.reduce((s, r) => s + Number(r.outstanding || 0), 0);
  const lastMonthTotal = lastMonth.reduce((s, r) => s + Number(r.total_payment || 0), 0);
  const currentMonthTotal = currentMonth.reduce((s, r) => s + Number(r.total_payment || 0), 0);

  if (loading) {
    return (
        <>
          <div className="page-header">
            <h1>Reports</h1>
          </div>
          <div className="card">
            <div className="empty-state">
              <div className="skeleton" style={{height: 24, width: '50%', margin: '0 auto'}}/>
            </div>
          </div>
        </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>Reports</h1>
        <button type="button" className="btn btn-secondary" onClick={load}>Refresh</button>
      </div>
      {error && <p className="error-msg">{error}</p>}

      <div className="reports-summary">
        <div className="summary-box summary-incoming">
          <span className="summary-label">Total Incoming (₹)</span>
          <span className="summary-value">₹{(totalIncoming ?? 0).toLocaleString()}</span>
        </div>
        <div className="summary-box summary-outstanding">
          <span className="summary-label">Total Outstanding (₹)</span>
          <span className="summary-value">₹{totalOutstanding.toLocaleString()}</span>
        </div>
      </div>

      <ReportCard title="Last Month – Part-wise Payment (₹)">
        <PartWiseTable rows={lastMonth} emptyMsg="No payments in last month." />
        {lastMonth.length > 0 && (
          <p className="report-total">Total: ₹{lastMonthTotal.toLocaleString()}</p>
        )}
      </ReportCard>

      <ReportCard title="Current Month – Part-wise Payment (₹)">
        <PartWiseTable rows={currentMonth} emptyMsg="No payments in current month yet." />
        {currentMonth.length > 0 && (
          <p className="report-total">Total: ₹{currentMonthTotal.toLocaleString()}</p>
        )}
      </ReportCard>

      <ReportCard title="Total Outstanding – Party-wise (₹)">
        {outstanding.length === 0 ? (
          <p className="empty-state">No outstanding. All challan amounts are covered by payments.</p>
        ) : (
          <>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Party</th>
                    <th>Challan Total (₹)</th>
                    <th>Paid (₹)</th>
                    <th>Outstanding (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {outstanding.map((r) => (
                    <tr key={r.party_id}>
                      <td>{r.party_name}</td>
                      <td>₹{Number(r.total_challan || 0).toLocaleString()}</td>
                      <td>₹{Number(r.total_paid || 0).toLocaleString()}</td>
                      <td><strong>₹{Number(r.outstanding || 0).toLocaleString()}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="report-total">Total Outstanding: ₹{totalOutstanding.toLocaleString()}</p>
          </>
        )}
      </ReportCard>

      <style>{`
        .reports-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .summary-box {
          padding: 1.25rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          background: var(--surface);
        }
        .summary-incoming { border-left: 4px solid var(--success); }
        .summary-outstanding { border-left: 4px solid var(--warning); }
        .summary-label { display: block; font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.35rem; }
        .summary-value { font-size: 1.5rem; font-weight: 700; }
        .report-card-title { margin-bottom: 1rem; font-size: 1.1rem; }
        .report-total { margin: 1rem 0 0; font-weight: 600; color: var(--text); }
      `}</style>
    </>
  );
}
