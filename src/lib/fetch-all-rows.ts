type PageResult<T> = { data: T[] | null; error: unknown }

// PostgREST can cap a response even when the caller does not specify a limit.
// Advance by the number actually returned, and stop only on an empty page.
export async function fetchAllRows<T>(
  fetchPage: (from: number, to: number) => PromiseLike<PageResult<T>>,
  pageSize = 500,
): Promise<PageResult<T>> {
  if (!Number.isInteger(pageSize) || pageSize < 1) throw new Error("Invalid page size")
  const rows: T[] = []
  while (true) {
    const { data, error } = await fetchPage(rows.length, rows.length + pageSize - 1)
    if (error) return { data: null, error }
    if (!data?.length) return { data: rows, error: null }
    rows.push(...data)
  }
}
