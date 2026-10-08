"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Button from "./Button";
import { Check, X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Dialog Body */}
      <div
        className={cn(
          "relative z-10 w-full max-w-sm rounded-3xl bg-surface-card p-8 shadow-2xl transition-all duration-200 transform scale-100 text-center flex flex-col items-center",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* Modal Status Presets (Frame 2.png & Frame 3.png) */
export interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "success" | "error";
  title: string;
  description: string;
  actionText: string;
  onAction?: () => void;
}

export function StatusModal({
  isOpen,
  onClose,
  status,
  title,
  description,
  actionText,
  onAction,
}: StatusModalProps) {
  const isSuccess = status === "success";

  const handleAction = () => {
    if (onAction) onAction();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center mb-6">
        {isSuccess ? (
          <Check className="w-14 h-14 text-emerald-500 stroke-[3.5]" />
        ) : (
          <X className="w-14 h-14 text-rose-500 stroke-[3.5]" />
        )}
      </div>

      <h3 className="font-display text-2xl text-teal-dark mb-3 tracking-tight">
        {title}
      </h3>
      <p className="font-body text-slate-600 text-base mb-8 max-w-xs leading-relaxed">
        {description}
      </p>

      <Button
        variant="primary"
        shape="rounded"
        className="w-full py-3 text-base"
        onClick={handleAction}
      >
        {actionText}
      </Button>
    </Modal>
  );
}

/* Confirmation Modal Preset (Log out Confirmation.png) */
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = true,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="font-display text-2xl text-teal-dark mb-3 tracking-tight">
        {title}
      </h3>
      <p className="font-body text-slate-600 text-sm mb-8 leading-relaxed">
        {description}
      </p>

      <div className="grid grid-cols-2 gap-3 w-full">
        <Button
          variant="outline"
          shape="rounded"
          onClick={onClose}
          className="w-full"
        >
          {cancelText}
        </Button>
        <Button
          variant={isDestructive ? "danger" : "primary"}
          shape="rounded"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="w-full"
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}

export default Modal;
