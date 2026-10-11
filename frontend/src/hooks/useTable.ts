import * as React from "react";
import type { SortState } from "@/components/admin/AdminUI";

/** Urut + halaman untuk tabel admin. Halaman otomatis kembali ke 1 saat `resetKey` berubah. */
export function useTable<T, K extends string>(
  rows: T[],
  initialSort: SortState<K>,
  opts: { pageSize?: number; sortValue?: (row: T, key: K) => unknown; resetKey?: string } = {}
) {
  const { pageSize = 8, sortValue, resetKey = "" } = opts;
  const [sort, setSort] = React.useState(initialSort);
  const [pageState, setPageState] = React.useState({ page: 1, key: resetKey });
  // Reset halaman ketika filter berubah, tanpa efek tambahan.
  const page = pageState.key === resetKey ? pageState.page : 1;
  const setPage = (p: number) => setPageState({ page: p, key: resetKey });

  const sorted = React.useMemo(() => {
    const m = sort.dir === "asc" ? 1 : -1;
    const get = (r: T) => (sortValue ? sortValue(r, sort.key) : (r as Record<string, unknown>)[sort.key]);
    return [...rows].sort((a, b) => {
      const x = get(a);
      const y = get(b);
      if (typeof x === "number" && typeof y === "number") return (x - y) * m;
      return String(x).localeCompare(String(y), "id", { numeric: true }) * m;
    });
  }, [rows, sort, sortValue]);

  const total = sorted.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pages);
  const start = (current - 1) * pageSize;

  const onSort = (k: K) => {
    setSort((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }));
    setPage(1);
  };

  return {
    sort,
    onSort,
    rows: sorted.slice(start, start + pageSize),
    all: sorted,
    pager: { page: current, pages, total, from: start + 1, to: Math.min(start + pageSize, total), onPage: setPage },
  };
}
