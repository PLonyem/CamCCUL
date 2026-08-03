import { Eye, Monitor, AlertTriangle, Shield } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

const supervisoryAreas = [
  "Capital Adequacy",
  "Liquidity Management",
  "Asset Quality Review",
  "Governance Assessment",
  "Internal Controls Audit",
  "AML/CFT Compliance",
  "Risk Management",
  "Member Protection",
];

const approach = [
  {
    icon: Eye,
    title: "On-Site Inspections",
    description:
      "Our League auditors conduct regular physical visits to every affiliate credit union, verifying financial records, counting cash, reviewing loan files, and assessing operational controls firsthand.",
  },
  {
    icon: Monitor,
    title: "Off-Site Surveillance",
    description:
      "We continuously monitor financial data submitted by affiliates, tracking key indicators like liquidity ratios, non-performing loan levels, and capital adequacy against COBAC thresholds.",
  },
  {
    icon: AlertTriangle,
    title: "Early Warning System",
    description:
      "When an affiliate shows signs of financial stress — declining liquidity, rising defaults, governance weaknesses — we intervene early with corrective measures and enhanced supervision.",
  },
];

export default function RegulatorySupervisionPage() {
  return (
    <>
      <PageHero
        title="Regulatory Supervision"
        subtitle="Ensuring compliance and financial stability across all 220 affiliate credit unions."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services/digitalization" },
          { label: "Regulatory Supervision", href: "/services/regulatory-supervision" },
        ]}
      />

      {/* SECTION 1: OVERVIEW */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="font-display text-2xl font-bold text-primary-900 mb-4">
                Safeguarding Member Savings Through Rigorous Oversight
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                As the apex supervisory body for cooperative credit unions in
                Cameroon, CamCCUL is responsible for ensuring that every
                affiliate operates in compliance with COBAC regulations and
                international best practices. Our supervision framework is
                designed to protect member deposits, maintain financial
                stability, and promote confidence in the cooperative
                financial sector.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Through regular on-site inspections, off-site surveillance,
                and continuous monitoring, we assess the financial health,
                governance structures, and operational integrity of each
                credit union. Early detection of risks allows us to
                intervene before issues escalate, safeguarding both
                individual credit unions and the broader financial
                ecosystem.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our regulatory supervision covers capital adequacy,
                liquidity management, asset quality, governance, internal
                controls, and anti-money laundering compliance. We work
                closely with COBAC and the Ministry of Finance to align our
                supervisory practices with national and regional standards.
              </p>
            </div>
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                <h3 className="font-semibold mb-3">Key Supervisory Areas</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {supervisoryAreas.map((area) => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW WE SUPERVISE */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader align="center" title="Our Supervisory Approach" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {approach.map((item) => (
              <Card key={item.title} className="p-6">
                <div className="rounded-full p-3 h-12 w-12 bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display font-semibold text-lg text-primary-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: COBAC COMPLIANCE */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Shield className="h-16 w-16 text-accent-600 mx-auto mb-6" />
          <h2 className="font-display text-2xl font-bold text-primary-900 mb-4">
            Aligned with COBAC Standards
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600">
            CamCCUL&apos;s supervisory framework is fully aligned with COBAC
            (Commission Bancaire de l&apos;Afrique Centrale) regulations
            governing microfinance institutions in the CEMAC region. Our
            reporting templates, audit procedures, and compliance checklists
            are regularly updated to reflect evolving regulatory
            requirements. This ensures that every CamCCUL-affiliated credit
            union meets the highest standards of financial governance in
            Central Africa.
          </p>
        </div>
      </section>
    </>
  );
}
