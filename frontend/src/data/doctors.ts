/* Data contoh dokter hewan (Tanya Dokter.png). Ganti dengan API saat backend siap. */

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  animals: string[];
  bodyParts: string[];
  fee: number;
  rating: number;
  experienceYears: number;
  consultationCount?: number;
  isOnline: boolean;
  senior?: boolean;
}

export const DOCTORS: Doctor[] = [
  {
    id: "drh-palupi",
    name: "Dr. dr. Ir. Palupi Fitria Ningrum, ST, MT, M.Kes, PhD",
    specialization: "Penyakit Hewan Ruminansia & Mukbang Ternak",
    animals: ["Kambing / Domba", "Sapi"],
    bodyParts: ["Mulut & Pencernaan", "Pernapasan"],
    fee: 35000,
    rating: 4.98,
    experienceYears: 14,
    consultationCount: 1400,
    isOnline: true,
    senior: true,
  },
  {
    id: "drh-bagus",
    name: "drh. Bagus Anggoro, M.Vet",
    specialization: "Unggas & Kesehatan Kambing Perah",
    animals: ["Unggas", "Kambing / Domba"],
    bodyParts: ["Kulit & Bulu", "Pernapasan"],
    fee: 25000,
    rating: 4.89,
    experienceYears: 8,
    isOnline: true,
  },
  {
    id: "drh-natanael",
    name: "Dr. dr. Ir. Natanael Sebastian Simanjuntak, ST, MT, M.Kes",
    specialization: "Penyakit Hewan Ruminansia & Mukbang Ternak",
    animals: ["Sapi", "Kambing / Domba"],
    bodyParts: ["Mulut & Pencernaan", "Reproduksi"],
    fee: 35000,
    rating: 4.98,
    experienceYears: 14,
    consultationCount: 1400,
    isOnline: false,
    senior: true,
  },
  {
    id: "drh-nafal",
    name: "drh. Nafal Rustanto, M.Vet",
    specialization: "Unggas & Kesehatan Kambing Perah",
    animals: ["Unggas", "Kambing / Domba"],
    bodyParts: ["Kulit & Bulu", "Mulut & Pencernaan"],
    fee: 25000,
    rating: 4.89,
    experienceYears: 8,
    isOnline: true,
  },
];

const uniq = (list: string[]) => [...new Set(list)];

export const DOCTOR_FILTERS = {
  specializations: uniq(DOCTORS.map((d) => d.specialization)),
  animals: uniq(DOCTORS.flatMap((d) => d.animals)),
  bodyParts: uniq(DOCTORS.flatMap((d) => d.bodyParts)),
};

/** Batas waktu pembayaran & durasi sesi chat, selaras dengan Pengaturan admin. */
export const PAY_MINUTES = 15;
export const SESSION_MINUTES = 30;
