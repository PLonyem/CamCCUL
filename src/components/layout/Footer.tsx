import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { contactInfo } from "@/lib/mock-data";
import { ComingSoonButton } from "@/components/ui/ComingSoonButton";
import logo from "../../../public/logo.jpg";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services/digitalization" },
  { label: "Affiliates", href: "/affiliates" },
  { label: "Resources", href: "/resources" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

const resourceLinks = [
  { label: "COBAC Regulations", href: "/resources" },
  { label: "Reporting Templates", href: "/resources" },
  { label: "Training Materials", href: "/resources" },
  { label: "FAQ", href: "/faq" },
  { label: "Portal Support", href: "/auth/login" },
];

export function Footer() {
  return (
    <footer className="bg-primary-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-md bg-white flex items-center justify-center overflow-hidden p-1 shrink-0">
                <Image src={logo} alt="CamCCUL logo" className="h-full w-full object-contain" />
              </div>
              <span className="font-display font-bold text-lg">CamCCUL</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Cameroon Cooperative Credit Union League
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Supervising and empowering cooperative credit unions across
              Cameroon since 1968.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-gray-400 hover:text-white transition-colors block mb-2"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Resources
            </h3>
            {resourceLinks.map((link) =>
              link.label === "Portal Support" ? (
                <ComingSoonButton
                  key={link.label}
                  className="text-sm text-gray-400 hover:text-white transition-colors block mb-2 text-left"
                >
                  {link.label}
                </ComingSoonButton>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors block mb-2"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <div className="flex items-start gap-2 text-sm text-gray-400 mb-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{contactInfo.address}</span>
            </div>
            <p className="text-sm text-gray-400 mb-2">{contactInfo.phone}</p>
            <p className="text-sm text-gray-400">{contactInfo.email}</p>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
          <p>&copy; 2026 CamCCUL. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/security" className="hover:text-white transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
