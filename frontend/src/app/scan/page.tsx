"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  UploadCloud,
  RotateCw,
  Zap,
  ZapOff,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useScanStore } from "@/store/useScanStore";
import { toast } from "@/store/useToastStore";

export default function ScanPage() {
  const router = useRouter();
  const { analyzeImage, isAnalyzing, analysisProgress } = useScanStore();

  // Mode: "camera" | "gallery"
  const [mode, setMode] = React.useState<"camera" | "gallery">("camera");

  // Camera State
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = React.useState<string | null>(null);
  const [facingMode, setFacingMode] = React.useState<"environment" | "user">("environment");
  const [flashOn, setFlashOn] = React.useState(false);
  const [cameraLoading, setCameraLoading] = React.useState(false);

  // Gallery Upload State
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  // Inisialisasi Kamera saat Mode atau Facing Mode Berubah
  React.useEffect(() => {
    let active = true;
    let localStream: MediaStream | null = null;

    if (mode === "camera") {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        Promise.resolve().then(() => {
          if (!active) return;
          setCameraError("Perangkat atau browser Anda tidak mendukung akses kamera langsung.");
          setCameraLoading(false);
        });
        return;
      }

      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        })
        .then((newStream) => {
          if (!active) {
            newStream.getTracks().forEach((track) => track.stop());
            return;
          }
          localStream = newStream;
          setStream(newStream);
          if (videoRef.current) {
            videoRef.current.srcObject = newStream;
            videoRef.current.play().catch(() => {});
          }
          setCameraLoading(false);
        })
        .catch((err: unknown) => {
          if (!active) return;
          const msg =
            err instanceof Error
              ? err.message
              : "Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.";
          setCameraError(msg);
          setCameraLoading(false);
        });
    }

    return () => {
      active = false;
      if (localStream) {
        (localStream as MediaStream).getTracks().forEach((track) => track.stop());
      }
      setStream((currentStream) => {
        if (currentStream) {
          currentStream.getTracks().forEach((track) => track.stop());
        }
        return null;
      });
    };
  }, [mode, facingMode]);

  // Flip Kamera
  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Retry Kamera
  const handleRetryCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "environment" : "environment"));
    setCameraLoading(true);
  };

  // Toggle Flash (jika didukung hardware browser)
  const handleToggleFlash = async () => {
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      try {
        const capabilities = videoTrack.getCapabilities() as { torch?: boolean };
        if (capabilities && "torch" in capabilities) {
          const nextState = !flashOn;
          await (videoTrack.applyConstraints as (c: unknown) => Promise<void>)({
            advanced: [{ torch: nextState }],
          });
          setFlashOn(nextState);
        } else {
          setFlashOn((prev) => !prev);
          toast("Simulasi Flash diaktifkan");
        }
      } catch {
        setFlashOn((prev) => !prev);
      }
    }
  };

  // Capture Snapshot dari Video Stream
  const handleCapturePhoto = async () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    // Hentikan kamera
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    // Jalankan analisis
    try {
      await analyzeImage(dataUrl, "camera");
      router.push("/scan/hasil");
    } catch {
      toast("Gagal memproses gambar. Silakan coba kembali.");
    }
  };

  // Handle Pilih File dari Galeri
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast("Mohon pilih file gambar yang valid (JPG, PNG, WEBP).");
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Jalankan Analisis untuk File Galeri
  const handleStartGalleryAnalysis = async () => {
    if (!previewUrl) {
      toast("Silakan pilih foto hewan terlebih dahulu.");
      return;
    }

    try {
      await analyzeImage(previewUrl, "upload");
      router.push("/scan/hasil");
    } catch {
      toast("Gagal menganalisis gambar. Silakan coba lagi.");
    }
  };

  return (
    <div className="w-full flex flex-col flex-1 gap-6 relative">
      <canvas ref={canvasRef} className="hidden" />

      {/* Header Title & Mode Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-white tracking-tight">
            Scan Your Animal
          </h1>
          <p className="font-body text-sm sm:text-base text-slate-400 mt-1">
            Pindai bagian tubuh hewan yang bergejala untuk identifikasi instan
          </p>
        </div>

        {/* Tab Switcher: Kamera vs Galeri */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/10 border border-white/10 self-start sm:self-auto backdrop-blur-md">
          <button
            type="button"
            onClick={() => setMode("camera")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === "camera"
                ? "bg-[#21abb8] text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Kamera Langsung</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("gallery")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === "gallery"
                ? "bg-[#21abb8] text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Galeri</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          MODE 1: KAMERA FOTO LANGSUNG (Scan Foto Langsung.png)
         ======================================================== */}
      {mode === "camera" && (
        <div className="relative w-full flex-1 min-h-[460px] sm:min-h-[540px] rounded-3xl overflow-hidden bg-[#0a111a] border border-white/15 shadow-2xl flex items-center justify-center">
          {/* Flash Effect Overlay */}
          {flashOn && (
            <div className="absolute inset-0 bg-white/20 pointer-events-none z-30 transition-opacity" />
          )}

          {/* Live Video Viewfinder */}
          {!cameraError ? (
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover absolute inset-0 z-0"
            />
          ) : (
            /* Fallback jika izin kamera ditolak / tidak tersedia */
            <div className="z-10 flex flex-col items-center justify-center p-8 text-center max-w-md">
              <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl text-white mb-2">Akses Kamera Terkendala</h3>
              <p className="text-sm text-slate-400 mb-6">{cameraError}</p>
              <div className="flex gap-3">
                <Button
                  variant="teal"
                  shape="rounded"
                  size="sm"
                  onClick={handleRetryCamera}
                >
                  <RefreshCw className="w-4 h-4 mr-1.5" /> Coba Lagi
                </Button>
                <Button
                  variant="outline"
                  shape="rounded"
                  size="sm"
                  onClick={() => setMode("gallery")}
                  className="text-white border-white/20"
                >
                  Gunakan Upload Galeri
                </Button>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {cameraLoading && (
            <div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-teal-accent animate-spin" />
              <p className="text-sm text-slate-300 font-semibold">Mengaktifkan kamera...</p>
            </div>
          )}

          {/* Viewfinder Overlay Controls */}
          {!cameraError && (
            <>
              {/* Top-Right Controls: Flip Camera & Flash Toggle */}
              <div className="absolute top-5 right-5 z-20 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleFlipCamera}
                  className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                  aria-label="Pembalik kamera"
                  title="Ganti Kamera Depan/Belakang"
                >
                  <RotateCw className="w-5 h-5 text-slate-200" />
                </button>
                <button
                  type="button"
                  onClick={handleToggleFlash}
                  className={`w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg ${
                    flashOn
                      ? "bg-amber-400 text-teal-dark border-amber-300"
                      : "bg-black/50 hover:bg-black/75 text-white border-white/20"
                  }`}
                  aria-label="Saklar flash"
                  title="Nyalakan/Matikan Flash"
                >
                  {flashOn ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5 text-slate-200" />}
                </button>
              </div>

              {/* Center Target Box: Reticle Scan (Sesuai Wireframe Scan Foto Langsung.png) */}
              <div className="z-10 pointer-events-none flex flex-col items-center justify-center w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] relative">
                {/* 4 Corner L-Shapes Reticle */}
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-3 border-l-3 border-[#21abb8] rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-3 border-r-3 border-[#21abb8] rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-3 border-l-3 border-[#21abb8] rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-3 border-r-3 border-[#21abb8] rounded-br-lg" />

                {/* Inner Outline with subtle pulse */}
                <div className="w-full h-full border border-[#21abb8]/40 rounded-2xl flex items-center justify-center">
                  <span className="font-body font-bold text-xs sm:text-sm tracking-widest text-[#21abb8] uppercase px-4 py-1.5 rounded-full bg-teal-dark/60 backdrop-blur-sm shadow-sm">
                    POSISIKAN AREA GEJALA
                  </span>
                </div>
              </div>

              {/* Bottom Controls Bar */}
              <div className="absolute bottom-6 inset-x-6 z-20 flex items-center justify-between pointer-events-none">
                {/* Bottom-Left: Use Picture From Gallery Button (Sesuai Wireframe) */}
                <button
                  type="button"
                  onClick={() => setMode("gallery")}
                  className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/85 backdrop-blur-md text-white text-xs sm:text-sm font-body font-bold border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-teal-accent" />
                  <span>Use picture from gallery</span>
                </button>

                {/* Bottom-Center: Big Camera Shutter Button (Sesuai Wireframe) */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0 pointer-events-auto">
                  <button
                    type="button"
                    onClick={handleCapturePhoto}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-4 border-white bg-transparent flex items-center justify-center p-1.5 shadow-[0_0_30px_rgba(33,171,184,0.4)] transition-all hover:scale-105 active:scale-90 cursor-pointer"
                    aria-label="Ambil foto untuk scan"
                  >
                    <div className="w-full h-full rounded-full bg-[#21abb8] shadow-inner" />
                  </button>
                </div>

                {/* Spacer placeholder for balance */}
                <div className="w-24 hidden sm:block" />
              </div>
            </>
          )}
        </div>
      )}

      {/* ========================================================
          MODE 2: UPLOAD FOTO DARI GALERI (Scan Upload Gambar.png)
         ======================================================== */}
      {mode === "gallery" && (
        <div className="w-full flex flex-col gap-8 flex-1">
          {/* Dashed Dropzone Card Container (Sesuai Wireframe Scan Upload Gambar.png) */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`w-full flex-1 min-h-[380px] sm:min-h-[440px] rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-8 sm:p-12 text-center relative ${
              isDragging
                ? "border-teal-accent bg-teal-accent/10"
                : "border-white/20 bg-white/5 hover:border-white/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {!previewUrl ? (
              <div className="flex flex-col items-center max-w-md">
                {/* Cloud Upload Icon Circle (Sesuai Wireframe) */}
                <div className="w-20 h-20 rounded-full bg-teal-tint/15 border border-teal-accent/30 text-teal-accent flex items-center justify-center mb-6 shadow-inner">
                  <UploadCloud className="w-10 h-10" />
                </div>

                <h3 className="font-display text-2xl sm:text-3xl text-white mb-2 tracking-tight">
                  Upload Foto Hewan dari Galeri
                </h3>
                <p className="font-body text-xs sm:text-sm text-slate-400 mb-8 leading-relaxed max-w-sm">
                  Format didukung: JPG, PNG, WEBP. Pastikan fokus gambar jelas dan pencahayaan memadai.
                </p>

                {/* Tombol Pilih Foto (Sesuai Wireframe) */}
                <Button
                  variant="teal"
                  shape="rounded"
                  size="md"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-3 text-base shadow-lg"
                >
                  Pilih Foto
                </Button>
              </div>
            ) : (
              /* Preview Gambar yang Dipilih */
              <div className="flex flex-col items-center gap-4 max-w-md w-full">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border-2 border-teal-accent shadow-2xl group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Preview ternak"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="outline"
                      shape="rounded"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-white border-white"
                    >
                      Ganti Foto
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-teal-accent font-bold">
                  <Check className="w-4 h-4" />
                  <span>Foto berhasil dipilih ({selectedFile?.name})</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action CTA Button: Mulai Analisis (Scan) (Sesuai Wireframe) */}
          <div className="flex justify-center pb-6">
            <button
              type="button"
              disabled={!previewUrl || isAnalyzing}
              onClick={handleStartGalleryAnalysis}
              className={`w-full sm:w-auto min-w-[280px] px-10 py-4 rounded-2xl font-display text-lg tracking-wide shadow-xl transition-all ${
                previewUrl && !isAnalyzing
                  ? "bg-[#9bb859] hover:bg-[#88a546] text-white hover:scale-105 active:scale-95 cursor-pointer"
                  : "bg-white/10 text-slate-500 cursor-not-allowed border border-white/5"
              }`}
            >
              Mulai Analisis (Scan)
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          HIGH-TECH AI SCANNING PROGRESS MODAL
         ======================================================== */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#132225] border border-teal-accent/40 rounded-3xl p-8 shadow-2xl flex flex-col items-center">
            {/* Pulsing Radar Circle */}
            <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-teal-accent/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-teal-accent/50 animate-spin" />
              <div className="w-16 h-16 rounded-full bg-teal-accent flex items-center justify-center text-teal-dark shadow-lg">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>

            <h3 className="font-display text-2xl text-white mb-2">
              Menganalisis Citra Hewan
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              AniMedix Vision AI sedang mengevaluasi pola lesi mukosa, gejala klinis, dan tingkat keparahan...
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-black/40 rounded-full h-3 overflow-hidden border border-white/10 mb-3">
              <div
                className="bg-gradient-to-r from-[#21abb8] to-[#9bb859] h-full transition-all duration-300 rounded-full"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-teal-accent">
              {analysisProgress}% Selesai
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
