import React from 'react';

export function paginateList(items, page, pageSize) {
  const list = Array.isArray(items) ? items : [];
  const size = Math.max(1, Number(pageSize) || 20);
  const totalItems = list.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / size));
  const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const startIdx = (safePage - 1) * size;
  return {
    pagedItems: list.slice(startIdx, startIdx + size),
    safePage,
    totalPages,
    totalItems,
    startItem: totalItems === 0 ? 0 : startIdx + 1,
    endItem: Math.min(startIdx + size, totalItems)
  };
}

export function PaginationBar({
  totalItems,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange
}) {
  if (!totalItems || totalItems <= 10) return null;

  const size = Math.max(1, Number(pageSize) || 20);
  const totalPages = Math.max(1, Math.ceil(totalItems / size));
  const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const startItem = (safePage - 1) * size + 1;
  const endItem = Math.min(safePage * size, totalItems);

  const pageNumbers = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i += 1) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (safePage > 3) pageNumbers.push('...');
    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);
    for (let i = start; i <= end; i += 1) pageNumbers.push(i);
    if (safePage < totalPages - 2) pageNumbers.push('...');
    pageNumbers.push(totalPages);
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        padding: '12px 14px',
        marginTop: '12px',
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        fontSize: '0.8rem',
        color: '#475569'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span>
          Showing <strong>{startItem}–{endItem}</strong> of <strong>{totalItems.toLocaleString('en-IN')}</strong>
        </span>
        {onPageSizeChange && (
          <select
            value={size}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            aria-label="Rows per page"
            style={{
              padding: '4px 8px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: '700',
              color: '#334155'
            }}
          >
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => onPageChange(safePage - 1)}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              background: safePage <= 1 ? '#F1F5F9' : '#FFFFFF',
              color: safePage <= 1 ? '#94A3B8' : '#0F172A',
              fontWeight: '700',
              fontSize: '0.76rem',
              cursor: safePage <= 1 ? 'not-allowed' : 'pointer'
            }}
          >
            &larr; Prev
          </button>

          {pageNumbers.map((p, idx) =>
            p === '...' ? (
              <span key={`dots-${idx}`} style={{ padding: '0 4px', color: '#94A3B8' }}>…</span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                style={{
                  minWidth: '30px',
                  padding: '5px 8px',
                  borderRadius: '8px',
                  border: p === safePage ? '1.5px solid #0F766E' : '1px solid #CBD5E1',
                  background: p === safePage ? '#0F766E' : '#FFFFFF',
                  color: p === safePage ? '#FFFFFF' : '#334155',
                  fontWeight: '700',
                  fontSize: '0.76rem',
                  cursor: 'pointer'
                }}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => onPageChange(safePage + 1)}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              background: safePage >= totalPages ? '#F1F5F9' : '#FFFFFF',
              color: safePage >= totalPages ? '#94A3B8' : '#0F172A',
              fontWeight: '700',
              fontSize: '0.76rem',
              cursor: safePage >= totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
