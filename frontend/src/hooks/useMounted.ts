import * as React from "react";

const subscribe = () => () => {};

/**
 * true setelah komponen berjalan di browser.
 * Dipakai untuk halaman yang membaca data dari sessionStorage/localStorage
 * supaya HTML server dan browser tidak berbeda (hydration mismatch).
 */
export function useMounted(): boolean {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
