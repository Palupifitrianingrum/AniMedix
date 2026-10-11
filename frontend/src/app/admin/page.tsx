"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, MessageSquare, Banknote } from "lucide-react";
import { useAdminStore, adminName, komisiOf, matches } from "@/store/useAdminStore";
import { Panel, PanelLink, Seg, StatRow, StatTile, MiniItem, OkNote } from "@/components/admin/AdminUI";
import { DonutChart, HBars, LineChart } from "@/components/admin/Charts";
import RegionAlerts from "@/components/admin/RegionAlerts";
import { DAY_MS, HARI, fmtDate, fmtDateTime, rp } from "@/lib/format";
import { useRouter } from "next/navigation";

/* Ringkasan portal admin (mengikuti gaya Dashboard Peternak) */

const SCAN_PER_DAY = [182, 205, 190, 231, 248, 219, 264, 240, 276, 259, 291, 305, 288, 322];
const LOG_AB = { Peternak: "PT", "Dokter hewan": "DR", Admin: "AD" } as const;

function CountUp({ to, ms = 900 }: { to: number; ms?: number }) {
  const [v, setV] = React.useState(0);
  React.useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min((t - t0) / ms, 1);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, ms]);
  return <>{v.toLocaleString("id-ID")}</>;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data, query } = useAdminStore();
  const [range, setRange] = React.useState<"7" | "14">("7");
  const [now] = React.useState(() => Date.now());

  const pending = data.vets.filter((v) => v.status === "menunggu");
  const lunas = data.konsultasi.filter((k) => k.status === "Lunas");
  const unpaid = data.konsultasi.filter((k) => k.status === "Menunggu").length;
  const komisi = lunas.filter((k) => !k.cair).reduce((a, k) => a + komisiOf(k, data), 0);
  const platform = lunas.reduce((a, k) => a + k.tarif - komisiOf(k, data), 0);
  const tinggi = data.scans.filter((s) => s.risiko === "Tinggi" && s.status === "Baru").length;
  const first = adminName(data).split(" ")[0];

  const n = Number(range);
  const lineData = SCAN_PER_DAY.slice(-n);
  const lineLabels = lineData.map((_, i) => HARI[new Date(now - (n - 1 - i) * DAY_MS).getDay()]);

  return (
    <>
      {/* Hero */}
      <section className="relative mb-5 overflow-hidden rounded-[32px] bg-gradient-to-r from-[#173e3f] via-[#1d5552] to-[#5e8a3a] p-8 text-white shadow-xl sm:p-10">
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h1 className="font-display text-4xl leading-tight sm:text-5xl">
              Halo, {first === "Admin" ? "Admin" : first}! <span aria-hidden="true">👋</span>
            </h1>
            <h2 className="font-display text-3xl leading-tight text-[#77e0e4] sm:text-[36px]">
              Semua layanan AniMedix hari ini berjalan lancar.
            </h2>
            <p className="mt-4 max-w-xl text-sm font-bold text-slate-100 sm:text-base">
              {pending.length || unpaid || tinggi
                ? `${pending.length} dokter hewan menunggu verifikasi, ${unpaid} pembayaran belum selesai, dan ${tinggi} kasus berisiko tinggi belum ditinjau.`
                : "Tidak ada yang menunggu. Semua sudah beres."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/admin/verifikasi" className="rounded-2xl bg-olive-light px-6 py-3 text-sm font-bold text-teal-dark shadow-lg hover:bg-[#8fae4a]">
                Verifikasi dokter hewan
              </Link>
              <Link href="/admin/scan" className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/20">
                Pantau scan AI
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md lg:col-span-4">
            <h3 className="mb-4 border-b border-white/15 pb-3 text-sm font-bold text-slate-200">Status platform</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-black/20 p-4 text-center">
                <small className="text-[11px] text-slate-300">Pengguna aktif</small>
                <strong className="my-1 block font-display text-4xl"><CountUp to={1284} /></strong>
                <em className="text-[11px] font-bold not-italic text-olive-light">Terdaftar</em>
              </div>
              <div className="rounded-2xl bg-black/20 p-4 text-center">
                <small className="text-[11px] text-slate-300">Scan AI hari ini</small>
                <strong className="my-1 block font-display text-4xl text-[#77e0e4]"><CountUp to={322} /></strong>
                <em className="text-[11px] font-bold not-italic text-olive-light">Selesai</em>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatRow>
        <StatTile label="Peternak terdaftar" value="1.284" note="+42 minggu ini" noteTone="ok" />
        <StatTile
          label="Dokter hewan mitra"
          value={data.vets.filter((v) => v.status === "disetujui").length + 341}
          note={`${pending.length} menunggu verifikasi`}
          tone="ok"
          noteTone={pending.length ? "warn" : "ok"}
        />
        <StatTile label="Pendapatan platform" value={rp(platform)} note="14 hari terakhir" noteTone="mute" />
        <StatTile label="Kasus risiko tinggi" value={tinggi} note={tinggi ? "Belum ditinjau" : "Semua sudah ditinjau"} tone={tinggi ? "bad" : "ok"} />
      </StatRow>

      {/* Aksi cepat */}
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { href: "/admin/verifikasi", icon: ShieldCheck, wash: "bg-teal-tint text-teal-base", title: "Verifikasi menunggu", desc: "Cek STR/SIP dokter hewan yang baru mendaftar.", val: `${pending.length} permohonan`, valCls: "text-teal-base" },
          { href: "/admin/konsultasi", icon: MessageSquare, wash: "bg-olive-wash text-olive-dark", title: "Pembayaran tertunda", desc: "Transaksi konsultasi yang belum dibayar peternak.", val: `${unpaid} transaksi`, valCls: "text-olive-dark" },
          { href: "/admin/konsultasi", icon: Banknote, wash: "bg-[#fff7ed] text-coral-accent", title: "Komisi belum dicairkan", desc: "Total yang perlu dibayarkan ke dokter hewan mitra.", val: rp(komisi), valCls: "text-coral-accent" },
        ].map(({ href, icon: Icon, wash, title, desc, val, valCls }) => (
          <Link key={title} href={href} className="flex gap-4 rounded-3xl border border-border-hairline bg-white p-5 shadow-[0_4px_20px_-2px_rgba(19,53,57,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-md">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${wash}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h4 className="font-display text-lg text-teal-dark">{title}</h4>
              <p className="text-[13px] text-slate-500">{desc}</p>
              <b className={`mt-2 block text-sm ${valCls}`}>{val}</b>
            </div>
          </Link>
        ))}
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Panel
          title="Scan AI per hari"
          desc="Jumlah foto yang dipindai pengguna"
          action={<Seg value={range} onChange={setRange} options={[{ value: "7", label: "7 hari" }, { value: "14", label: "14 hari" }]} />}
        >
          <LineChart data={lineData} labels={lineLabels} />
        </Panel>
        <Panel title="Penyakit paling sering terdeteksi" desc="Bulan ini">
          <DonutChart
            centerLabel="deteksi"
            items={[
              { nama: "Penyakit kudis", n: 214, warna: "#21abb8" },
              { nama: "Gejala PMK", n: 168, warna: "#eb792b" },
              { nama: "Mastitis", n: 131, warna: "#9cb958" },
              { nama: "Orf (ektima)", n: 96, warna: "#f6b73c" },
              { nama: "Lainnya", n: 74, warna: "#a9bcc0" },
            ]}
          />
        </Panel>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Panel title="Permohonan dokter terbaru" desc="Menunggu verifikasi" action={<PanelLink href="/admin/verifikasi">Lihat semua</PanelLink>}>
          <ul>
            {pending
              .filter((v) => matches(query, v.nama, v.kota))
              .slice(0, 4)
              .map((v) => (
                <MiniItem
                  key={v.id}
                  bubble={v.nama}
                  title={v.nama}
                  sub={`${v.kota} · daftar ${fmtDate(v.tgl)}`}
                  action={
                    <button
                      type="button"
                      onClick={() => router.push(`/admin/verifikasi?periksa=${v.id}`)}
                      className="rounded-xl border border-border-hairline px-3.5 py-1.5 text-xs font-bold text-teal-dark hover:bg-slate-50 cursor-pointer"
                    >
                      Periksa
                    </button>
                  }
                />
              ))}
            {!pending.length && <OkNote>Belum ada permohonan baru.</OkNote>}
          </ul>
        </Panel>
        <Panel title="Peringatan wilayah" desc="Kasus risiko tinggi yang berkumpul di satu daerah" action={<PanelLink href="/admin/scan">Lihat scan</PanelLink>}>
          <RegionAlerts />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Panel title="Sebaran pengguna" desc="Per provinsi">
          <HBars
            items={[
              { nama: "DI Yogyakarta", n: 312, warna: "#21abb8" },
              { nama: "Jawa Tengah", n: 286, warna: "#9cb958" },
              { nama: "Jawa Barat", n: 241, warna: "#eb792b" },
              { nama: "Jawa Timur", n: 198, warna: "#f6b73c" },
              { nama: "Provinsi lain", n: 247, warna: "#a9bcc0" },
            ]}
          />
        </Panel>
        <Panel title="Aktivitas terbaru" desc="Seluruh peran pengguna" action={<PanelLink href="/admin/log">Lihat log</PanelLink>}>
          <ul>
            {data.logs
              .filter((l) => matches(query, l.teks))
              .slice(0, 5)
              .map((l) => (
                <MiniItem key={l.ts + l.teks} bubble={LOG_AB[l.peran]} title={l.teks} sub={`${l.peran} · ${fmtDateTime(l.ts)}`} />
              ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
