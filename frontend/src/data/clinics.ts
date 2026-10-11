/* Data contoh klinik (Lokasi Klinik.png & Klinik Terdekat.png). */

export interface Clinic {
  id: string;
  name: string;
  address: string;
  province: string;
  regency: string;
  district: string;
  isOpen: boolean;
  distanceKm?: number;
  rating: number;
  reviewCount?: number;
  openSchedule: string;
  services: string;
  vet: {
    name: string;
    specialization: string;
    schedule: string;
  };
  weeklySchedule: [string, string][];
}

export const CLINICS: Clinic[] = [
  {
    id: "sehat-makmur-vet",
    name: "Klinik Hewan Sehat Makmur Vet",
    address: "JL Kaliurang KM 9.2, Sleman, Yogyakarta",
    province: "D.I. Yogyakarta",
    regency: "Sleman",
    district: "Ngaglik",
    isOpen: true,
    distanceKm: 2.1,
    rating: 4.9,
    reviewCount: 124,
    openSchedule: "Senin - Sabtu (08:00 - 20:00)",
    services: "Ternak Besar, Peliharaan, USG",
    vet: {
      name: "drh. Rahmat Santoso, M.Sc",
      specialization: "Reproduksi Hewan Ternak",
      schedule: "09:00 - 16:00 WIB",
    },
    weeklySchedule: [
      ["Senin s/d Jumat", "08:00 - 20:00"],
      ["Sabtu", "08:00 - 14:00"],
      ["Minggu/Hari Besar", "Libur"],
    ],
  },
  {
    id: "racing-kopling",
    name: "Klinik Hewan Racing Kopling",
    address: "JL Selokan Mataram No. 500, Sleman, Yogyakarta",
    province: "D.I. Yogyakarta",
    regency: "Sleman",
    district: "Mlati",
    isOpen: false,
    distanceKm: 3.5,
    rating: 4.8,
    reviewCount: 250,
    openSchedule: "Senin - Sabtu (08:00 - 16:00)",
    services: "Ternak Besar, Peliharaan, USG",
    vet: {
      name: "drh. Supriyadi Junaedi, M.Sc",
      specialization: "Reproduksi Hewan Ternak",
      schedule: "09:00 - 14:00 WIB",
    },
    weeklySchedule: [
      ["Senin s/d Sabtu", "08:00 - 16:00"],
      ["Minggu/Hari Besar", "Libur"],
    ],
  },
  {
    id: "ternak-mulyono",
    name: "Klinik Ternak Mulyono",
    address: "Jl. Kutai Utara No.1, Sumber, Kec. Banjarsari, Kota Surakarta",
    province: "Jawa Tengah",
    regency: "Kota Surakarta",
    district: "Banjarsari",
    isOpen: true,
    rating: 4.95,
    openSchedule: "Senin s/d Jumat (07:00 - 21:00)",
    services: "Ternak Besar, Unggas",
    vet: {
      name: "drh. Nafal Rustanto, M.Vet",
      specialization: "Unggas & Kesehatan Kambing Perah",
      schedule: "07:00 - 21:00 WIB",
    },
    weeklySchedule: [
      ["Senin s/d Jumat", "07:00 - 21:00"],
      ["Sabtu", "08:30 - 17:00"],
      ["Minggu/Hari Besar", "Libur"],
    ],
  },
];

export const REGIONS: Record<string, string[]> = {
  "D.I. Yogyakarta": ["Sleman", "Kota Yogyakarta", "Bantul", "Kulon Progo", "Gunungkidul"],
  "Jawa Tengah": ["Kota Surakarta", "Sukoharjo", "Klaten"],
};

export const mapsSearchUrl = (c: Clinic) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.name} ${c.address}`)}`;

export const mapsEmbedUrl = (c: Clinic) =>
  `https://www.google.com/maps?q=${encodeURIComponent(`${c.name} ${c.address}`)}&output=embed`;
