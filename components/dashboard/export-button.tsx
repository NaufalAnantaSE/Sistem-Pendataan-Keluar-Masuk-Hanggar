"use client";

import { Button } from "@/components/ui/button";

export function ExportButton() {
  return (
    <Button
      variant="outline"
      onClick={() => {
        window.open("/api/sheet", "_blank");
      }}
    >
      Lihat di Spreadsheet
    </Button>
  );
}
