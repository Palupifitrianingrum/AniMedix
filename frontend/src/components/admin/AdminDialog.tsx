"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Bubble } from "./AdminUI";

export interface AdminDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  sub?: string;
  avatar?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

/** Dialog detail portal admin, dibangun di atas <Modal> dari components/ui. */
export default function AdminDialog({ isOpen, onClose, title, sub, avatar, children, actions }: AdminDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-h-[90vh] max-w-2xl items-stretch overflow-y-auto p-6 text-left sm:p-7">
      <div role="dialog" aria-modal="true" aria-label={title} className="flex flex-col gap-4">
        <div className="flex items-start gap-3 pr-10">
          {avatar && <Bubble text={avatar} size="lg" />}
          <div>
            <h3 className="font-display text-2xl leading-tight text-teal-dark">{title}</h3>
            {sub && <p className="text-sm text-slate-500">{sub}</p>}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-border-hairline text-slate-500 hover:bg-slate-50 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
        {actions && <div className="flex flex-wrap justify-end gap-2 pt-1">{actions}</div>}
      </div>
    </Modal>
  );
}
