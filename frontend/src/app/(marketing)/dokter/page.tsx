"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, SearchX } from "lucide-react";
import { Button, DoctorCard, PageHeader, Select } from "@/components/ui";
import { DOCTORS, DOCTOR_FILTERS } from "@/data/doctors";
import { useConsultationStore } from "@/store/useConsultationStore";

/* Tanya Dokter.png - katalog & filter dokter hewan */

type SortKey = "rating" | "price" | "online";

const ALL = "all";

export default function TanyaDokterPage() {
  const router = useRouter();
  const selectDoctor = useConsultationStore((s) => s.selectDoctor);

  const [spec, setSpec] = React.useState(ALL);
  const [animal, setAnimal] = React.useState(ALL);
  const [part, setPart] = React.useState(ALL);
  const [sort, setSort] = React.useState<SortKey>("rating");

  const doctors = React.useMemo(() => {
    const rows = DOCTORS.filter(
      (d) =>
        (spec === ALL || d.specialization === spec) &&
        (animal === ALL || d.animals.includes(animal)) &&
        (part === ALL || d.bodyParts.includes(part))
    );
    return [...rows].sort((a, b) => {
      if (sort === "price") return a.fee - b.fee || b.rating - a.rating;
      if (sort === "online") return Number(b.isOnline) - Number(a.isOnline) || b.rating - a.rating;
      return b.rating - a.rating;
    });
  }, [spec, animal, part, sort]);

  const resetFilter = () => {
    setSpec(ALL);
    setAnimal(ALL);
    setPart(ALL);
    setSort("rating");
  };

  const handleConsult = (id: string) => {
    const doctor = DOCTORS.find((d) => d.id === id);
    if (!doctor || !doctor.isOnline) return;
    const orderId = selectDoctor(doctor);
    router.push(`/konsultasi/bayar/${orderId}`);
  };

  return (
    <>
      <PageHeader
        title="Tanya Dokter"
        description="Konsultasikan keluhan hewan Anda dengan dokter hewan berpengalaman"
        action={
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-2xl border border-border-hairline bg-white px-5 py-3 text-sm font-bold text-teal-dark hover:bg-slate-50"
          >
            Daftar sebagai dokter
          </Link>
        }
      />

      {/* Filter */}
      <form
        aria-label="Filter dokter"
        onSubmit={(e) => e.preventDefault()}
        className="mb-6 grid grid-cols-1 items-end gap-4 rounded-3xl border border-border-hairline bg-white p-6 shadow-[0_4px_20px_-2px_rgba(19,53,57,0.05)] sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]"
      >
        <label className="flex flex-col gap-2 text-sm font-bold text-slate-600">
          Spesialisasi
          <Select
            value={spec}
            onChange={(e) => setSpec(e.target.value)}
            options={[{ value: ALL, label: "Semua Spesialis" }, ...DOCTOR_FILTERS.specializations]}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-bold text-slate-600">
          Jenis Hewan
          <Select
            value={animal}
            onChange={(e) => setAnimal(e.target.value)}
            options={[{ value: ALL, label: "Semua Hewan" }, ...DOCTOR_FILTERS.animals]}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-bold text-slate-600">
          Bagian Tubuh
          <Select
            value={part}
            onChange={(e) => setPart(e.target.value)}
            options={[{ value: ALL, label: "Semua Bagian" }, ...DOCTOR_FILTERS.bodyParts]}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-bold text-slate-600">
          Urutkan
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            options={[
              { value: "rating", label: "Rating Tertinggi" },
              { value: "price", label: "Harga Terendah" },
              { value: "online", label: "Online Dulu" },
            ]}
          />
        </label>
        <Button type="submit" variant="teal" shape="rounded" className="h-13" leftIcon={<Search className="h-4 w-4" />}>
          Cari Dokter
        </Button>
      </form>

      <p aria-live="polite" className="mb-4 px-1 text-sm font-bold text-slate-500">
        {doctors.length ? `${doctors.length} dokter ditemukan` : ""}
      </p>

      {doctors.length ? (
        <div className="flex flex-col gap-4">
          {doctors.map((d) => (
            <DoctorCard
              key={d.id}
              id={d.id}
              name={d.name}
              specialization={"Spesialis " + d.specialization}
              rating={d.rating}
              experienceYears={d.experienceYears}
              consultationCount={d.consultationCount}
              fee={d.fee}
              isOnline={d.isOnline}
              colorPreset={d.senior ? "olive" : "neutral"}
              onConsult={handleConsult}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border-hairline bg-surface-bg px-6 py-14 text-center">
          <SearchX className="h-10 w-10 text-slate-400" aria-hidden="true" />
          <h3 className="font-display text-2xl text-teal-dark">Belum ada dokter yang cocok</h3>
          <p className="text-slate-500">Coba ubah spesialisasi, jenis hewan, atau bagian tubuh.</p>
          <Button variant="outline" shape="rounded" size="sm" onClick={resetFilter}>
            Reset filter
          </Button>
        </div>
      )}
    </>
  );
}
