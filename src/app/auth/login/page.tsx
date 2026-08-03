import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ArrowRight, Clock, Shield } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reporting Portal — Coming Soon | CamCCUL",
  description: "The CamCCUL secure reporting portal is coming soon.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 text-center mx-auto">
        <Building2 className="h-14 w-14 text-white bg-primary-500 rounded-xl p-3 mx-auto" />
        <p className="font-display font-bold text-2xl text-primary-900 dark:text-white mt-4">
          CamCCUL
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Cameroon Cooperative Credit Union League
        </p>

        <div className="border-t border-gray-200 dark:border-gray-800 my-6" />

        <Badge className="bg-amber-100 text-amber-700 mb-3">
          <Clock className="h-3 w-3 mr-1" />
          Coming Soon
        </Badge>

        <h1 className="font-display text-xl font-bold text-primary-900 dark:text-white">
          Reporting Portal &amp; Report Submission
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
          Secure, COBAC-compliant portal login and report submission for
          affiliate credit unions are currently in development as part of
          our Phase 2 digitalization roadmap. This feature isn&apos;t
          available yet — check back soon.
        </p>

        <Link
          href="/services/digitalization"
          className={cn(buttonVariants({ variant: "accent", size: "lg" }), "mt-6 w-full sm:w-auto")}
        >
          View the Digitalization Roadmap
          <ArrowRight className="h-5 w-5" />
        </Link>

        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <p className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Shield className="h-4 w-4 inline text-accent-600 dark:text-accent-400" />
            COBAC Compliant • Secure Connection
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Have questions in the meantime?{" "}
            <Link href="/contact" className="underline hover:text-gray-600 dark:hover:text-gray-300">
              Contact CamCCUL
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
