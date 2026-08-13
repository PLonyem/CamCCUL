"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PrintButton() {
  return (
    <Button
      type="button"
      onClick={() => window.print()}
      className="print:hidden"
    >
      <Download className="h-4 w-4" />
      Download as PDF
    </Button>
  );
}
