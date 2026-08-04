import { ClipboardCheck, FileSearch, FileText, Building2 } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

const auditCoverage = [
  "Financial Statement Audit",
  "Loan Portfolio Review",
  "Asset Verification",
  "Internal Controls Testing",
  "Cash Count Verification",
  "Member Share Reconciliation",
  "Income & Expense Analysis",
  "Regulatory Compliance Check",
];

const methodology = [
  {
    icon: ClipboardCheck,
    title: "Risk-Based Auditing",
    description:
      "We prioritize audit resources based on risk profiles. Credit unions with larger portfolios, past compliance issues, or rapid growth receive more frequent and intensive audits to catch problems early.",
  },
  {
    icon: FileSearch,
    title: "Comprehensive Review",
    description:
      "Every audit covers financial statements, loan documentation, cash management, member records, governance minutes, and internal policies. Nothing is taken at face value — we verify everything independently.",
  },
  {
    icon: FileText,
    title: "Actionable Reporting",
    description:
      "Our audit reports don't just identify problems — they provide clear, practical recommendations. We work with credit union management to develop remediation plans and track implementation through follow-up reviews.",
  },
];

export default function FinancialAuditingPage() {
  return (
    <>
      <PageHero
        title="Financial Auditing"
        subtitle="Independent, rigorous audits ensuring transparency and accountability across all affiliate credit unions."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Financial Auditing", href: "/services/financial-auditing" },
        ]}
      />

      {/* SECTION 1: OVERVIEW */}
      <section className="bg-white dark:bg-gray-950 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="font-display text-2xl font-bold text-primary-900 dark:text-white mb-4">
                Transparency You Can Trust
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Financial auditing is the cornerstone of trust in the
                cooperative credit union movement. At CamCCUL, our audit
                team conducts thorough, independent examinations of every
                affiliate&apos;s financial statements, internal controls,
                and operational procedures. Our audits provide assurance to
                members, regulators, and partners that credit union funds
                are managed responsibly and transparently.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We go beyond checking numbers. Our auditors assess the
                quality of loan portfolios, verify the existence and
                valuation of assets, test internal control environments, and
                evaluate compliance with both COBAC regulations and each
                credit union&apos;s own policies. Every audit concludes with
                actionable recommendations for improvement.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Our audit cycle includes annual statutory audits for all
                affiliates, quarterly reviews for higher-risk institutions,
                and special investigations when irregularities are
                suspected. We maintain a risk-based approach — allocating
                more audit resources to credit unions with larger asset
                bases, complex operations, or identified vulnerabilities.
              </p>
            </div>
            <div className="md:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Audit Coverage</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {auditCoverage.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: OUR AUDIT METHODOLOGY */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader align="center" title="How We Audit" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {methodology.map((item) => (
              <Card key={item.title} className="p-6">
                <div className="rounded-full p-3 h-12 w-12 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display font-semibold text-lg text-primary-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: STRENGTHENING CREDIT UNIONS */}
      <section className="bg-white dark:bg-gray-950 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Building2 className="h-16 w-16 text-primary-600 dark:text-primary-400 mx-auto mb-6" />
          <h2 className="font-display text-2xl font-bold text-primary-900 dark:text-white mb-4">
            Audits That Build, Not Just Inspect
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            Our philosophy is that audits should strengthen credit unions,
            not just critique them. We partner with affiliate management to
            identify weaknesses before they become crises, share best
            practices observed across the network, and provide training on
            common audit findings. The result: more resilient credit
            unions, better protected member savings, and a stronger
            cooperative financial sector for Cameroon.
          </p>
        </div>
      </section>
    </>
  );
}
