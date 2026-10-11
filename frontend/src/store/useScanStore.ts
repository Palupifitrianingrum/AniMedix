import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type RiskLevel = "Rendah" | "Sedang" | "Tinggi";

export interface DiseaseDiagnosis {
  diseaseName: string;
  scientificName: string;
  confidence: number; // Persentase, misal 94.8
  riskLevel: RiskLevel;
  summary: string;
  detectedSymptoms: string[];
  firstAidActions: string[];
  treatmentWarnings: string[];
  recommendedSpecialist: string;
}

export interface ScanResult {
  id: string;
  createdAt: string;
  imageUrl: string;
  source: "camera" | "upload";
  diagnosis: DiseaseDiagnosis;
}

// Data pustaka diagnosis AI cerdas (Vision AI Mock Database)
export const DIAGNOSIS_PRESETS: DiseaseDiagnosis[] = [
  {
    diseaseName: "Penyakit Mulut dan Kuku (PMK)",
    scientificName: "Foot-and-Mouth Disease (Aphthovirus)",
    confidence: 96.4,
    riskLevel: "Tinggi",
    summary:
      "Terdeteksi lepuh/erosi karakteristik PMK pada area mukosa bibir dan moncong. Berpotensi menular sangat cepat pada ternak berkuku belah.",
    detectedSymptoms: [
      "Luka lepuh (vesikula) di sekitar bibir dan lidah",
      "Hipersalivasi (air liur berbusa dan menggantung)",
      "Suhu tubuh ternak terindikasi meningkat di atas normal",
      "Penurunan nafsu makan dan kelemahan fisik",
    ],
    firstAidActions: [
      "Isolasi dan karantina ternak segera dari kawanan ternak lainnya.",
      "Semprotkan larutan asam sitrat 0.2% atau antiseptik pada area luka mulut.",
      "Berikan pakan lunak (bubur katul/rumput cincang halus) agar ternak tetap mendapat nutrisi.",
      "Hubungi dokter hewan segera untuk injeksi antibiotik sekunder & antipiretik.",
    ],
    treatmentWarnings: [
      "Jangan memindahkan ternak ke luar kandang sebelum pemeriksaan dokter.",
      "Wajib desinfeksi alas kaki dan pakaian peternak saat keluar dari kandang isolasi.",
    ],
    recommendedSpecialist: "drh. Palupi Fitria, M.Sc (Spesialis Ruminansia Besar)",
  },
  {
    diseaseName: "Infestasi Jamur Kulit (Scabies / Ringworm)",
    scientificName: "Sarcoptic Mange / Trichophyton verrucosum",
    confidence: 91.2,
    riskLevel: "Sedang",
    summary:
      "Terdeteksi kerak tebal melingkar dan alopecia (kebotakan) pada permukaan epidermis kulit luar. Infeksi bersifat lokal namun menular.",
    detectedSymptoms: [
      "Kerak keputihan/abu-abu bersisik pada kulit daun telinga dan leher",
      "Kerontokan bulu melingkar (ringworm patch)",
      "Ternak sering menggesekkan badan ke tiang kandang (rasa gatal)",
    ],
    firstAidActions: [
      "Bersihkan kerak menggunakan air hangat dan sabun antiseptik secara perlahan.",
      "Oleskan salep antijamur/belerang (Sulfur/Ketoconazole) 2 kali sehari.",
      "Pastikan kandang mendapat paparan sinar matahari pagi yang cukup.",
    ],
    treatmentWarnings: [
      "Gunakan sarung tangan saat membersihkan luka karena beberapa jenis jamur bersifat zoonosis ringan ke manusia.",
    ],
    recommendedSpecialist: "drh. Bimo Aryo, Sp.PKH (Dermatologi Veteriner)",
  },
  {
    diseaseName: "Ternak Terindikasi Sehat (Normal)",
    scientificName: "Bovine / Caprine Healthy Condition",
    confidence: 98.7,
    riskLevel: "Rendah",
    summary:
      "Tidak terdeteksi kelainan visual pada jaringan epitel, mata, maupun moncong ternak. Selaput lendir dalam kondisi lembap dan sehat.",
    detectedSymptoms: [
      "Mukosa hidung dan bibir bersih tanpa luka atau leleran abnormal",
      "Kondisi bulu mengkilap dan tidak kusam",
      "Mata jernih dan responsif",
    ],
    firstAidActions: [
      "Pertahankan sanitasi kandang dan sirkulasi udara yang baik.",
      "Lanjutkan jadwal pemberian pakan bernutrisi dan mineral blok.",
      "Lakukan vaksinasi berkala sesuai kalender kesehatan ternak.",
    ],
    treatmentWarnings: [
      "Tetap lakukan pemantauan harian jika terdapat perubahan perilaku makan.",
    ],
    recommendedSpecialist: "drh. Siti Nurhaliza (Kesehatan Preventif)",
  },
];

interface ScanState {
  capturedImage: string | null;
  captureSource: "camera" | "upload";
  isAnalyzing: boolean;
  analysisProgress: number; // 0 - 100
  currentResult: ScanResult | null;
  history: ScanResult[];

  // Actions
  setCapturedImage: (image: string | null, source?: "camera" | "upload") => void;
  analyzeImage: (image: string, source: "camera" | "upload") => Promise<ScanResult>;
  resetCurrentScan: () => void;
  deleteScanHistory: (id: string) => void;
}

export const useScanStore = create<ScanState>()(
  persist(
    (set) => ({
      capturedImage: null,
      captureSource: "camera",
      isAnalyzing: false,
      analysisProgress: 0,
      currentResult: null,
      history: [],

      setCapturedImage: (image, source = "camera") =>
        set({ capturedImage: image, captureSource: source }),

      analyzeImage: async (image, source) => {
        set({
          capturedImage: image,
          captureSource: source,
          isAnalyzing: true,
          analysisProgress: 10,
        });

        // Simulasi tahapan scanning AI progresif
        await new Promise((r) => setTimeout(r, 400));
        set({ analysisProgress: 35 });
        await new Promise((r) => setTimeout(r, 500));
        set({ analysisProgress: 70 });
        await new Promise((r) => setTimeout(r, 600));
        set({ analysisProgress: 100 });
        await new Promise((r) => setTimeout(r, 300));

        // Tentukan diagnosis acak atau berbasis preset (default memilih PMK / Scabies untuk demo)
        const chosenPreset =
          DIAGNOSIS_PRESETS[Math.floor(Math.random() * (DIAGNOSIS_PRESETS.length - 1))];

        const newResult: ScanResult = {
          id: `SCN-${Date.now().toString(36).toUpperCase()}`,
          createdAt: new Date().toISOString(),
          imageUrl: image,
          source,
          diagnosis: chosenPreset,
        };

        set((state) => ({
          isAnalyzing: false,
          analysisProgress: 0,
          currentResult: newResult,
          history: [newResult, ...state.history],
        }));

        return newResult;
      },

      resetCurrentScan: () =>
        set({
          capturedImage: null,
          isAnalyzing: false,
          analysisProgress: 0,
          currentResult: null,
        }),

      deleteScanHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
          currentResult:
            state.currentResult?.id === id ? null : state.currentResult,
        })),
    }),
    {
      name: "animedix_scan_store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        history: state.history,
        currentResult: state.currentResult,
      }),
    }
  )
);
