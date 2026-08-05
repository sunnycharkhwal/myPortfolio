const DEFAULT_LIMIT = 50
const MAX_LIMIT = 100

// Shared by every list endpoint so a runaway ?limit= can never force an unbounded
// query, even though this is a single-user dashboard with a tiny dataset today.
export function getPagination(query) {
  let page = parseInt(query.page, 10)
  let limit = parseInt(query.limit, 10)

  if (!Number.isFinite(page) || page < 1) page = 1
  if (!Number.isFinite(limit) || limit < 1) limit = DEFAULT_LIMIT
  if (limit > MAX_LIMIT) limit = MAX_LIMIT

  return { page, limit, skip: (page - 1) * limit }
}
