import Link from "next/link";
import { Building2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <Building2 className="h-20 w-20 text-gray-300 dark:text-gray-700 mx-auto" />
        <p className="font-display text-7xl font-bold text-primary-900 dark:text-white mt-6 tracking-tight">
          404
        </p>
        <h1 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mt-2">
          Page Not Found
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 max-w-sm mx-auto leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have
          been moved. Please check the URL or return to the homepage.
        </p>

        <Link
          href="/"
          className={`${buttonVariants({ variant: "default", size: "lg" })} mt-6`}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
