import Link from "next/link";
import { Users, GraduationCap, Monitor, TrendingUp, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const trainingAreas = [
  "Financial Management & Accounting",
  "Loan Portfolio Management",
  "Governance & Board Leadership",
  "Risk Management",
  "Internal Controls & Compliance",
  "Member Service Excellence",
  "Digital Literacy & Technology",
  "Fraud Prevention & Detection",
];

const trainingApproach = [
  {
    icon: Users,
    title: "Regional Workshops",
    description:
      "We bring credit union staff together for intensive, hands-on training sessions across all 10 regions. These workshops combine theory with practical exercises and peer-to-peer learning.",
  },
  {
    icon: GraduationCap,
    title: "On-Site Coaching",
    description:
      "Our trainers visit individual credit unions to provide tailored coaching. We observe operations, identify skill gaps, and work one-on-one with staff to improve procedures and performance.",
  },
  {
    icon: Monitor,
    title: "Digital Learning",
    description:
      "As part of our digitalization strategy, we are developing online training modules that credit union staff can access anytime, from anywhere — reducing travel costs and expanding our reach.",
  },
];

export default function CapacityBuildingPage() {
  return (
    <>
      <PageHero
        title="Capacity Building"
        subtitle="Equipping credit union staff with essential skills, knowledge, and tools for operational excellence."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services/digitalization" },
          { label: "Capacity Building", href: "/services/capacity-building" },
        ]}
      />

      {/* SECTION 1: OVERVIEW */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="font-display text-2xl font-bold text-primary-900 mb-4">
                Investing in People, Strengthening Institutions
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                CamCCUL offers robust capacity building training for its
                affiliate credit unions, equipping staff with essential
                skills and knowledge to manage their institutions
                effectively. We believe that strong credit unions are built
                by skilled people — from the general manager to the loan
                officer to the teller serving members at the counter.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our training programs cover the full spectrum of credit
                union operations: financial management and accounting, loan
                portfolio management, governance and board responsibilities,
                risk management, internal controls, member services, and
                digital literacy. We deliver training through regional
                workshops, on-site coaching visits, peer learning exchanges,
                and increasingly through digital platforms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Each year, hundreds of credit union staff and board members
                participate in CamCCUL training programs. Our curriculum is
                developed in partnership with regional and international
                experts, aligned with COBAC requirements, and continuously
                updated to address emerging challenges — from cybersecurity
                awareness to climate-smart agricultural lending.
              </p>
            </div>
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                <h3 className="font-semibold mb-3">Training Areas</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {trainingAreas.map((area) => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: OUR TRAINING APPROACH */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader align="center" title="How We Build Capacity" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {trainingApproach.map((item) => (
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

      {/* SECTION 3: IMPACT */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <TrendingUp className="h-16 w-16 text-accent-600 mx-auto mb-6" />
          <h2 className="font-display text-2xl font-bold text-primary-900 mb-4">
            Building a Stronger Cooperative Movement
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600">
            The impact of our capacity building work extends far beyond
            individual credit unions. Better-trained managers make better
            lending decisions. Better-trained boards provide stronger
            governance. Better-trained staff deliver better member service.
            Collectively, this raises the standard of cooperative finance
            across Cameroon — protecting member savings, expanding
            financial inclusion, and building public trust in the credit
            union movement.
          </p>
        </div>
      </section>

      {/* SECTION 4: CTA */}
      <section className="bg-primary-900 text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-4 flex flex-col items-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Interested in Training for Your Credit Union?
          </h2>
          <p className="text-gray-300 mt-4">
            Contact our capacity building team to learn about upcoming
            workshops, request on-site coaching, or discuss customized
            training programs for your affiliate.
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
