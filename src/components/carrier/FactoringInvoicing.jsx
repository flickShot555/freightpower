import React, { useCallback, useEffect, useMemo, useState } from 'react';
import '../../styles/carrier/FactoringInvoicing.css';
import { getFinanceForecast, getFinanceSummary, listInvoices } from '../../api/finance';

const FactoringInvoicing = () => {
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedFactoring, setSelectedFactoring] = useState('All Factoring');
  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [forecast, setForecast] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [invRes, sumRes, fcRes] = await Promise.all([
        listInvoices({ limit: 250 }),
        getFinanceSummary(),
        getFinanceForecast({ rangeDays: 30 }),
      ]);
      setInvoices(invRes?.invoices || []);
      setSummary(sumRes || null);
      setForecast(fcRes || null);
    } catch (e) {
      setError(e?.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const rows = useMemo(() => {
    return (invoices || []).map((inv) => {
      const invoiceNumber = inv.invoice_number || inv.invoice_id || '—';
      const dueDate = inv.due_date ? new Date(inv.due_date * 1000).toLocaleDateString() : '—';
      const payerShort = inv.payer_uid ? `${String(inv.payer_uid).slice(0, 8)}…` : '—';

      return {
        id: invoiceNumber,
        invoiceId: inv.invoice_id,
        loadId: inv.load_id || '—',
        customer: inv.payer_role ? `${inv.payer_role} (${payerShort})` : payerShort,
        amount: Number(inv.amount_total || 0),
        dueDate,
        status: String(inv.status || 'unknown').toLowerCase(),
        factoring: inv.factoring_enabled ? 'yes' : 'no',
      };
    });
  }, [invoices]);

  const filteredInvoices = rows.filter(invoice => {
    const matchesSearch = invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.loadId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All Status' || invoice.status === selectedStatus.toLowerCase();
    const matchesFactoring = selectedFactoring === 'All Factoring' || 
                           (selectedFactoring === 'Yes' && invoice.factoring === 'yes') ||
                           (selectedFactoring === 'No' && invoice.factoring === 'no');
    
    return matchesSearch && matchesStatus && matchesFactoring;
  });

  const getTotalAmount = () => {
    return filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'green';
      case 'sent': return 'yellow';
      case 'overdue': return 'red';
      default: return 'gray';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="factoring-invoicing">
      {/* Header Section */}
      <div className="factoring-header">
        <div className="factoring-header-content">
          <h1>Factoring & Invoicing</h1>
          <p className="factoring-subtitle">Manage invoices, payments, and factoring operations</p>
        </div>
        <div className="factoring-actions">
          <button className="btn small ghost-cd">
            <i className="fas fa-download"></i>
            Export
          </button>
          <button className="btn small-cd">
            <i className="fas fa-plus"></i>
            Create Invoice
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 10, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="factoring-metrics">
        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-file-invoice-dollar"></i>
          </div>
          <div className="metric-content">
            <div className="metric-number">{formatCurrency(summary?.outstanding_amount || 0)}</div>
            <div className="metric-label">Outstanding Invoices</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-bolt"></i>
          </div>
          <div className="metric-content">
            <div className="metric-number">{formatCurrency(summary?.factoring_outstanding_amount || 0)}</div>
            <div className="metric-label">Factoring Advances</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="metric-content">
            <div className="metric-number">{formatCurrency(summary?.paid_amount_30d || 0)}</div>
            <div className="metric-label">This Month Paid</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="metric-content">
            <div className="metric-number">{formatCurrency(getTotalAmount())}</div>
            <div className="metric-label">Visible Total</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="factoring-controls">
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search invoices..."
            className="factoring-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="factoring-filters-container">
          <select 
            className="filter-selected"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Paid</option>
            <option>Sent</option>
            <option>Overdue</option>
          </select>
          <select 
            className="filter-selected"
            value={selectedFactoring}
            onChange={(e) => setSelectedFactoring(e.target.value)}
          >
            <option>All Factoring</option>
            <option>Yes</option>
            <option>No</option>
          </select>
          <button className="btn-filter">
            <i className="fas fa-filter"></i>
          </button>
          <button className="btn-refresh" onClick={refresh} disabled={loading}>
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>

      {loading && (
        <div style={{ padding: 12, color: '#64748b' }}>Loading invoices…</div>
      )}

      {/* Invoices Table */}
      <div className="invoices-table-container">
        <table className="invoices-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" className="select-all-checkbox" />
              </th>
              <th>Invoice #</th>
              <th>Load ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Factoring</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>
                  <input type="checkbox" className="row-checkbox" />
                </td>
                <td className="invoice-id">{invoice.id}</td>
                <td className="load-id">{invoice.loadId}</td>
                <td className="customer-name">{invoice.customer}</td>
                <td className="amount">{formatCurrency(invoice.amount)}</td>
                <td className="due-date">{invoice.dueDate}</td>
                <td>
                  <span className={`cd-in-status-badge ${getStatusColor(invoice.status)}`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </td>
                <td>
                  <span className={`factoring-badge ${invoice.factoring === 'yes' ? 'yes' : 'no'}`}>
                    {invoice.factoring === 'yes' ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="actions">
                  <button className="btn-action view" title="View">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="btn-action edit" title="Edit">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="btn-action download" title="Download">
                    <i className="fas fa-download"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="table-footer">
        <div className="table-info">
          <span>Showing 1-3 of {filteredInvoices.length} invoices</span>
        </div>
        <div className="pagination">
          <button className="btn-page prev" disabled>Pre</button>
          <button className="btn-page active">1</button>
          <button className="btn-page">2</button>
          <button className="btn-page next">Next</button>
        </div>
      </div>

      {/* Cash Forecast Section */}
      <div className="cash-forecast">
        <h3>Cash Forecast - Next 30 Days</h3>
        <div className="forecast-metrics">
          <div className="forecast-item">
            <div className="forecast-label">Expected Direct Payments</div>
            <div className="forecast-amount green">{formatCurrency(forecast?.expected_direct_payments || 0)}</div>
          </div>
          <div className="forecast-item">
            <div className="forecast-label">Factoring Advances</div>
            <div className="forecast-amount blue">{formatCurrency(forecast?.expected_factoring_advances || 0)}</div>
          </div>
          <div className="forecast-item">
            <div className="forecast-label">Overdue Collections</div>
            <div className="forecast-amount red">{formatCurrency(forecast?.overdue_collections || 0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactoringInvoicing;