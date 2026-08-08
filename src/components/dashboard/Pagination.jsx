// Shared pagination control, kept generic so any future paginated panel can reuse it.
export default function Pagination({ page, limit, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit))

  if (totalPages <= 1) return null

  return (
    <div className="dash-pagination">
      <button className="dash-pagination__btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        ‹ Prev
      </button>
      <span className="dash-pagination__label">
        Page {page} of {totalPages}
      </span>
      <button className="dash-pagination__btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Next ›
      </button>
    </div>
  )
}
