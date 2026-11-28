import React, { useMemo, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';

const LEDGER_ROWS_PER_PAGE = 26;
const A4_WIDTH_PX = 794;

const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
};

const toIsoDate = (dateStr) => {
  if (!dateStr) return '';
  const s = String(dateStr).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{1,2})[-/\s]([A-Za-z]{3})[-/\s](\d{2,4})$/);
  if (m) {
    const day = m[1].padStart(2, '0');
    const mon = MONTHS[m[2].toLowerCase()];
    const yr = m[3].length === 2 ? `20${m[3]}` : m[3];
    if (mon !== undefined) {
      return `${yr}-${String(mon + 1).padStart(2, '0')}-${day}`;
    }
  }
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10);
  }
  return '';
};

const csvEscape = (val) => {
  const s = String(val ?? '');
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
};

export function AdminStockLedgerPanel({ stocks, inwardRequests, challanHistory, logistics }) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [movementFilter, setMovementFilter] = useState('ALL'); // 'ALL' | 'IN' | 'OUT'
  const [productFilter, setProductFilter] = useState('ALL');
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState('detailed'); // 'detailed' | 'closing'
  const [hideZeroStock, setHideZeroStock] = useState(true);
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const pdfSheetRef = useRef(null);

  const allLedgerRows = useMemo(() => {
    const rows = [];
    const defaultUnit = logistics?.id === 'kern' ? 'BOX' : 'BAGS';

    (inwardRequests || []).forEach((req, idx) => {
      if (req.status === 'PENDING') return;
      const qty = Number(req.qty) || 0;
      rows.push({
        id: `inw-${req.id || idx}`,
        txDate: req.expectedDate || '',
        isoDate: toIsoDate(req.expectedDate),
        movement: 'IN',
        movementGroup: 'IN',
        grnNo: req.grnNo || '',
        voucherNo: req.inwardNo || '',
        party: req.clientName || '',
        product: req.product || '',
        brand: req.brand || '',
        variety: req.variety || '',
        lotNo: req.docNo || '',
        rateType: logistics?.id === 'kern' ? 'Weekly' : 'Daily',
        unit: req.unit || defaultUnit,
        subUom: '',
        inQty: qty,
        outQty: 0
      });
    });

    (stocks || []).forEach((s, idx) => {
      const qty = Number(s.qty) || 0;
      rows.push({
        id: `stk-${s.id || idx}`,
        txDate: s.inDate || '',
        isoDate: toIsoDate(s.inDate),
        movement: 'IN (STOCK)',
        movementGroup: 'IN',
        grnNo: s.grnNo || '',
        voucherNo: s.docNo || '',
        party: s.clientName || '',
        product: s.product || '',
        brand: s.brand || '',
        variety: s.variety || '',
        lotNo: s.lotNo || '',
        rateType: s.rateType || (logistics?.id === 'kern' ? 'Weekly' : 'Daily'),
        unit: s.unit || defaultUnit,
        subUom: s.subUom || '',
        inQty: qty,
        outQty: 0
      });
    });

    (challanHistory || []).forEach((note, nIdx) => {
      const items = note.items && note.items.length > 0
        ? note.items
        : [{ product: 'Dispatch', dispatchedQty: note.totalQty || 0, unit: 'BOX' }];
      items.forEach((it, iIdx) => {
        const qty = Number(it.dispatchedQty) || 0;
        rows.push({
          id: `out-${note.id || nIdx}-${iIdx}`,
          txDate: note.dcDate || '',
          isoDate: toIsoDate(note.dcDate),
          movement: 'OUT',
          movementGroup: 'OUT',
          grnNo: it.grnNo || '',
          voucherNo: note.dcNo || '',
          party: note.customerName || '',
          product: it.product || '',
          brand: it.brand || '',
          variety: it.variety || '',
          lotNo: it.lotNo || '',
          rateType: it.rateType || '',
          unit: it.unit || defaultUnit,
          subUom: it.count || '',
          inQty: 0,
          outQty: qty
        });
      });
    });

    rows.sort((a, b) =>
      (a.isoDate || '9999-99-99').localeCompare(b.isoDate || '9999-99-99') ||
      a.movementGroup.localeCompare(b.movementGroup) ||
      (a.grnNo || '').localeCompare(b.grnNo || '') ||
      (a.voucherNo || '').localeCompare(b.voucherNo || '')
    );

    return rows;
  }, [stocks, inwardRequests, challanHistory, logistics?.id]);

  const productOptions = useMemo(() => {
    const set = new Set();
    allLedgerRows.forEach((r) => {
      if (r.product) set.add(r.product);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allLedgerRows]);

  const { filteredRows, totalIn, totalOut, netClosing } = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    const matched = allLedgerRows.filter((r) => {
      if (fromDate && (!r.isoDate || r.isoDate < fromDate)) return false;
      if (toDate && (!r.isoDate || r.isoDate > toDate)) return false;
      if (movementFilter !== 'ALL' && r.movementGroup !== movementFilter) return false;
      if (productFilter !== 'ALL' && r.product !== productFilter) return false;
      if (q) {
        const hay = `${r.grnNo} ${r.voucherNo} ${r.party} ${r.product} ${r.brand} ${r.variety} ${r.lotNo} ${r.subUom}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    let running = 0;
    let inSum = 0;
    let outSum = 0;
    const withBalance = matched.map((r) => {
      inSum += r.inQty;
      outSum += r.outQty;
      running += r.inQty - r.outQty;
      return { ...r, runningBalance: running };
    });

    return {
      filteredRows: withBalance,
      totalIn: inSum,
      totalOut: outSum,
      netClosing: inSum - outSum
    };
  }, [allLedgerRows, fromDate, toDate, movementFilter, productFilter, searchText]);

  const closingSummaryRows = useMemo(() => {
    const map = new Map();
    filteredRows.forEach((r) => {
      const key = r.product || 'UNKNOWN';
      if (!map.has(key)) {
        map.set(key, {
          product: key,
          brand: r.brand || '',
          unit: r.unit || (logistics?.id === 'kern' ? 'BOX' : 'BAGS'),
          inQty: 0,
          outQty: 0,
          closingQty: 0
        });
      }
      const entry = map.get(key);
      if (!entry.brand && r.brand) entry.brand = r.brand;
      entry.inQty += r.inQty;
      entry.outQty += r.outQty;
      entry.closingQty = entry.inQty - entry.outQty;
    });
    const list = Array.from(map.values()).sort((a, b) => a.product.localeCompare(b.product));
    return hideZeroStock ? list.filter((row) => row.closingQty !== 0) : list;
  }, [filteredRows, hideZeroStock, logistics?.id]);

  const activeRowCount = viewMode === 'closing' ? closingSummaryRows.length : filteredRows.length;

  const applyPreset = (from, to) => {
    setFromDate(from);
    setToDate(to);
  };

  const resetFilters = () => {
    setFromDate('');
    setToDate('');
    setMovementFilter('ALL');
    setProductFilter('ALL');
    setSearchText('');
  };

  const handleDownloadExcel = () => {
    const lines = [];
    if (viewMode === 'closing') {
      lines.push(['Product', 'Brand', 'UOM', 'In Qty', 'Out Qty', 'Closing Stock'].map(csvEscape).join(','));
      closingSummaryRows.forEach((r) => {
        lines.push([r.product, r.brand, r.unit, r.inQty, r.outQty, r.closingQty].map(csvEscape).join(','));
      });
      lines.push(['TOTAL', `${closingSummaryRows.length} products`, '', totalIn, totalOut, netClosing].map(csvEscape).join(','));
    } else {
      const headers = [
        'Date', 'Movement', 'GRN No', 'Voucher / DC No', 'Party',
        'Product', 'Brand', 'Variety', 'Lot No', 'Rate Type',
        'UOM', 'Sub UOM', 'In Qty', 'Out Qty', 'Running Closing Qty'
      ];
      lines.push(headers.map(csvEscape).join(','));

      filteredRows.forEach((r) => {
        lines.push([
          r.txDate,
          r.movement,
          r.grnNo,
          r.voucherNo,
          r.party,
          r.product,
          r.brand,
          r.variety,
          r.lotNo,
          r.rateType,
          r.unit,
          r.subUom,
          r.inQty || '',
          r.outQty || '',
          r.runningBalance
        ].map(csvEscape).join(','));
      });

      lines.push([
        'TOTAL', '', '', '', `${filteredRows.length} records`,
        '', '', '', '', '', '', '',
        totalIn, totalOut, netClosing
      ].map(csvEscape).join(','));
    }

    const csvContent = '\uFEFF' + lines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const rangeTag = toDate ? `upto_${toDate}` : 'all';
    const typeTag = viewMode === 'closing' ? 'Closing_Stock' : 'Stock_Ledger';
    link.href = url;
    link.download = `${logistics?.pdfPrefix || 'Hera'}_${typeTag}_${rangeTag}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const pdfPages = useMemo(() => {
    const sourceRows = viewMode === 'closing' ? closingSummaryRows : filteredRows;
    if (sourceRows.length === 0) return [[]];
    const chunks = [];
    for (let i = 0; i < sourceRows.length; i += LEDGER_ROWS_PER_PAGE) {
      chunks.push(sourceRows.slice(i, i + LEDGER_ROWS_PER_PAGE));
    }
    return chunks;
  }, [viewMode, closingSummaryRows, filteredRows]);

  const handleDownloadPdf = () => {
    const element = pdfSheetRef.current;
    if (!element || activeRowCount === 0) return;
    setIsPdfDownloading(true);

    const rangeTag = toDate ? `upto_${toDate}` : 'all';
    const typeTag = viewMode === 'closing' ? 'Closing_Stock' : 'Stock_Ledger';
    const filename = `${logistics?.pdfPrefix || 'Hera'}_${typeTag}_${rangeTag}.pdf`;

    const opt = {
      margin: [6, 6, 6, 6],
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff',
        width: A4_WIDTH_PX,
        windowWidth: A4_WIDTH_PX,
        scrollY: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'], before: '.html2pdf__page-break' }
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => setIsPdfDownloading(false))
      .catch((err) => {
        console.warn('Ledger PDF save error:', err);
        setIsPdfDownloading(false);
      });
  };

  const periodLabel = fromDate || toDate
    ? `${fromDate || 'Start'} to ${toDate || 'Latest'}`
    : 'All Dates';
  const partyDisplay = stocks?.[0]?.clientName || 'LORDS AND KINGS ENTERPRISES';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Filters & Excel Export Card */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '14px',
          padding: '14px',
          boxShadow: '0 2px 8px rgba(15,23,42,0.04)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '12px'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: '700', color: '#475569', marginRight: '4px' }}>
              Quick Range:
            </span>
            {[
              { label: 'All', from: '', to: '' },
              { label: 'Up to 31-Oct', from: '', to: '2026-10-31' },
              { label: 'Sep 2026', from: '2026-09-01', to: '2026-09-30' },
              { label: 'Oct 2026', from: '2026-10-01', to: '2026-10-31' },
              { label: 'Nov 2026', from: '2026-11-01', to: '2026-11-30' }
            ].map((p) => {
              const isActive = fromDate === p.from && toDate === p.to;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p.from, p.to)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '999px',
                    border: isActive ? '1px solid #0F766E' : '1px solid #CBD5E1',
                    background: isActive ? '#0F766E' : '#F8FAFC',
                    color: isActive ? '#FFFFFF' : '#334155',
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={resetFilters}
              style={{
                padding: '7px 12px',
                borderRadius: '9px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#475569',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
            <button
              type="button"
              className="doc-download-btn"
              onClick={handleDownloadPdf}
              disabled={activeRowCount === 0 || isPdfDownloading}
              style={{ margin: 0, padding: '8px 14px', fontSize: '0.8rem', borderRadius: '9px', background: '#1E293B' }}
            >
              {isPdfDownloading ? '⏳ Generating...' : '📄 Download PDF'}
            </button>
            <button
              type="button"
              className="doc-download-btn"
              onClick={handleDownloadExcel}
              disabled={activeRowCount === 0}
              style={{ margin: 0, padding: '8px 14px', fontSize: '0.8rem', borderRadius: '9px' }}
            >
              📥 Download Excel ({activeRowCount})
            </button>
          </div>
        </div>

        {/* View Mode Switcher: Detailed Movements vs Closing Stock Only */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '12px',
            paddingBottom: '10px',
            borderBottom: '1px solid #F1F5F9'
          }}
        >
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setViewMode('detailed')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: viewMode === 'detailed' ? '1.5px solid #0F172A' : '1px solid #CBD5E1',
                background: viewMode === 'detailed' ? '#0F172A' : '#F8FAFC',
                color: viewMode === 'detailed' ? '#FFFFFF' : '#334155',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              📋 Detailed Movements ({filteredRows.length})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('closing')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: viewMode === 'closing' ? '1.5px solid #0F766E' : '1px solid #CBD5E1',
                background: viewMode === 'closing' ? '#0F766E' : '#F8FAFC',
                color: viewMode === 'closing' ? '#FFFFFF' : '#334155',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              📦 Closing Stock Only ({closingSummaryRows.length})
            </button>
          </div>

          {viewMode === 'closing' && (
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: '700', color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={hideZeroStock}
                onChange={(e) => setHideZeroStock(e.target.checked)}
              />
              Hide Zero Stock (0)
            </label>
          )}
        </div>

        {/* Filter Inputs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '10px'
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#64748B', marginBottom: '4px' }}>
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{ width: '100%', padding: '7px 9px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#64748B', marginBottom: '4px' }}>
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{ width: '100%', padding: '7px 9px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#64748B', marginBottom: '4px' }}>
              Movement
            </label>
            <select
              value={movementFilter}
              onChange={(e) => setMovementFilter(e.target.value)}
              style={{ width: '100%', padding: '7px 9px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', background: '#FFF' }}
            >
              <option value="ALL">All (In &amp; Out)</option>
              <option value="IN">Inward Only</option>
              <option value="OUT">Outward Only</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#64748B', marginBottom: '4px' }}>
              Product
            </label>
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              style={{ width: '100%', padding: '7px 9px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', background: '#FFF' }}
            >
              <option value="ALL">All Products</option>
              {productOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#64748B', marginBottom: '4px' }}>
              Search GRN / DC / Party / Lot
            </label>
            <input
              type="text"
              placeholder="e.g. 2188, LKE-F, QUACHA..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%', padding: '7px 9px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
            />
          </div>
        </div>

        {/* Summary KPI Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '8px',
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid #F1F5F9'
          }}
        >
          <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '8px 12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Records</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A' }}>{filteredRows.length.toLocaleString('en-IN')}</div>
          </div>
          <div style={{ background: '#ECFDF5', borderRadius: '10px', padding: '8px 12px', border: '1px solid #A7F3D0' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#047857', textTransform: 'uppercase' }}>Total Inward</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#047857' }}>{totalIn.toLocaleString('en-IN')}</div>
          </div>
          <div style={{ background: '#FEF2F2', borderRadius: '10px', padding: '8px 12px', border: '1px solid #FECACA' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#B91C1C', textTransform: 'uppercase' }}>Total Outward</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#B91C1C' }}>{totalOut.toLocaleString('en-IN')}</div>
          </div>
          <div style={{ background: '#F0FDFA', borderRadius: '10px', padding: '8px 12px', border: '1px solid #99F6E4' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#0F766E', textTransform: 'uppercase' }}>Closing (In − Out)</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F766E' }}>{netClosing.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Ledger Results */}
      <div className="table-card" style={{ padding: '12px' }}>
        {activeRowCount === 0 ? (
          <div className="empty-cart-card" style={{ margin: '12px 0' }}>
            <div className="empty-icon">📑</div>
            <h3>No Matching Records</h3>
            <p>Adjust your date range or filters to view stock movement.</p>
          </div>
        ) : viewMode === 'closing' ? (
          <>
            <div className="stocks-desktop-table" style={{ overflowX: 'auto' }}>
              <table className="stocks-table" style={{ fontSize: '0.84rem' }}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>UOM</th>
                    <th style={{ textAlign: 'right' }}>Total Inward</th>
                    <th style={{ textAlign: 'right' }}>Total Outward</th>
                    <th style={{ textAlign: 'right' }}>Closing Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {closingSummaryRows.map((r) => (
                    <tr key={r.product}>
                      <td><strong>{r.product}</strong></td>
                      <td>{r.brand || '—'}</td>
                      <td>{r.unit}</td>
                      <td style={{ textAlign: 'right', fontWeight: '700', color: '#047857' }}>
                        {r.inQty.toLocaleString('en-IN')}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '700', color: '#B91C1C' }}>
                        {r.outQty.toLocaleString('en-IN')}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '800', color: '#0F766E' }}>
                        {r.closingQty.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="stocks-mobile-cards">
              {closingSummaryRows.map((r) => (
                <div key={r.product} className="mobile-stock-card" style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0F172A' }}>{r.product}</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: '900', color: '#0F766E' }}>
                      {r.closingQty.toLocaleString('en-IN')} {r.unit}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>
                    <span>In: <strong style={{ color: '#047857' }}>{r.inQty.toLocaleString('en-IN')}</strong></span>
                    <span>Out: <strong style={{ color: '#B91C1C' }}>{r.outQty.toLocaleString('en-IN')}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="stocks-desktop-table" style={{ overflowX: 'auto' }}>
              <table className="stocks-table" style={{ fontSize: '0.8rem' }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>GRN / DC No.</th>
                    <th>Party</th>
                    <th>Product</th>
                    <th>Brand / Variety</th>
                    <th>Lot / Sub UOM</th>
                    <th style={{ textAlign: 'right' }}>In Qty</th>
                    <th style={{ textAlign: 'right' }}>Out Qty</th>
                    <th style={{ textAlign: 'right' }}>Closing</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((r) => (
                    <tr key={r.id}>
                      <td className="indate-cell">{r.txDate}</td>
                      <td>
                        <span
                          style={{
                            padding: '2px 7px',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            background: r.movementGroup === 'IN' ? '#DCFCE7' : '#FEE2E2',
                            color: r.movementGroup === 'IN' ? '#166534' : '#991B1B'
                          }}
                        >
                          {r.movement}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: '700' }}>{r.grnNo || r.voucherNo || '—'}</div>
                        {r.grnNo && r.voucherNo && <div className="grn-sub">{r.voucherNo}</div>}
                      </td>
                      <td>{r.party || '—'}</td>
                      <td><strong>{r.product}</strong></td>
                      <td>
                        <div>{r.brand || '—'}</div>
                        {r.variety && <div className="grn-sub">{r.variety}</div>}
                      </td>
                      <td>
                        <div>{r.lotNo || '—'}</div>
                        {r.subUom && <div className="grn-sub">{r.subUom}</div>}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '700', color: '#047857' }}>
                        {r.inQty ? r.inQty.toLocaleString('en-IN') : '—'}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '700', color: '#B91C1C' }}>
                        {r.outQty ? r.outQty.toLocaleString('en-IN') : '—'}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '800', color: '#0F172A' }}>
                        {r.runningBalance.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="stocks-mobile-cards">
              {filteredRows.map((r) => (
                <div key={r.id} className="mobile-stock-card" style={{ padding: '10px 12px' }}>
                  <div className="mobile-card-header" style={{ marginBottom: '6px' }}>
                    <div>
                      <span className="mobile-grn">{r.grnNo || r.voucherNo || '—'}</span>
                      <span className="mobile-date" style={{ marginLeft: '8px' }}>{r.txDate}</span>
                    </div>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        background: r.movementGroup === 'IN' ? '#DCFCE7' : '#FEE2E2',
                        color: r.movementGroup === 'IN' ? '#166534' : '#991B1B'
                      }}
                    >
                      {r.movement}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0F172A' }}>{r.product}</div>
                  <div style={{ fontSize: '0.73rem', color: '#64748B', marginBottom: '6px' }}>
                    {r.party || '—'}{r.lotNo ? ` • Lot ${r.lotNo}` : ''}{r.subUom ? ` • ${r.subUom}` : ''}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '700' }}>
                    <span style={{ color: r.movementGroup === 'IN' ? '#047857' : '#B91C1C' }}>
                      {r.movementGroup === 'IN' ? `+${r.inQty.toLocaleString('en-IN')} IN` : `−${r.outQty.toLocaleString('en-IN')} OUT`} {r.unit}
                    </span>
                    <span style={{ color: '#0F172A' }}>Bal: {r.runningBalance.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Off-screen Official Stock Summary Style PDF Sheet */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, width: `${A4_WIDTH_PX}px`, pointerEvents: 'none' }}>
        <div ref={pdfSheetRef} style={{ background: '#ffffff', width: `${A4_WIDTH_PX}px` }}>
          {pdfPages.map((pageRows, pageIdx) => {
            const isLastPage = pageIdx === pdfPages.length - 1;
            return (
              <React.Fragment key={pageIdx}>
                <div
                  style={{
                    background: '#ffffff',
                    color: '#000000',
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    minHeight: '260mm',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div
                    style={{
                      background: '#ffffff',
                      padding: '10px 12px',
                      border: '1.5px solid #1e293b',
                      borderRadius: '4px'
                    }}
                  >
                    {/* Header matching Stock Summary style */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '24px',
                        paddingBottom: '6px'
                      }}
                    >
                      <div style={{ flex: '0 0 auto' }}>
                        <img
                          src={logistics?.logo}
                          alt={logistics?.legalName || 'Logistics'}
                          style={{ width: '140px', height: 'auto', display: 'block' }}
                        />
                      </div>
                      <div style={{ flex: '0 1 56%', marginLeft: 'auto', fontSize: '0.70rem', lineHeight: '1.35', color: '#000000' }}>
                        <div style={{ fontWeight: '800', fontSize: '0.84rem', marginBottom: '2px' }}>
                          {logistics?.legalName}
                        </div>
                        {(logistics?.addressLines || [logistics?.address]).filter(Boolean).map((line, idx) => (
                          <div key={idx} style={{ fontWeight: '600' }}>{line}</div>
                        ))}
                        {logistics?.phone && <div style={{ fontWeight: '700' }}>Contact : {logistics.phone}</div>}
                        {logistics?.gstNo && <div style={{ fontWeight: '700' }}>GSTIN : {logistics.gstNo}</div>}
                        {logistics?.email && <div style={{ fontWeight: '700' }}>E-Mail : {logistics.email}</div>}
                        {logistics?.website && <div style={{ fontWeight: '700' }}>Website : {logistics.website}</div>}
                      </div>
                    </div>

                    {/* Title Bar */}
                    <div
                      style={{
                        background: '#CBD5E1',
                        textAlign: 'center',
                        fontWeight: '800',
                        fontSize: '0.86rem',
                        letterSpacing: '0.6px',
                        padding: '4px 0',
                        borderTop: '1px solid #475569',
                        borderBottom: '1px solid #475569',
                        marginTop: '4px',
                        color: '#000000'
                      }}
                    >
                      {viewMode === 'closing' ? 'CLOSING STOCK SUMMARY' : 'STOCK MOVEMENT LEDGER'}
                    </div>

                    {/* Party & Period Strip */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '6px 4px',
                        fontSize: '0.73rem',
                        fontWeight: '700',
                        borderBottom: '1.5px solid #000000',
                        gap: '12px'
                      }}
                    >
                      <div>
                        Party : <span style={{ marginLeft: '6px', fontWeight: '800' }}>{partyDisplay}</span>
                        {productFilter !== 'ALL' && (
                          <span style={{ marginLeft: '12px', fontWeight: '700' }}>• Product : {productFilter}</span>
                        )}
                      </div>
                      <div>
                        Period : <span style={{ marginLeft: '6px', fontWeight: '800' }}>{periodLabel}</span>
                      </div>
                    </div>

                    {/* Table */}
                    {viewMode === 'closing' ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem', color: '#000000' }}>
                        <thead>
                          <tr style={{ borderBottom: '1.5px solid #000000' }}>
                            <th style={{ textAlign: 'left', padding: '6px 4px', fontWeight: '800' }}>ProductName</th>
                            <th style={{ textAlign: 'left', padding: '6px 4px', fontWeight: '800' }}>Brand</th>
                            <th style={{ textAlign: 'left', padding: '6px 4px', fontWeight: '800' }}>UOM</th>
                            <th style={{ textAlign: 'right', padding: '6px 4px', fontWeight: '800' }}>In Qty</th>
                            <th style={{ textAlign: 'right', padding: '6px 4px', fontWeight: '800' }}>Out Qty</th>
                            <th style={{ textAlign: 'right', padding: '6px 4px', fontWeight: '800' }}>ClosingQty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pageRows.map((r) => (
                            <tr key={r.product} style={{ borderBottom: '1px dotted #94A3B8' }}>
                              <td style={{ padding: '5px 4px', fontWeight: '700' }}>{r.product}</td>
                              <td style={{ padding: '5px 4px' }}>{r.brand || '—'}</td>
                              <td style={{ padding: '5px 4px' }}>{r.unit}</td>
                              <td style={{ padding: '5px 4px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                                {r.inQty.toLocaleString('en-IN')}
                              </td>
                              <td style={{ padding: '5px 4px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                                {r.outQty.toLocaleString('en-IN')}
                              </td>
                              <td style={{ padding: '5px 4px', textAlign: 'right', fontWeight: '800', fontVariantNumeric: 'tabular-nums' }}>
                                {r.closingQty.toLocaleString('en-IN')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        {isLastPage && (
                          <tfoot>
                            <tr style={{ borderTop: '2px double #000000', borderBottom: '1.5px solid #000000' }}>
                              <td colSpan={3} style={{ padding: '6px 4px', fontWeight: '800', textAlign: 'right' }}>
                                Total ({closingSummaryRows.length} Products)
                              </td>
                              <td style={{ padding: '6px 4px', fontWeight: '800', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                                {totalIn.toLocaleString('en-IN')}
                              </td>
                              <td style={{ padding: '6px 4px', fontWeight: '800', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                                {totalOut.toLocaleString('en-IN')}
                              </td>
                              <td style={{ padding: '6px 4px', fontWeight: '800', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                                {netClosing.toLocaleString('en-IN')}
                              </td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.67rem', color: '#000000' }}>
                      <thead>
                        <tr style={{ borderBottom: '1.5px solid #000000' }}>
                          <th style={{ textAlign: 'left', padding: '5px 4px', fontWeight: '800' }}>Date</th>
                          <th style={{ textAlign: 'left', padding: '5px 4px', fontWeight: '800' }}>Type</th>
                          <th style={{ textAlign: 'left', padding: '5px 4px', fontWeight: '800' }}>GRN / DC No.</th>
                          <th style={{ textAlign: 'left', padding: '5px 4px', fontWeight: '800' }}>Product</th>
                          <th style={{ textAlign: 'left', padding: '5px 4px', fontWeight: '800' }}>Brand / Lot</th>
                          <th style={{ textAlign: 'left', padding: '5px 4px', fontWeight: '800' }}>SubUOM</th>
                          <th style={{ textAlign: 'right', padding: '5px 4px', fontWeight: '800' }}>In Qty</th>
                          <th style={{ textAlign: 'right', padding: '5px 4px', fontWeight: '800' }}>Out Qty</th>
                          <th style={{ textAlign: 'right', padding: '5px 4px', fontWeight: '800' }}>Closing</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageRows.map((r) => (
                          <tr key={r.id} style={{ borderBottom: '1px dotted #94A3B8' }}>
                            <td style={{ padding: '4px', whiteSpace: 'nowrap' }}>{r.txDate}</td>
                            <td style={{ padding: '4px', fontWeight: '700', whiteSpace: 'nowrap' }}>{r.movement}</td>
                            <td style={{ padding: '4px' }}>{r.grnNo || r.voucherNo || '—'}</td>
                            <td style={{ padding: '4px', fontWeight: '700' }}>{r.product}</td>
                            <td style={{ padding: '4px' }}>
                              {[r.brand, r.lotNo].filter(Boolean).join(' • ') || '—'}
                            </td>
                            <td style={{ padding: '4px' }}>{r.subUom || r.unit}</td>
                            <td style={{ padding: '4px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                              {r.inQty ? r.inQty.toLocaleString('en-IN') : ''}
                            </td>
                            <td style={{ padding: '4px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                              {r.outQty ? r.outQty.toLocaleString('en-IN') : ''}
                            </td>
                            <td style={{ padding: '4px', textAlign: 'right', fontWeight: '700', fontVariantNumeric: 'tabular-nums' }}>
                              {r.runningBalance.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {isLastPage && (
                        <tfoot>
                          <tr style={{ borderTop: '2px double #000000', borderBottom: '1.5px solid #000000' }}>
                            <td colSpan={6} style={{ padding: '5px 4px', fontWeight: '800', textAlign: 'right' }}>
                              Total ({filteredRows.length} Records)
                            </td>
                            <td style={{ padding: '5px 4px', fontWeight: '800', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                              {totalIn.toLocaleString('en-IN')}
                            </td>
                            <td style={{ padding: '5px 4px', fontWeight: '800', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                              {totalOut.toLocaleString('en-IN')}
                            </td>
                            <td style={{ padding: '5px 4px', fontWeight: '800', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                              {netClosing.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                    )}
                  </div>

                  {/* Page Footer */}
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: '0.70rem',
                      color: '#1e293b',
                      paddingTop: '6px',
                      borderTop: '1px dotted #475569',
                      marginTop: '8px'
                    }}
                  >
                    Page {pageIdx + 1} of {pdfPages.length}
                  </div>
                </div>
                {!isLastPage && (
                  <div
                    className="html2pdf__page-break"
                    style={{ pageBreakBefore: 'always', breakBefore: 'page', height: 0, margin: 0, padding: 0 }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
