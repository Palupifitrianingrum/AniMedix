/* Helper format angka, waktu, dan inisial nama untuk seluruh halaman. */

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
export const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
export const DAY_MS = 86_400_000;

/** Rp 35.000 (dengan spasi, gaya halaman peternak) */
export const rupiah = (n: number) => "Rp " + Math.round(n).toLocaleString("id-ID");

/** Rp35.000 (tanpa spasi, gaya portal admin) */
export const rp = (n: number) => "Rp" + Math.round(n).toLocaleString("id-ID");

/** 4.98 -> "4,98" */
export const decimalId = (n: number) => String(n).replace(".", ",");

/** Inisial 2 huruf, gelar (Dr., drh., Ir.) diabaikan */
export function initials(name: string): string {
  return name
    .replace(/^((Dr|dr|drh|Ir)\.\s*)+/i, "")
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/** Sisa milidetik -> "14:59" */
export function mmss(ms: number): string {
  const left = Math.max(0, ms);
  const m = Math.floor(left / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export const fmtDate = (v: string | number) => {
  const d = new Date(v);
  return `${String(d.getDate()).padStart(2, "0")} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
};

export const fmtTime = (v: number) => {
  const d = new Date(v);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export const fmtDateTime = (v: number) => `${fmtDate(v)}, ${fmtTime(v)}`;

export const dayKey = (v: number) => new Date(v).toDateString();

/** "11 Oktober 2026 pukul 01:15 WIB" */
export const fmtDeadline = (ts: number) =>
  new Date(ts)
    .toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    })
    .replace(".", ":") + " WIB";
