import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { PrintButton } from "./PrintButton";

export const metadata: Metadata = {
  title: "Credit Union Profile Form — CamCCUL",
  description:
    "Printable form for CamCCUL-affiliated credit unions to submit their profile information.",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold uppercase tracking-wide border-b-2 border-black pb-1 mb-5">
      {children}
    </h2>
  );
}

function FieldRow({ label, optional }: { label: string; optional?: boolean }) {
  return (
    <div className="flex items-end gap-3 py-2.5 border-b border-black/70">
      <span className="text-sm shrink-0 whitespace-nowrap">
        {label}
        {optional && <span className="text-black/60"> (optional)</span>}:
      </span>
      <span className="flex-1" />
    </div>
  );
}

function BlankLines({ label, count }: { label: string; count: number }) {
  return (
    <div className="py-2.5">
      <p className="text-sm mb-3">{label}:</p>
      <div className="space-y-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="border-b border-black/70" />
        ))}
      </div>
    </div>
  );
}

function Checkbox({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <span
        className="inline-block h-4 w-4 border border-black shrink-0"
        aria-hidden="true"
      />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export default function CreditUnionProfileTemplatePage() {
  return (
    <div className="bg-white text-black">
      <div className="max-w-4xl mx-auto px-4 py-8 print:px-0 print:py-0">
        <Link
          href="/resources"
          className="print:hidden inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resources
        </Link>

        <div className="print:hidden flex justify-end mb-6">
          <PrintButton />
        </div>

        {/* HEADER */}
        <header className="flex items-start gap-4 border-b-2 border-black pb-6 mb-8">
          <div className="w-14 h-14 rounded-md ring-1 ring-black/20 flex items-center justify-center overflow-hidden p-1 shrink-0">
            <Image
              src="/logo.jpg"
              alt="CamCCUL logo"
              width={56}
              height={56}
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Credit Union Profile Form</h1>
            <p className="text-sm mt-2 max-w-2xl">
              Please complete all fields for your credit union. This
              information will appear on the CamCCUL website when visitors
              click on your credit union in the Affiliates directory.
            </p>
            <p className="text-xs text-black/60 mt-2">Form Version: August 2026</p>
          </div>
        </header>

        <div className="space-y-10">
          {/* SECTION 1 */}
          <section>
            <SectionTitle>Section 1: Credit Union Information</SectionTitle>
            <FieldRow label="Credit Union Full Name" />
            <FieldRow label="Chapter (e.g., Northwest Chapter, Southwest Chapter)" />
            <FieldRow label="CamCCUL Affiliation Code" />
            <FieldRow label="Year Founded" />
            <FieldRow label="Physical Address" />
            <FieldRow label="City/Town" />
          </section>

          {/* SECTION 2 */}
          <section>
            <SectionTitle>Section 2: Contact Information</SectionTitle>
            <FieldRow label="Primary Phone Number" />
            <FieldRow label="Secondary Phone Number" optional />
            <FieldRow label="Email Address" />
            <FieldRow label="Website" optional />
          </section>

          {/* SECTION 3 */}
          <section>
            <SectionTitle>Section 3: Credit Union Profile</SectionTitle>
            <BlankLines label="Brief History of the Credit Union (500 words max)" count={15} />
            <FieldRow label="Current Number of Members" />

            <div className="py-2.5">
              <p className="text-sm mb-2">Services Offered (tick all that apply):</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <Checkbox label="Savings Accounts" />
                <Checkbox label="Loans (Personal)" />
                <Checkbox label="Loans (Business)" />
                <Checkbox label="Loans (Agricultural)" />
                <Checkbox label="Money Transfers" />
                <Checkbox label="Mobile Banking" />
                <Checkbox label="Financial Education" />
              </div>
              <div className="flex items-end gap-3 pt-1.5">
                <span
                  className="inline-block h-4 w-4 border border-black shrink-0"
                  aria-hidden="true"
                />
                <span className="text-sm shrink-0">Other:</span>
                <span className="flex-1 border-b border-black/70" />
              </div>
            </div>
          </section>

          {/* SECTION 4 */}
          <section>
            <SectionTitle>Section 4: Leadership</SectionTitle>
            <FieldRow label="Board Chairperson Name" />
            <FieldRow label="General Manager Name" />
            <FieldRow label="Number of Board Members" />
            <FieldRow label="Number of Staff" />
          </section>

          {/* SECTION 5 */}
          <section className="break-inside-avoid">
            <SectionTitle>Section 5: Declaration</SectionTitle>
            <p className="text-sm mb-4">
              I certify that the information provided above is accurate and
              complete.
            </p>
            <FieldRow label="Name of Person Completing Form" />
            <FieldRow label="Position" />
            <FieldRow label="Date" />
            <FieldRow label="Signature" />
          </section>
        </div>

        {/* FOOTER */}
        <footer className="border-t-2 border-black mt-10 pt-4 text-xs text-black/70 space-y-1">
          <p>
            Completed forms should be uploaded via the CamCCUL website or
            emailed to info@camccul.cm
          </p>
          <p>For assistance, call +237 233 36 11 82</p>
        </footer>
      </div>
    </div>
  );
}
