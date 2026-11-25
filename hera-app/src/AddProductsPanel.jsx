import React, { useState } from 'react';

const todayFormatted = () =>
  new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');

const createEmptyRow = (logisticsId, prevRow = null) => ({
  id: Date.now() + Math.random(),
  grnNo: prevRow?.grnNo || `GRN/000${Math.floor(2400 + Math.random() * 500)}/26-27`,
  inDate: prevRow?.inDate || todayFormatted(),
  product: prevRow?.product || '',
  brand: prevRow?.brand || '',
  variety: prevRow?.variety || '',
  lotNo: prevRow?.lotNo || '',
  rateType: prevRow?.rateType || (logisticsId === 'kern' ? 'Weekly' : 'Daily'),
  unit: prevRow?.unit || (logisticsId === 'kern' ? 'BOX' : 'BAGS'),
  subUom: '',
  qty: ''
});

export function AddProductsPanel({ logisticsId, onSaveBulkProducts, onBack }) {
  const [entryMode, setEntryMode] = useState('rows'); // 'rows' | 'bulk'
  const [rows, setRows] = useState(() => [createEmptyRow(logisticsId)]);
  const [bulkText, setBulkText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleRowChange = (id, field, value) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleAddRow = () => {
    const last = rows[rows.length - 1];
    setRows((prev) => [...prev, createEmptyRow(logisticsId, last)]);
  };

  const handleRemoveRow = (id) => {
    if (rows.length === 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Parse pasted Excel (tab-separated) or CSV lines
  const parseBulkLines = (text) => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const parsed = [];
    lines.forEach((line) => {
      const delimiter = line.includes('\t') ? '\t' : ',';
      const cols = line.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ''));
      // Skip header row if detected
      if (cols[0]?.toLowerCase().includes('grn') && cols[2]?.toLowerCase().includes('product')) {
        return;
      }
      if (cols.length < 3) return;
      const qtyVal = parseFloat(cols[9] || cols[cols.length - 1]);
      if (!cols[2] || Number.isNaN(qtyVal) || qtyVal <= 0) return;

      parsed.push({
        grnNo: cols[0] || `GRN/000${Math.floor(2400 + Math.random() * 500)}/26-27`,
        inDate: cols[1] || todayFormatted(),
        product: cols[2],
        brand: cols[3] || '',
        variety: cols[4] || '',
        lotNo: cols[5] || '',
        rateType: cols[6] || (logisticsId === 'kern' ? 'Weekly' : 'Daily'),
        unit: cols[7] || (logisticsId === 'kern' ? 'BOX' : 'BAGS'),
        subUom: cols[8] || '',
        qty: qtyVal
      });
    });
    return parsed;
  };

  const parsedBulkRows = entryMode === 'bulk' ? parseBulkLines(bulkText) : [];

  const handleCsvUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBulkText(String(ev.target?.result || ''));
    };
    reader.readAsText(file);
  };

  const handleSubmitRows = async (e) => {
    e.preventDefault();
    const valid = rows.filter((r) => r.product.trim() && Number(r.qty) > 0);
    if (valid.length === 0) {
      alert('Please enter at least one Product Name and Closing Qty.');
      return;
    }
    setIsSaving(true);
    await onSaveBulkProducts(
      valid.map((r) => ({
        ...r,
        qty: parseFloat(r.qty)
      }))
    );
    setRows([createEmptyRow(logisticsId)]);
    setIsSaving(false);
  };

  const handleSubmitBulk = async () => {
    if (parsedBulkRows.length === 0) {
      alert('No valid rows found. Please paste Excel/CSV rows with Product and Closing Qty.');
      return;
    }
    setIsSaving(true);
    await onSaveBulkProducts(parsedBulkRows);
    setBulkText('');
    setIsSaving(false);
  };

  return (
    <div className="cart-page-screen tab-page-enter">
      <div className="cart-container">
        <div className="cart-white-card checkout-card">
          <div className="cart-header-row" style={{ flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2>Add Products</h2>
            </div>

            <div style={{ display: 'inline-flex', background: '#E2E8F0', padding: '3px', borderRadius: '10px', gap: '4px' }}>
              <button
                type="button"
                onClick={() => setEntryMode('rows')}
                style={{
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  background: entryMode === 'rows' ? '#FFFFFF' : 'transparent',
                  color: entryMode === 'rows' ? '#0F172A' : '#475569'
                }}
              >
                + Add / Multi-Row
              </button>
              <button
                type="button"
                onClick={() => setEntryMode('bulk')}
                style={{
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  background: entryMode === 'bulk' ? '#FFFFFF' : 'transparent',
                  color: entryMode === 'bulk' ? '#0F172A' : '#475569'
                }}
              >
                📋 Bulk Paste / CSV
              </button>
            </div>
          </div>

          {entryMode === 'rows' ? (
            <form onSubmit={handleSubmitRows} className="checkout-form">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {rows.map((row, idx) => (
                  <div
                    key={row.id}
                    style={{
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '14px',
                      padding: '14px',
                      background: '#F8FAFC'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <strong style={{ fontSize: '0.84rem', color: '#0F172A' }}>Product #{idx + 1}</strong>
                      {rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(row.id)}
                          style={{
                            border: '1px solid #FECACA',
                            background: '#FEF2F2',
                            color: '#B91C1C',
                            borderRadius: '8px',
                            padding: '4px 10px',
                            fontSize: '0.76rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="form-grid-two">
                      <div className="form-group">
                        <label>GRN No. <span className="req">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="GRN/0002383/26-27"
                          value={row.grnNo}
                          onChange={(e) => handleRowChange(row.id, 'grnNo', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>GRN Date <span className="req">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="25-Nov-2026"
                          value={row.inDate}
                          onChange={(e) => handleRowChange(row.id, 'inDate', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Product <span className="req">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. APPLE, SA MANDRINE, PLUMS-CHINA"
                          value={row.product}
                          onChange={(e) => handleRowChange(row.id, 'product', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Brand</label>
                        <input
                          type="text"
                          placeholder="e.g. PREMIUM APPLE, QUACHA"
                          value={row.brand}
                          onChange={(e) => handleRowChange(row.id, 'brand', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Variety</label>
                        <input
                          type="text"
                          placeholder="e.g. ROYAL, MANDRINE, PLUMS"
                          value={row.variety}
                          onChange={(e) => handleRowChange(row.id, 'variety', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Lot No</label>
                        <input
                          type="text"
                          placeholder="e.g. 9310871, CLASS-1"
                          value={row.lotNo}
                          onChange={(e) => handleRowChange(row.id, 'lotNo', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Rate Type</label>
                        <select
                          value={row.rateType}
                          onChange={(e) => handleRowChange(row.id, 'rateType', e.target.value)}
                        >
                          <option value="Weekly">Weekly</option>
                          <option value="Daily">Daily</option>
                          <option value="Monthly">Monthly</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>UOM &amp; Sub UOM</label>
                        <div className="two-inputs-row">
                          <select
                            value={row.unit}
                            onChange={(e) => handleRowChange(row.id, 'unit', e.target.value)}
                          >
                            <option value="BOX">BOX</option>
                            <option value="TRAY">TRAY</option>
                            <option value="BAGS">BAGS</option>
                            <option value="KG">KG</option>
                            <option value="MT">MT</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Sub UOM (e.g. C100, NO:1)"
                            value={row.subUom}
                            onChange={(e) => handleRowChange(row.id, 'subUom', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Closing Qty <span className="req">*</span></label>
                        <input
                          type="number"
                          required
                          min="0.01"
                          step="any"
                          placeholder="e.g. 200"
                          value={row.qty}
                          onChange={(e) => handleRowChange(row.id, 'qty', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={handleAddRow}
                  style={{
                    border: '1.5px dashed #0F766E',
                    background: '#F0FDFA',
                    color: '#0F766E',
                    padding: '9px 16px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  + Add Another Row
                </button>
              </div>

              <div className="form-bottom-actions">
                <button type="button" className="btn-hero-secondary" onClick={onBack}>
                  &larr; Back to Stock
                </button>
                <button type="submit" className="btn-submit-challan" disabled={isSaving}>
                  {isSaving ? 'Saving...' : `Save ${rows.length} Product${rows.length > 1 ? 's' : ''} →`}
                </button>
              </div>
            </form>
          ) : (
            <div className="checkout-form">
              <div className="form-group">
                <label>Upload CSV File or Paste Excel Rows</label>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 8px' }}>
                  Columns: <code>GRN No. | GRN Date | Product | Brand | Variety | Lot No | Rate Type | UOM | Sub UOM | Closing Qty</code>
                </p>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleCsvUpload}
                  style={{ marginBottom: '10px' }}
                />
                <textarea
                  rows={8}
                  placeholder={`GRN/0002383/26-27\t25-Nov-2026\tAPPLE\tPREMIUM APPLE\tROYAL\t9310871\tWeekly\tBOX\tC100\t44\nGRN/0002383/26-27\t25-Nov-2026\tAPPLE\tPREMIUM APPLE\tROYAL\t9310871\tWeekly\tBOX\tC113\t200`}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem'
                  }}
                />
              </div>

              {parsedBulkRows.length > 0 && (
                <div
                  style={{
                    background: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    color: '#065F46',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    marginTop: '10px'
                  }}
                >
                  Ready to import <strong>{parsedBulkRows.length}</strong> product rows (Total Qty:{' '}
                  <strong>{parsedBulkRows.reduce((s, r) => s + r.qty, 0).toLocaleString()}</strong>)
                </div>
              )}

              <div className="form-bottom-actions">
                <button type="button" className="btn-hero-secondary" onClick={onBack}>
                  &larr; Back to Stock
                </button>
                <button
                  type="button"
                  className="btn-submit-challan"
                  disabled={isSaving || parsedBulkRows.length === 0}
                  onClick={handleSubmitBulk}
                >
                  {isSaving ? 'Importing...' : `Import ${parsedBulkRows.length} Products →`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
