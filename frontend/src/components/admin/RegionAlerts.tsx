"use client";

import * as React from "react";
import { useAdminStore, adminName, matches, regionAlerts } from "@/store/useAdminStore";
import { toast } from "@/store/useToastStore";
import { MiniItem, OkNote } from "./AdminUI";

/** Daftar peringatan wilayah (dipakai di Ringkasan & Pemantauan scan AI). */
export default function RegionAlerts() {
  const { data, query, update } = useAdminStore();
  const list = regionAlerts(data).filter((a) => matches(query, a.deteksi, a.wilayah));

  const send = (deteksi: string, wilayah: string) => {
    update(() => {}, { jenis: "Pengaturan", teks: `${adminName(data)} mengirim peringatan ${deteksi} ke peternak di ${wilayah}` });
    toast(`Peringatan dikirim ke peternak di ${wilayah}`);
  };

  return (
    <ul>
      {list.map((a) => (
        <MiniItem
          key={a.deteksi + a.wilayah}
          alert
          title={`${a.deteksi} di ${a.wilayah}`}
          sub={`${a.n} kasus berisiko tinggi, perlu koordinasi dengan dinas`}
          action={
            <button
              type="button"
              onClick={() => send(a.deteksi, a.wilayah)}
              className="shrink-0 rounded-xl border border-border-hairline bg-white px-3.5 py-1.5 text-xs font-bold text-teal-dark hover:bg-slate-50 cursor-pointer"
            >
              Kirim peringatan
            </button>
          }
        />
      ))}
      {!list.length && <OkNote>Tidak ada peringatan wilayah saat ini.</OkNote>}
    </ul>
  );
}
