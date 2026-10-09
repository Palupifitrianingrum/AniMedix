"use client";

import * as React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { StatCard } from "@/components/ui";
import { MapPin, User, Edit3 } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuthStore();

  const fullName = user?.full_name || "Prabowo Subianto";
  const email = user?.email || "prabowosubianto@gmail.com";
  const address = user?.address || "Bojong Koneng, Babakan Madang, Bogor";

  return (
    <div className="flex flex-col gap-8 w-full">
      <h1 className="font-display text-3xl sm:text-4xl text-teal-dark tracking-tight">
        Public Profile
      </h1>

      {/* Main Profile Card */}
      <div className="bg-surface-card border border-border-hairline rounded-3xl p-6 sm:p-10 shadow-[0_4px_20px_-2px_rgba(19,53,57,0.05)] flex flex-col gap-8">
        <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left Info */}
          <div className="flex flex-col gap-2 max-w-xl">
            <h2 className="font-display text-3xl sm:text-4xl text-teal-dark">
              {fullName}
            </h2>
            <p className="text-sm font-body text-slate-500 font-semibold">
              {email}
            </p>

            <span className="text-xs font-body font-bold text-teal-base mt-1">
              Peternak Kambing Etawa & Domba Garut • Member sejak 2024
            </span>

            <p className="text-xs sm:text-sm font-body text-slate-600 leading-relaxed mt-3">
              Fokus pada pembibitan kambing perah unggul dan penggemukan domba
              dengan metode silase fermentasi pakan mandiri. Berkomitmen menjaga
              standar biosafety dan sanitasi kandang terpadu.
            </p>

            <div className="flex items-center gap-2 text-xs font-body text-slate-500 font-semibold mt-3">
              <MapPin className="w-4 h-4 text-teal-accent" />
              <span>{address}</span>
            </div>
          </div>

          {/* Right Avatar */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-[#2f7560] to-[#739744] flex items-center justify-center text-white text-5xl sm:text-6xl shadow-lg shrink-0">
            <User className="w-16 h-16 sm:w-20 sm:h-20 stroke-[1.8]" />
          </div>
        </div>

        {/* Section Statistik Akun */}
        <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
          <h3 className="font-display text-xl text-teal-dark">
            Statistik Akun
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard
              label="Animals Registered"
              value="12 Ekor"
              variant="teal"
            />
            <StatCard
              label="Scans Done"
              value="48 Kali"
              variant="olive"
            />
            <StatCard
              label="Number of Posts"
              value="19 Post"
              variant="orange"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
