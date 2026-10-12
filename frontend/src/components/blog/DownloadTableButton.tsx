"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui";
import { downloadText, toCSV } from "@/lib/download";
import { toast } from "@/store/useToastStore";

interface Props {
  fileName: string;
  head: string[];
  rows: string[][];
  label?: string;
}

/** Unduh tabel artikel sebagai CSV (BOM ditambah supaya Excel membaca UTF-8 dengan benar). */
export default function DownloadTableButton({ fileName, head, rows, label = "Unduh tabel (CSV)" }: Props) {
  return (
    <Button
      type="button"
      variant="primary"
      shape="rounded"
      size="sm"
      leftIcon={<Download className="h-4 w-4" aria-hidden="true" />}
      onClick={() => {
        downloadText(`${fileName}.csv`, "\uFEFF" + toCSV(head, rows), "text/csv;charset=utf-8");
        toast("Tabel berhasil diunduh");
      }}
    >
      {label}
    </Button>
  );
}
