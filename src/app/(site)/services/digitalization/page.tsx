import Link from "next/link";
import { ArrowRight, Clock, Shield, TrendingUp } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { ComingSoonButton } from "@/components/ui/ComingSoonButton";
import { cn } from "@/lib/utils";

const whyItMatters = [
  {
    icon: Clock,
    title: "Faster Reporting",
    description:
      "Credit union managers currently spend days preparing paper reports. Digital submission reduces this to hours, freeing time to serve members.",
  },
  {
    icon: Shield,
    title: "Better Oversight",
    description:
      "Automated validation and real-time dashboards help League auditors identify risks early, protecting member savings across all 220 affiliates.",
  },
  {
    icon: TrendingUp,
    title: "Stronger Credit Unions",
    description:
      "When operations run smoothly, credit unions can focus on growth — reaching more farmers, traders, and families with affordable financial services.",
  },
];

export default function DigitalizationPage() {
  return (
    <>
      <PageHero
        title="Digitalization of Credit Unions"
        subtitle="Transforming operations and service delivery through innovative technology across all 220 affiliate credit unions."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services/digitalization" },
          { label: "Digitalization", href: "/services/digitalization" },
        ]}
      />

      {/* SECTION 1: THE COMMITMENT */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <blockquote className="border-l-4 border-accent-500 bg-accent-50 rounded-r-lg p-6 mb-8 italic text-lg text-gray-700">
            &ldquo;CamCCUL is spearheading the digitalization of its affiliate
            credit unions, streamlining operations and enhancing delivery
            through innovative technology.&rdquo;
          </blockquote>
          <p className="text-sm text-gray-500 mb-8">
            — CamCCUL Services Charter
          </p>
          <p className="text-gray-700 leading-relaxed">
            This commitment is not just a statement. It is a multi-phase
            transformation program designed to bring every credit union —
            from Bamenda to Maroua — into the digital age. Our goal is
            simple: faster reporting, better oversight, and stronger credit
            unions serving millions of Cameroonians.
          </p>
        </div>
      </section>

      {/* SECTION 2: OUR DIGITALIZATION PHASES */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            align="center"
            title="The Roadmap"
            subtitle="A phased approach to transforming Cameroon's cooperative finance sector."
          />

          <div className="mt-12 max-w-4xl mx-auto px-4">
            {/* PHASE 1 */}
            <div className="border-l-4 border-green-500 bg-white rounded-r-xl p-6 mb-6 shadow-sm">
              <Badge className="bg-green-100 text-green-700">LIVE</Badge>
              <h3 className="font-display text-xl font-bold text-primary-900 mt-3">
                Phase 1 — Digital Presence
              </h3>
              <p className="text-gray-600 mt-2">
                A modern, responsive public website serving as the digital
                face of the League. Features include:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-gray-600 list-disc list-inside">
                <li>
                  Searchable directory of all 220+ affiliate credit unions
                  across all 10 regions
                </li>
                <li>
                  Downloadable COBAC templates, circulars, and training
                  materials
                </li>
                <li>
                  Real-time news and announcements for the cooperative
                  community
                </li>
                <li>
                  Mobile-friendly design accessible to credit union managers
                  in the field
                </li>
              </ul>
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 mt-4"
              >
                Explore the Website
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* PHASE 2 */}
            <div className="border-l-4 border-amber-500 bg-white rounded-r-xl p-6 mb-6 shadow-sm">
              <Badge className="bg-amber-100 text-amber-700">
                IN DEVELOPMENT
              </Badge>
              <h3 className="font-display text-xl font-bold text-primary-900 mt-3">
                Phase 2 — COBAC Reporting Portal
              </h3>
              <p className="text-gray-600 mt-2">
                A secure, automated reporting system that will transform how
                credit unions submit financial data:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-gray-600 list-disc list-inside">
                <li>
                  Guided multi-step COBAC report submission with built-in
                  validation
                </li>
                <li>
                  AI-powered math verification to catch errors before auditor
                  review
                </li>
                <li>
                  Real-time dashboards showing compliance status across all
                  affiliates
                </li>
                <li>
                  Immutable audit trails and anomaly detection for financial
                  integrity
                </li>
              </ul>
              <ComingSoonButton className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 mt-4">
                Learn About the Portal
                <ArrowRight className="h-4 w-4" />
              </ComingSoonButton>
            </div>

            {/* PHASE 3 */}
            <div className="border-l-4 border-gray-300 bg-white rounded-r-xl p-6 mb-6 shadow-sm">
              <Badge className="bg-gray-100 text-gray-600">PLANNED</Badge>
              <h3 className="font-display text-xl font-bold text-primary-900 mt-3">
                Phase 3 — Mobile &amp; Field Services
              </h3>
              <p className="text-gray-600 mt-2">
                Extending digital access to the most remote credit unions and
                field auditors:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-gray-600 list-disc list-inside">
                <li>
                  Mobile app for credit union managers to submit reports from
                  any location
                </li>
                <li>
                  USSD-based access for areas with limited internet
                  connectivity
                </li>
                <li>
                  Digital field audit tools with GPS verification and
                  real-time evidence capture
                </li>
                <li>
                  Integrated document management system for all League
                  records
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHY DIGITALIZATION MATTERS */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeader
            align="center"
            title="Why It Matters"
            subtitle="Digitalization is not just about technology — it's about people."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {whyItMatters.map((item) => (
              <Card key={item.title} className="p-8">
                <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-primary-700 dark:text-primary-300" />
                </div>
                <h3 className="font-display font-semibold text-lg text-primary-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CTA */}
      <section className="bg-primary-900 text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-4 flex flex-col items-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Partner With Us
          </h2>
          <p className="text-gray-300 mt-4">
            Interested in supporting the digitalization of Cameroon&apos;s
            cooperative credit union sector? We welcome partnerships with
            development organizations, technology providers, and financial
            inclusion advocates.
          </p>
          <Link
            href="/contact"
            className={cn(buttonVariants({ variant: "accent", size: "lg" }), "mt-8")}
          >
            Contact Us
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
