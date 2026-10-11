"use client";

import * as React from "react";
import { Search, SlidersHorizontal, MapPinOff } from "lucide-react";
import { Button, ClinicCard, Input, PageHeader, Select } from "@/components/ui";
import { CLINICS, REGIONS, mapsSearchUrl } from "@/data/clinics";

/* Lokasi Klinik.png - direktori klinik dengan filter wilayah bertingkat */

const PROVINCES = Object.keys(REGIONS);

export default function KlinikPage() {
  const [province, setProvince] = React.useState(PROVINCES[0]);
  const [regency, setRegency] = React.useState("Sleman");
  const [district, setDistrict] = React.useState("");
  const [village, setVillage] = React.useState("");
  // Kecamatan & kelurahan baru diterapkan saat tombol "Cari Klinik" ditekan.
  const [applied, setApplied] = React.useState({ district: "", village: "" });

  const clinics = React.useMemo(() => {
    const kec = applied.district.trim().toLowerCase();
    const kel = applied.village.trim().toLowerCase();
    return CLINICS.filter(
      (c) =>
        c.province === province &&
        c.regency === regency &&
        (!kec || `${c.district} ${c.address}`.toLowerCase().includes(kec)) &&
        (!kel || c.address.toLowerCase().includes(kel))
    );
  }, [province, regency, applied]);

  const changeProvince = (p: string) => {
    setProvince(p);
    setRegency(REGIONS[p][0]);
  };

  return (
    <>
      <PageHeader title="Klinik Terdekat" description="Temukan klinik dan dokter hewan berdasarkan wilayah" />

      <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[290px_minmax(0,1fr)]">
        <form
          aria-label="Filter wilayah"
          onSubmit={(e) => {
            e.preventDefault();
            setApplied({ district, village });
          }}
          className="flex flex-col gap-4 rounded-3xl border border-border-hairline bg-white p-6 shadow-[0_4px_20px_-2px_rgba(19,53,57,0.05)] lg:sticky lg:top-32"
        >
          <h2 className="flex items-center gap-2.5 border-b border-border-hairline pb-4 font-display text-2xl text-teal-dark">
            <SlidersHorizontal className="h-5 w-5 text-teal-base" aria-hidden="true" />
            Filter Wilayah
          </h2>
          <label className="flex flex-col gap-2 text-sm font-bold text-slate-600">
            Provinsi
            <Select value={province} onChange={(e) => changeProvince(e.target.value)} options={PROVINCES} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-bold text-slate-600">
            Kabupaten / Kota
            <Select value={regency} onChange={(e) => setRegency(e.target.value)} options={REGIONS[province]} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-bold text-slate-600">
            Kecamatan
            <Input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Contoh: Depok" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-bold text-slate-600">
            Kelurahan / Desa
            <Input value={village} onChange={(e) => setVillage(e.target.value)} placeholder="Contoh: Caturtunggal" />
          </label>
          <Button type="submit" variant="teal" shape="rounded" className="mt-1 w-full" leftIcon={<Search className="h-4 w-4" />}>
            Cari Klinik
          </Button>
        </form>

        <div>
          <p aria-live="polite" className="mb-4 px-1 text-sm font-bold text-slate-500">
            {clinics.length ? `${clinics.length} klinik di ${regency}` : ""}
          </p>
          {clinics.length ? (
            <div className="flex flex-col gap-5">
              {clinics.map((c) => (
                <ClinicCard
                  key={c.id}
                  id={c.id}
                  name={c.name}
                  address={c.address}
                  isOpen={c.isOpen}
                  distanceKm={c.distanceKm}
                  rating={c.rating}
                  reviewCount={c.reviewCount}
                  openSchedule={c.openSchedule}
                  services={c.services}
                  activeDoctor={{
                    name: c.vet.name,
                    specialization: "Spesialis " + c.vet.specialization,
                    schedule: c.vet.schedule,
                  }}
                  mapNavUrl={mapsSearchUrl(c)}
                  detailHref={`/klinik/${c.id}`}
                  className="border-2 border-[#77e0e4]"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border-hairline bg-surface-bg px-6 py-14 text-center">
              <MapPinOff className="h-10 w-10 text-slate-400" aria-hidden="true" />
              <h3 className="font-display text-2xl text-teal-dark">Belum ada klinik di wilayah ini</h3>
              <p className="text-slate-500">Coba kabupaten/kota lain atau kosongkan kecamatan dan kelurahan.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
