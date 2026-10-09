"use client";

import * as React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { StatCard, Button, Input, Modal, StatusModal } from "@/components/ui";
import { MapPin, User, Edit3, CheckCircle2, ShieldCheck, Calendar, Phone } from "lucide-react";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();

  const [fullName, setFullName] = React.useState(
    user?.full_name || "Prabowo Subianto"
  );
  const [email, setEmail] = React.useState(
    user?.email || "prabowosubianto@gmail.com"
  );
  const [phone, setPhone] = React.useState(
    user?.phone || "+62 812-3456-7890"
  );
  const [address, setAddress] = React.useState(
    user?.address || "Bojong Koneng, Babakan Madang, Bogor"
  );
  const [bio, setBio] = React.useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In et mollis mauris. Ut vehicula, nisl sit amet tincidunt sodales, velit ipsum rhoncus dolor, at egestas sapien elit in orci. Donec ac elit egestas, commodo orci nec, convallis eros. Mauris vel tellus nec felis ornare imperdiet. Aenean porta quis nunc vitae tincidunt. Maecenas eget ipsum orci. Morbi sed varius odio. Aliquam faucibus nisl at est congue pretium. Nulla facilisi. Nam mollis lectus nunc, id commodo enim luctus at. Nullam massa elit, faucibus in eros ac, euismod gravida enim. Phasellus nisl lorem, fringilla vitae bibendum quis, vulputate ac lorem. Nam vehicula consectetur est eget volutpat. Vivamus elementum, sem ac fringilla sollicitudin, ex quam blandit tortor, in efficitur risus eros ultrices tellus. Donec vel nulla eu sem varius commodo. Etiam placerat augue ac lacus convallis aliquam."
  );

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editName, setEditName] = React.useState(fullName);
  const [editPhone, setEditPhone] = React.useState(phone);
  const [editAddress, setEditAddress] = React.useState(address);
  const [editBio, setEditBio] = React.useState(bio);

  // Status Modal
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);

  // Sync if user in store changes
  React.useEffect(() => {
    if (user?.full_name) setFullName(user.full_name);
    if (user?.email) setEmail(user.email);
    if (user?.phone) setPhone(user.phone);
    if (user?.address) setAddress(user.address);
  }, [user]);

  const handleOpenEdit = () => {
    setEditName(fullName);
    setEditPhone(phone);
    setEditAddress(address);
    setEditBio(bio);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setFullName(editName);
    setPhone(editPhone);
    setAddress(editAddress);
    setBio(editBio);

    if (user) {
      setUser({
        ...user,
        full_name: editName,
        phone: editPhone,
        address: editAddress,
      });
    }

    setIsEditModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Page Title (Sesuai Wireframe Profile.png) */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl sm:text-5xl text-teal-dark tracking-tight">
          Public Profile
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenEdit}
          className="flex items-center gap-2 rounded-2xl border-slate-300 hover:border-teal-accent hover:text-teal-dark"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </Button>
      </div>

      {/* Main Profile Card (Sesuai Wireframe Profile.png) */}
      <div className="bg-surface-card border border-border-hairline rounded-3xl p-6 sm:p-10 lg:p-12 shadow-[0_4px_24px_-2px_rgba(19,53,57,0.06)] flex flex-col">
        {/* Top Section: Farmer Info + Big Avatar */}
        <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-12">
          {/* Left: Detail Profile Info */}
          <div className="flex flex-col flex-1 text-left">
            {/* Full Name */}
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-teal-dark tracking-tight leading-tight">
              {fullName}
            </h2>

            {/* Email Address */}
            <p className="text-sm sm:text-base font-body text-slate-500 font-semibold mt-1">
              {email}
            </p>

            {/* Subheading / Specialization */}
            <p className="text-xs sm:text-sm font-body font-bold text-[#688a2c] mt-3">
              Peternak Kambing Etawa &amp; Domba Garut • Member sejak 2024
            </p>

            {/* Bio Description (Sesuai Wireframe) */}
            <p className="text-xs sm:text-sm font-body text-slate-700 leading-relaxed mt-4 font-normal text-justify">
              “{bio}”
            </p>

            {/* Location & Extra Info */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 pt-4 border-t border-slate-100 text-xs sm:text-sm font-body text-slate-600 font-semibold">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-accent shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Terverifikasi</span>
              </div>
            </div>
          </div>

          {/* Right: Big Circular Gradient Avatar (Sesuai Wireframe) */}
          <div className="shrink-0 flex items-center justify-center">
            <div className="w-44 h-44 sm:w-52 sm:h-52 lg:w-60 lg:h-60 rounded-full bg-gradient-to-br from-[#276452] via-[#35755b] to-[#688c3a] flex items-center justify-center text-white shadow-xl ring-8 ring-[#276452]/5 transition-transform hover:scale-105 duration-300">
              <User className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 stroke-[1.5]" />
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="w-full h-px bg-slate-100 my-8 sm:my-10" />

        {/* Bottom Section: Statistik Akun (Sesuai Wireframe Profile.png) */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display text-xl sm:text-2xl text-teal-dark">
            Statistik Akun
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1: Animals Registered */}
            <StatCard
              label="ANIMALS REGISTERED"
              value="12 Ekor"
              variant="teal"
            />

            {/* Card 2: Scans Done */}
            <StatCard
              label="SCANS DONE"
              value="48 Kali"
              variant="olive"
            />

            {/* Card 3: Number of Posts */}
            <StatCard
              label="NUMBER OF POSTS"
              value="19 Post"
              variant="orange"
            />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="max-w-lg text-left items-stretch"
      >
        <h2 className="font-display text-2xl text-teal-dark">
          Edit Profil Peternak
        </h2>
        <p className="text-xs text-slate-500 font-body mt-1 mb-4">
          Perbarui informasi publik dan kontak peternakan Anda.
        </p>

        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-teal-dark font-body uppercase tracking-wider mb-1.5">
              Nama Lengkap
            </label>
            <Input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-teal-dark font-body uppercase tracking-wider mb-1.5">
              Nomor Telepon / WhatsApp
            </label>
            <Input
              type="text"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-teal-dark font-body uppercase tracking-wider mb-1.5">
              Alamat Peternakan
            </label>
            <Input
              type="text"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-teal-dark font-body uppercase tracking-wider mb-1.5">
              Deskripsi / Bio Peternak
            </label>
            <textarea
              rows={4}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-body text-teal-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-accent transition-all resize-none"
              placeholder="Ceritakan pengalaman atau fokus ternak Anda..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Success Modal Feedback */}
      <StatusModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        status="success"
        title="Profil Berhasil Diperbarui"
        description="Informasi profil publik Anda telah berhasil disimpan dan diperbarui."
        actionText="Selesai"
      />
    </div>
  );
}
