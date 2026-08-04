import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Shield, FileSearch, GraduationCap, Network, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Card } from "@/components/ui/Card";
import { services } from "@/lib/mock-data";

const serviceIcons: Record<string, LucideIcon> = {
  Shield,
  FileSearch,
  GraduationCap,
  Network,
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="CamCCUL supports its 220+ affiliate credit unions through four core services: regulatory supervision, financial auditing, capacity building, and digitalization."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
        ]}
      />

      <section className="bg-white dark:bg-gray-950 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => {
              const Icon = serviceIcons[service.icon] ?? Shield;
              return (
                <Card key={service.href} className="p-8 flex flex-col">
                  <div className="rounded-full p-3 h-12 w-12 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-primary-900 dark:text-white mb-3">
                    {service.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-1">
                    {service.description}
                  </p>
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-200 transition-colors"
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
