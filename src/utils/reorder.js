// Moves the item at `fromIndex` to `toIndex` and returns a new array with every
// item's `order` reassigned to its new sequential position (0, 1, 2, ...).
//
// Renumbering the WHOLE list on every move — rather than just swapping the two
// affected items' stored `order` values — is deliberate: newly created entries
// default to order 0 unless a value is typed into the create form, so several items
// can easily share the same order value. Swapping raw values in that case wouldn't
// visibly move anything. Renumbering by array position sidesteps ties entirely and
// keeps the list self-healing after every reorder action.
export function reorderList(items, fromIndex, toIndex) {
  const next = items.slice()
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next.map((item, i) => ({ ...item, order: i }))
}
