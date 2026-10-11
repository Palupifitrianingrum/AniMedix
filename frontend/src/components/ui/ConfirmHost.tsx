"use client";

import * as React from "react";
import { ConfirmModal } from "./Modal";
import { useConfirmStore } from "@/store/useConfirmStore";

/** Pasang sekali di layout, lalu panggil confirmDialog({...}) dari mana saja. */
export default function ConfirmHost() {
  const { options, settle } = useConfirmStore();
  const confirmed = React.useRef(false);

  return (
    <ConfirmModal
      isOpen={!!options}
      title={options?.title ?? ""}
      description={options?.description ?? ""}
      confirmText={options?.confirmText ?? "Ya, lanjutkan"}
      cancelText={options?.cancelText ?? "Batal"}
      isDestructive={options?.isDestructive ?? false}
      onConfirm={() => {
        confirmed.current = true;
        settle(true);
      }}
      onClose={() => {
        // ConfirmModal memanggil onClose setelah onConfirm, abaikan yang itu.
        if (confirmed.current) {
          confirmed.current = false;
          return;
        }
        settle(false);
      }}
    />
  );
}
