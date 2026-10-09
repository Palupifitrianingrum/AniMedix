"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Tag, Search, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { Button, Input, Modal, StatusModal } from "@/components/ui";

interface LivestockItem {
  id: string;
  tagId: string;
  name: string;
  breed: string;
  age: string;
  history: string;
  category: "sapi" | "kambing" | "domba";
  themeColor: "olive" | "teal" | "amber";
  bgGradient: string;
}

export default function AnimalListPage() {
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);

  // Form Tambah Hewan
  const [newTagId, setNewTagId] = React.useState("");
  const [newName, setNewName] = React.useState("");
  const [newBreed, setNewBreed] = React.useState("");
  const [newAge, setNewAge] = React.useState("");
  const [newHistory, setNewHistory] = React.useState("");
  const [newCategory, setNewCategory] = React.useState<"sapi" | "kambing" | "domba">("sapi");

  const [livestockList, setLivestockList] = React.useState<LivestockItem[]>([
    {
      id: "SP-002",
      tagId: "ID: SP-002",
      name: "Si Loreng (Sapi Limosin)",
      breed: "Limosin Jantan",
      age: "3 Tahun",
      history: "Pemeriksaan kuku rutin, berat badan 650kg stabil.",
      category: "sapi",
      themeColor: "olive",
      bgGradient: "from-[#e4ded0] to-[#d6cbb8]",
    },
    {
      id: "SP-003",
      tagId: "ID: SP-002",
      name: "Si Loreng (Sapi Limosin)",
      breed: "Limosin Jantan",
      age: "3 Tahun",
      history: "Pemeriksaan kuku rutin, berat badan 650kg stabil.",
      category: "sapi",
      themeColor: "olive",
      bgGradient: "from-[#ded8cc] to-[#cfc4b1]",
    },
    {
      id: "KMB-001",
      tagId: "ID: KMB-001",
      name: "Si Bimo (Kambing Etawa)",
      breed: "Etawa Jantan",
      age: "2.5 Tahun",
      history: "Vaksinasi PMK lengkap, pemulihan diare pada Juli 2026.",
      category: "kambing",
      themeColor: "teal",
      bgGradient: "from-[#cadbd7] to-[#b7cbc7]",
    },
    {
      id: "KMB-002",
      tagId: "ID: KMB-001",
      name: "Si Bimo (Kambing Etawa)",
      breed: "Etawa Jantan",
      age: "2.5 Tahun",
      history: "Vaksinasi PMK lengkap, pemulihan diare pada Juli 2026.",
      category: "kambing",
      themeColor: "teal",
      bgGradient: "from-[#c6d7d3] to-[#b2c8c4]",
    },
  ]);

  const filteredList = livestockList.filter((item) => {
    const matchCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.tagId.toLowerCase().includes(search.toLowerCase()) ||
      item.breed.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newTagId) return;

    const newItem: LivestockItem = {
      id: newTagId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() || `TRN-${Date.now()}`,
      tagId: `ID: ${newTagId.toUpperCase()}`,
      name: `${newName} (${newBreed || "Ternak Unggul"})`,
      breed: newBreed || "Ras Unggul",
      age: newAge ? `${newAge} Tahun` : "1.5 Tahun",
      history: newHistory || "Pemeriksaan berkala awal ternak baru terdaftar.",
      category: newCategory,
      themeColor: newCategory === "sapi" ? "olive" : "teal",
      bgGradient:
        newCategory === "sapi"
          ? "from-[#e4ded0] to-[#d6cbb8]"
          : "from-[#cadbd7] to-[#b7cbc7]",
    };

    setLivestockList([newItem, ...livestockList]);
    setIsAddModalOpen(false);
    setIsSuccessModalOpen(true);

    // Reset Form
    setNewTagId("");
    setNewName("");
    setNewBreed("");
    setNewAge("");
    setNewHistory("");
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Sesuai Wireframe Animal List.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl text-teal-dark tracking-tight">
            Animal List
          </h1>
          <p className="text-xs sm:text-sm font-body text-slate-500 font-semibold mt-1">
            Daftar hewan ternak yang terdaftar dalam pantauan kesehatan
          </p>
        </div>

        {/* Tombol Tambah Hewan (Add) */}
        <Button
          type="button"
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-[#84a34b] hover:bg-[#72913b] text-white px-5 py-2.5 rounded-2xl shadow-sm text-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Hewan (Add)</span>
        </Button>
      </div>

      {/* Main Container Card Sesuai Wireframe */}
      <div className="bg-surface-card border border-border-hairline rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-2px_rgba(19,53,57,0.06)] flex flex-col gap-6">
        {/* Filter Category & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "Semua Ternak" },
              { id: "sapi", label: "Sapi Potong & Perah" },
              { id: "kambing", label: "Kambing & Domba" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-body transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === tab.id
                    ? "bg-teal-base text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari ID atau nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-body text-teal-dark placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-accent focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Grid 2 Kolom Kartu Ternak Sesuai Wireframe */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredList.map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              href={`/ternak/${item.id}`}
              className="group block rounded-3xl border border-slate-200/90 bg-white hover:border-teal-accent/60 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              {/* Gambar / Hero Card Placeholder dengan Tag ID Sesuai Wireframe */}
              <div
                className={`relative w-full h-44 sm:h-52 bg-gradient-to-br ${item.bgGradient} flex items-center justify-center`}
              >
                {/* Badge Tag ID di Pojok Kiri Atas */}
                <span
                  className={`absolute top-4 left-4 text-[11px] font-bold tracking-wider px-3 py-1 rounded-md uppercase font-body text-white shadow-xs ${
                    item.themeColor === "olive"
                      ? "bg-[#799946]"
                      : "bg-[#2e5954]"
                  }`}
                >
                  {item.tagId}
                </span>

                {/* Tag Icon di Tengah Placeholder Sesuai Wireframe */}
                <div className="w-14 h-14 rounded-2xl bg-white/40 backdrop-blur-xs flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Tag
                    className={`w-8 h-8 stroke-[1.8] ${
                      item.themeColor === "olive"
                        ? "text-[#6c873a]"
                        : "text-[#2e5954]"
                    }`}
                  />
                </div>
              </div>

              {/* Detail Info Bawah Sesuai Wireframe */}
              <div className="p-5 sm:p-6 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl text-teal-dark group-hover:text-teal-base transition-colors">
                    {item.name}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-accent group-hover:translate-x-1 transition-all" />
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm font-body text-slate-600 font-semibold">
                  <span>Jenis: {item.breed}</span>
                  <span>Usia: {item.age}</span>
                </div>

                {/* Box Riwayat Berlatar Tipis Sesuai Wireframe */}
                <div className="mt-1 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-body text-slate-600 font-medium leading-relaxed">
                  <span className="font-bold text-[#688a2c]">Riwayat:</span>{" "}
                  {item.history}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Modal Tambah Hewan Ternak */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        className="max-w-lg text-left items-stretch"
      >
        <h2 className="font-display text-2xl text-teal-dark">
          Tambah Hewan Ternak Baru
        </h2>
        <p className="text-xs text-slate-500 font-body mt-1 mb-4">
          Daftarkan hewan ternak ke sistem monitoring kesehatan AniMedix.
        </p>

        <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-teal-dark font-body uppercase tracking-wider mb-1.5">
                Tag ID / Eartag
              </label>
              <Input
                type="text"
                placeholder="Contoh: SP-004"
                value={newTagId}
                onChange={(e) => setNewTagId(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-teal-dark font-body uppercase tracking-wider mb-1.5">
                Nama Panggilan
              </label>
              <Input
                type="text"
                placeholder="Contoh: Si Loreng"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-teal-dark font-body uppercase tracking-wider mb-1.5">
                Kategori
              </label>
              <select
                value={newCategory}
                onChange={(e) =>
                  setNewCategory(e.target.value as "sapi" | "kambing" | "domba")
                }
                className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-body text-teal-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-accent transition-all"
              >
                <option value="sapi">Sapi</option>
                <option value="kambing">Kambing</option>
                <option value="domba">Domba</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-teal-dark font-body uppercase tracking-wider mb-1.5">
                Usia (Tahun)
              </label>
              <Input
                type="text"
                placeholder="Contoh: 2.5"
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-teal-dark font-body uppercase tracking-wider mb-1.5">
              Jenis / Ras Ternak
            </label>
            <Input
              type="text"
              placeholder="Contoh: Limosin Jantan / Etawa Betina"
              value={newBreed}
              onChange={(e) => setNewBreed(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-teal-dark font-body uppercase tracking-wider mb-1.5">
              Riwayat Kesehatan Awal
            </label>
            <textarea
              rows={3}
              placeholder="Catatan riwayat vaksinasi atau kondisi fisik..."
              value={newHistory}
              onChange={(e) => setNewHistory(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-body text-teal-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-accent transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Data Ternak
            </Button>
          </div>
        </form>
      </Modal>

      {/* Status Modal Sukses */}
      <StatusModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        status="success"
        title="Hewan Ternak Berhasil Didaftarkan"
        description="Data hewan ternak telah tersimpan ke dalam sistem pantauan kesehatan AniMedix."
        actionText="Selesai"
      />
    </div>
  );
}
