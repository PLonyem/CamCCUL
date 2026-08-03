"use client";

import { Fragment, useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { cn } from "@/lib/utils";

const faqSections: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "About CamCCUL",
    items: [
      {
        q: "What is CamCCUL?",
        a: "The Cameroon Cooperative Credit Union League (CamCCUL) is the apex supervisory and representative body for cooperative credit unions in Cameroon. Founded in 1968 and headquartered in Bamenda, Northwest Region, CamCCUL oversees more than 220 affiliate credit unions spread across all 10 regions of the country. We are regulated by COBAC (Commission Bancaire de l'Afrique Centrale) and operate under the supervision of Cameroon's Ministry of Finance. Our core mandate is to ensure the safety, soundness, and sustainable growth of the cooperative financial sector while protecting the interests of millions of credit union members nationwide.",
      },
      {
        q: "Who can join CamCCUL?",
        a: "Membership in CamCCUL is open to registered cooperative credit unions operating in Cameroon. Individual persons cannot join CamCCUL directly — rather, individuals join one of our 220+ affiliate credit unions. To become a CamCCUL affiliate, a credit union must be legally registered, demonstrate sound governance and financial management, and commit to complying with COBAC regulations and CamCCUL's supervisory standards. Credit unions interested in affiliation should contact our headquarters in Bamenda for an application package and initial assessment.",
      },
      {
        q: "What services does CamCCUL offer?",
        a: "CamCCUL provides four core services to its affiliate credit unions. First, Regulatory Supervision — ongoing monitoring of financial health, governance, and COBAC compliance across all affiliates. Second, Financial Auditing — annual statutory audits, risk-based examinations, and special investigations to ensure transparency and accountability. Third, Capacity Building — robust training programs equipping credit union staff and board members with essential skills in financial management, governance, risk management, and member service. Fourth, Digitalization — spearheading the technological transformation of affiliate operations, from our new digital platform to the upcoming COBAC Reporting Portal. We also represent the interests of credit unions in national and regional policy discussions.",
      },
      {
        q: "How can I open an account with CamCCUL?",
        a: "CamCCUL is not a bank or a deposit-taking institution — we are a regulatory and support body. Individuals cannot open accounts with CamCCUL directly. To open a savings account, apply for a loan, or access other financial services, you should visit any CamCCUL-affiliated credit union near you. Use our Affiliates Directory to find a credit union in your region. Credit union membership typically requires identification, a small membership fee, and the purchase of at least one share. Staff at your local credit union will guide you through the process.",
      },
    ],
  },
  {
    title: "About Credit Unions",
    items: [
      {
        q: "What is a credit union and how is it different from a bank?",
        a: "A credit union is a member-owned, not-for-profit financial cooperative. Unlike banks, which are owned by shareholders seeking profit, credit unions are owned by their members — the people who save and borrow with them. Every member has one vote in electing the board of directors, regardless of how much they have saved. Profits are returned to members through better interest rates on savings, lower rates on loans, and fewer fees. Credit unions typically serve a specific community, profession, or association — such as farmers, teachers, or residents of a particular area.",
      },
      {
        q: "How do I find a credit union near me?",
        a: "Visit our Affiliates Directory page on this website. Select your region from the dropdown menu to see all CamCCUL-affiliated credit unions in your area, complete with contact information. We have credit unions in all 10 regions of Cameroon — from Bamenda in the Northwest to Maroua in the Far North.",
      },
      {
        q: "Is my money safe in a credit union?",
        a: "Yes. CamCCUL-affiliated credit unions operate under strict COBAC regulations and are subject to regular audits and supervision by our team of professional auditors. We monitor key financial indicators — including liquidity, loan quality, and capital adequacy — and intervene early when problems are detected. While Cameroon does not currently have a national deposit insurance scheme for credit unions, CamCCUL's rigorous supervision is designed to protect member savings by ensuring credit unions are well-managed and financially sound.",
      },
    ],
  },
  {
    title: "Reporting and Compliance",
    items: [
      {
        q: "How do credit unions submit financial reports?",
        a: "Affiliate credit unions currently submit periodic financial reports to CamCCUL following COBAC reporting standards. Reporting templates and deadlines are available on our Resources page. CamCCUL is developing a digital COBAC Reporting Portal — part of our digitalization roadmap — that will allow credit unions to submit reports online with built-in validation, AI-powered error detection, and real-time compliance tracking. This will significantly reduce processing time and improve accuracy.",
      },
      {
        q: "What are the key COBAC requirements for credit unions?",
        a: "COBAC requires all microfinance institutions, including credit unions, to maintain minimum prudential standards. Key requirements include: a liquidity ratio of at least 100% (meaning liquid assets must cover all short-term deposit obligations), a non-performing loan ratio not exceeding 5% of the total loan portfolio, and a capital adequacy ratio of at least 8%. CamCCUL helps affiliates understand, monitor, and meet these requirements through training, supervision, and regular reporting.",
      },
    ],
  },
  {
    title: "CamCCUL's Work",
    items: [
      {
        q: "How often does CamCCUL audit its affiliate credit unions?",
        a: "Every affiliate credit union undergoes an annual statutory audit. Additionally, CamCCUL applies a risk-based approach — credit unions with larger asset bases, past compliance issues, or rapid growth may be audited more frequently, including quarterly reviews or special investigations. Our audit team conducts both desk-based reviews and on-site field visits to verify financial records, count cash, examine loan files, and assess internal controls.",
      },
      {
        q: "What training does CamCCUL provide?",
        a: "CamCCUL offers robust capacity building training for its affiliate credit unions, equipping staff and board members with essential skills and knowledge. Training areas include financial management and accounting, loan portfolio management, governance and board responsibilities, risk management, internal controls, member service excellence, and digital literacy. Training is delivered through regional workshops across all 10 regions, on-site coaching visits to individual credit unions, and increasingly through digital learning platforms as part of our digitalization strategy.",
      },
    ],
  },
  {
    title: "Digitalization",
    items: [
      {
        q: "What is CamCCUL doing about digitalization?",
        a: "CamCCUL is spearheading the digitalization of its affiliate credit unions, streamlining operations and enhancing service delivery through innovative technology. Our digitalization roadmap has three phases: Phase 1 — this modern public website with affiliate directory, digital resources, and news (now live); Phase 2 — a secure COBAC Reporting Portal for online report submission with AI-powered validation (in development); and Phase 3 — mobile services, digital field audit tools, and a comprehensive document management system (planned).",
      },
    ],
  },
  {
    title: "Getting in Touch",
    items: [
      {
        q: "How can I contact CamCCUL?",
        a: "Visit our Contact page for our full contact details. Our headquarters is located on Commercial Avenue in Bamenda, Northwest Region, Cameroon. You can also reach us by phone or email. We maintain regional offices across the country. Our office hours are Monday through Friday, 8:00 AM to 5:00 PM.",
      },
      {
        q: "How can my credit union become a CamCCUL affiliate?",
        a: "Credit unions interested in CamCCUL affiliation should contact our headquarters for an application package. The process involves a review of your credit union's registration, governance structure, financial condition, and operational policies. Our membership team will guide you through the requirements and conduct an initial assessment visit.",
      },
      {
        q: "Can international organizations partner with CamCCUL?",
        a: "Yes. CamCCUL welcomes partnerships with development organizations, government agencies, foundations, and technology providers who share our mission of strengthening cooperative finance in Cameroon. Partnership areas include capacity building, digital transformation, financial inclusion initiatives, and research. Please contact us through our Contact page with details about your organization and proposed collaboration.",
      },
    ],
  },
];

let runningTotal = 0;
const sectionsWithOffsets = faqSections.map((section) => {
  const startIndex = runningTotal;
  runningTotal += section.items.length;
  return { ...section, startIndex };
});

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about CamCCUL, credit unions, and our services."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "FAQ", href: "/faq" },
        ]}
      />

      <section className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4">
          {sectionsWithOffsets.map((section) => (
            <Fragment key={section.title}>
              <h2 className="text-lg font-display font-bold text-primary-900 mt-12 mb-4 first:mt-0">
                {section.title}
              </h2>
              {section.items.map((item, itemIdx) => {
                const index = section.startIndex + itemIdx;
                const isOpen = openIndex === index;
                return (
                  <div key={item.q}>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="w-full text-left flex items-center justify-between py-5 px-6 bg-white border border-gray-200 rounded-xl mb-3 hover:border-primary-300 transition-colors shadow-sm"
                    >
                      <span className="font-semibold text-primary-900 pr-8">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-gray-400 shrink-0 transition-transform duration-200",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className="bg-white border-x border-b border-gray-200 rounded-b-xl px-6 pb-5 -mt-3 pt-5 text-gray-600 leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </section>
    </>
  );
}
