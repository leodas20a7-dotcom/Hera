import React, { useState, useEffect, useRef } from 'react';

const ROWS_PER_PAGE = 25; // Matches SSK.pdf: 25 rows on Page 1 (ending at LONGAN DOUBLE GOLD), rest on Page 2
const A4_PREVIEW_WIDTH = 794; // Standard A4 width at 96 DPI

export function KernStockSummaryReport({ stocks, logistics, partyName, asOnDate, onDownloadPdf }) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [viewMode, setViewMode] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768 ? 'summary' : 'pdf'
  );
  const [pdfScale, setPdfScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(null);
  const previewWrapRef = useRef(null);
  const sheetRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const mobileNow = window.innerWidth < 768;
      setIsMobile(mobileNow);
      if (previewWrapRef.current && sheetRef.current) {
        const availWidth = previewWrapRef.current.clientWidth;
        if (availWidth > 0 && availWidth < A4_PREVIEW_WIDTH) {
          const nextScale = Math.max(0.35, availWidth / A4_PREVIEW_WIDTH);
          setPdfScale(nextScale);
          setScaledHeight(sheetRef.current.scrollHeight * nextScale);
        } else {
          setPdfScale(1);
          setScaledHeight(null);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode, stocks]);

  // 1. Group stocks by GRN number while preserving order
  const grnGroups = [];
  const groupMap = new Map();

  (stocks || []).forEach((item) => {
    const grnKey = item.grnNo || 'GRN/UNASSIGNED';
    if (!groupMap.has(grnKey)) {
      const group = {
        grnNo: grnKey,
        inDate: item.inDate || '',
        items: [],
        subtotal: 0
      };
      groupMap.set(grnKey, group);
      grnGroups.push(group);
    }
    const group = groupMap.get(grnKey);
    group.items.push(item);
    group.subtotal += Number(item.qty) || 0;
  });

  grnGroups.sort((a, b) => (a.grnNo || '').localeCompare(b.grnNo || ''));

  const grandTotal = grnGroups.reduce((sum, g) => sum + g.subtotal, 0);

  const formatQty = (val) => {
    const num = Number(val) || 0;
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // 2. Flatten into renderable rows so we can paginate across A4 pages with repeated headers
  const flatRows = [];
  grnGroups.forEach((group) => {
    flatRows.push({ type: 'grnHeader', grnNo: group.grnNo, inDate: group.inDate });
    group.items.forEach((item, idx) => {
      flatRows.push({ type: 'item', item, key: item.id || `${group.grnNo}-${idx}` });
    });
    flatRows.push({ type: 'subtotal', grnNo: group.grnNo, subtotal: group.subtotal });
  });

  // 3. Split flatRows into pages (avoiding orphaned GRN headers at bottom or orphaned subtotals at top)
  const pages = [];
  if (flatRows.length === 0) {
    pages.push([]);
  } else {
    let i = 0;
    while (i < flatRows.length) {
      let end = Math.min(i + ROWS_PER_PAGE, flatRows.length);
      if (end < flatRows.length) {
        if (flatRows[end - 1]?.type === 'grnHeader') {
          end -= 1;
        } else if (flatRows[end]?.type === 'subtotal') {
          end -= 1;
        }
      }
      pages.push(flatRows.slice(i, end));
      i = end;
    }
  }

  const totalPages = pages.length;

  return (
    <div style={{ paddingBottom: isMobile ? '88px' : '0' }}>
      {/* Mobile Only: 2 Side-by-Side Buttons (Summary View / PDF Preview toggle + Download PDF) */}
      {isMobile && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '12px'
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'summary' ? 'pdf' : 'summary')}
            style={{
              border: '1.5px solid #CBD5E1',
              padding: '10px 12px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              background: '#FFFFFF',
              color: '#0F172A',
              boxShadow: '0 1px 3px rgba(15,23,42,0.06)'
            }}
          >
            {viewMode === 'summary' ? '📄 PDF Preview' : '📱 Summary View'}
          </button>
          <button
            type="button"
            className="doc-download-btn"
            onClick={onDownloadPdf}
            style={{ width: '100%', justifyContent: 'center', margin: 0 }}
          >
            Download PDF
          </button>
        </div>
      )}

      {/* OPTION 2A: CLEAN MOBILE CARD SUMMARY VIEW */}
      {viewMode === 'summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Summary Header Card */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              padding: '12px 14px',
              boxShadow: '0 2px 8px rgba(15,23,42,0.04)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <img
                src={logistics.logo}
                alt={logistics.legalName}
                style={{ width: '90px', height: 'auto', display: 'block' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0F172A' }}>
                  {logistics.legalName}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '600' }}>
                  {logistics.hubLabel} • {asOnDate}
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#F8FAFC',
                borderRadius: '10px',
                padding: '8px 10px',
                gap: '8px',
                flexWrap: 'wrap'
              }}
            >
              <div>
                <div style={{ fontSize: '0.66rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>
                  Party
                </div>
                <div style={{ fontSize: '0.80rem', fontWeight: '800', color: '#0F172A' }}>
                  {partyName}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.66rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>
                  Closing Qty ({grnGroups.length} GRNs)
                </div>
                <div style={{ fontSize: '1rem', fontWeight: '900', color: '#0F766E' }}>
                  {grandTotal.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Per-GRN Cards */}
          {grnGroups.length === 0 ? (
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '24px',
                textAlign: 'center',
                color: '#64748B',
                fontSize: '0.85rem'
              }}
            >
              No stock records found.
            </div>
          ) : (
            grnGroups.map((group) => (
              <div
                key={group.grnNo}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(15,23,42,0.03)'
                }}
              >
                {/* GRN Card Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#F1F5F9',
                    padding: '9px 12px',
                    borderBottom: '1px solid #E2E8F0'
                  }}
                >
                  <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0F172A', fontFamily: 'monospace' }}>
                    {group.grnNo}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      color: '#334155',
                      background: '#FFFFFF',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      border: '1px solid #CBD5E1'
                    }}
                  >
                    {group.inDate}
                  </span>
                </div>

                {/* GRN Items */}
                <div style={{ padding: '4px 12px' }}>
                  {group.items.map((item, idx) => (
                    <div
                      key={item.id || `${group.grnNo}-${idx}`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 0',
                        borderBottom: idx === group.items.length - 1 ? 'none' : '1px dashed #E2E8F0'
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0F172A' }}>
                          {item.product}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '2px', lineHeight: '1.35' }}>
                          {[item.brand, item.variety, item.lotNo ? `Lot ${item.lotNo}` : '', item.subUom]
                            .filter(Boolean)
                            .join(' • ')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#0F766E' }}>
                          {formatQty(item.qty)}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: '700' }}>
                          {item.unit || 'BOX'} • {item.rateType || 'Weekly'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* GRN Subtotal Footer */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#F8FAFC',
                    padding: '7px 12px',
                    borderTop: '1px solid #E2E8F0',
                    fontSize: '0.76rem',
                    fontWeight: '800',
                    color: '#0F172A'
                  }}
                >
                  <span>GRN Subtotal</span>
                  <span>{formatQty(group.subtotal)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* OPTION 2B: EXACT A4 PDF SHEET (Auto-scaled on mobile PDF Preview, or off-screen for Download PDF) */}
      <div
        ref={previewWrapRef}
        style={
          viewMode === 'summary'
            ? { position: 'fixed', left: '-9999px', top: 0, width: `${A4_PREVIEW_WIDTH}px`, pointerEvents: 'none' }
            : {
                width: '100%',
                overflow: 'hidden',
                height: pdfScale < 1 && scaledHeight ? `${scaledHeight + 8}px` : 'auto'
              }
        }
      >
        <div
          id="monthly-stock-report-sheet"
          ref={sheetRef}
          style={{
            background: '#ffffff',
            width: viewMode === 'pdf' && pdfScale < 1 ? `${A4_PREVIEW_WIDTH}px` : '100%',
            transform: viewMode === 'pdf' && pdfScale < 1 ? `scale(${pdfScale})` : 'none',
            transformOrigin: 'top left'
          }}
        >
          {pages.map((pageRows, pageIdx) => {
            const isLastPage = pageIdx === totalPages - 1;
            return (
              <div
                key={pageIdx}
                style={{
                  background: '#ffffff',
                  color: '#000000',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  marginBottom: isLastPage ? '0' : '16px',
                  minHeight: '266mm',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  pageBreakAfter: isLastPage ? 'auto' : 'always',
                  breakAfter: isLastPage ? 'auto' : 'page'
                }}
              >
                {/* Outer Bordered Box (Hugs table on last page just like SSK.pdf) */}
                <div
                  className="official-report-sheet kern-stock-summary-sheet"
                  style={{
                    background: '#ffffff',
                    padding: '10px 12px',
                    border: '1.5px solid #1e293b',
                    borderRadius: '4px'
                  }}
                >
                  {/* Top Header: Logo Left, Wide Space, Company Details Right (Matches SSK.pdf) */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '32px',
                      paddingBottom: '6px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ flex: '0 0 auto' }}>
                      <img
                        src={logistics.logo}
                        alt={logistics.legalName}
                        style={{ width: '150px', height: 'auto', display: 'block' }}
                      />
                    </div>

                    <div
                      style={{
                        flex: '0 1 52%',
                        marginLeft: 'auto',
                        fontSize: '0.72rem',
                        lineHeight: '1.32',
                        color: '#000000',
                        fontWeight: '700'
                      }}
                    >
                      <div style={{ fontSize: '0.80rem', fontWeight: '800', marginBottom: '1px' }}>
                        {logistics.legalName}
                      </div>
                      {logistics.addressLines?.map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                      <div>Contact : {logistics.phone}</div>
                      <div>E-Mail: {logistics.email}</div>
                      <div>Website: {logistics.website}</div>
                    </div>
                  </div>

                  {/* Grey STOCK SUMMARY Banner */}
                  <div
                    style={{
                      background: '#C9CDD3',
                      textAlign: 'center',
                      fontWeight: '800',
                      fontSize: '0.82rem',
                      padding: '3.5px 8px',
                      letterSpacing: '0.4px',
                      marginBottom: '5px'
                    }}
                  >
                    STOCK SUMMARY
                  </div>

                  {/* Party & As On Date Row */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.73rem',
                      fontWeight: '800',
                      padding: '2px 4px 5px',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    <div>Party : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {partyName}</div>
                    <div>As On Date : &nbsp; {asOnDate}</div>
                  </div>

                  {/* Stock Summary Table */}
                  <div style={{ overflowX: 'auto' }}>
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '0.67rem',
                        color: '#000000'
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            borderTop: '1.5px solid #000000',
                            borderBottom: '1.5px solid #000000',
                            background: '#FFFFFF'
                          }}
                        >
                          <th style={{ textAlign: 'left', padding: '4px 4px', fontWeight: '800' }}>ProductName</th>
                          <th style={{ textAlign: 'left', padding: '4px 4px', fontWeight: '800' }}>Brand</th>
                          <th style={{ textAlign: 'left', padding: '4px 4px', fontWeight: '800' }}>Varity</th>
                          <th style={{ textAlign: 'left', padding: '4px 4px', fontWeight: '800' }}>LotNo</th>
                          <th style={{ textAlign: 'left', padding: '4px 4px', fontWeight: '800' }}>RateType</th>
                          <th style={{ textAlign: 'left', padding: '4px 4px', fontWeight: '800' }}>UOM</th>
                          <th style={{ textAlign: 'left', padding: '4px 4px', fontWeight: '800' }}>SubUom</th>
                          <th style={{ textAlign: 'right', padding: '4px 4px', fontWeight: '800' }}>ClosingQty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageRows.length === 0 ? (
                          <tr>
                            <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>
                              No stock records found.
                            </td>
                          </tr>
                        ) : (
                          pageRows.map((row, rIdx) => {
                            if (row.type === 'grnHeader') {
                              return (
                                <tr
                                  key={`hdr-${row.grnNo}-${rIdx}`}
                                  style={{ background: '#E2E4E8' }}
                                >
                                  <td
                                    colSpan={6}
                                    style={{
                                      padding: '3.5px 4px',
                                      fontWeight: '800',
                                      fontSize: '0.68rem'
                                    }}
                                  >
                                    {row.grnNo}
                                  </td>
                                  <td
                                    colSpan={2}
                                    style={{
                                      padding: '3.5px 4px',
                                      fontWeight: '800',
                                      fontSize: '0.68rem',
                                      textAlign: 'right'
                                    }}
                                  >
                                    {row.inDate}
                                  </td>
                                </tr>
                              );
                            }

                            if (row.type === 'subtotal') {
                              return (
                                <tr key={`sub-${row.grnNo}-${rIdx}`}>
                                  <td
                                    colSpan={8}
                                    style={{
                                      padding: '3.5px 4px',
                                      textAlign: 'right',
                                      fontWeight: '800',
                                      borderTop: '1px solid #000000',
                                      borderBottom: '1.5px solid #000000',
                                      fontVariantNumeric: 'tabular-nums'
                                    }}
                                  >
                                    {formatQty(row.subtotal)}
                                  </td>
                                </tr>
                              );
                            }

                            const item = row.item;
                            return (
                              <tr
                                key={row.key}
                                style={{ borderBottom: '1px dotted #475569' }}
                              >
                                <td style={{ padding: '3px 4px' }}>{item.product}</td>
                                <td style={{ padding: '3px 4px' }}>{item.brand}</td>
                                <td style={{ padding: '3px 4px' }}>{item.variety}</td>
                                <td style={{ padding: '3px 4px' }}>{item.lotNo}</td>
                                <td style={{ padding: '3px 4px' }}>{item.rateType || 'Weekly'}</td>
                                <td style={{ padding: '3px 4px' }}>{item.unit || 'BOX'}</td>
                                <td style={{ padding: '3px 4px' }}>{item.subUom || ''}</td>
                                <td style={{ padding: '3px 4px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                                  {formatQty(item.qty)}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                      {isLastPage && (
                        <tfoot>
                          <tr
                            style={{
                              borderTop: '2px double #000000',
                              borderBottom: '1px solid #000000'
                            }}
                          >
                            <td colSpan={6} style={{ padding: '5px 4px' }}></td>
                            <td style={{ padding: '5px 4px', fontWeight: '800', textAlign: 'left' }}>Total Qty</td>
                            <td
                              style={{
                                padding: '5px 4px',
                                fontWeight: '800',
                                textAlign: 'right',
                                fontVariantNumeric: 'tabular-nums'
                              }}
                            >
                              {Number.isInteger(grandTotal) ? grandTotal : formatQty(grandTotal)}
                            </td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                </div>

                {/* Page Footer Outside Box (Matches SSK.pdf: dotted rule + Page X of Y) */}
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
                  Page {pageIdx + 1} of {totalPages}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
