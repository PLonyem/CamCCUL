"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { contactInfo } from "@/lib/mock-data";
import { useLanguage } from "@/context/LanguageContext";
import { localize } from "@/lib/i18n";

const HQ_ADDRESS = "Commercial Avenue, Bamenda";
const HQ_PHONE_DISPLAY = "+237 233 36 11 82";
const HQ_PHONE_TEL = "tel:+237233361182";

export function UtilityBar() {
  const { language } = useLanguage();

  return (
    <div className="w-full bg-primary-900 text-white h-10">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between text-xs">
        <div className="flex items-center gap-6">
          <span className="hidden md:flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {HQ_ADDRESS}
          </span>
          <a
            href={HQ_PHONE_TEL}
            className="flex items-center gap-1.5 hover:underline"
          >
            <Phone className="h-3.5 w-3.5 shrink-0" />
            {HQ_PHONE_DISPLAY}
          </a>
          <a
            href={`mailto:${contactInfo.email}`}
            className="flex items-center gap-1.5 hover:underline"
          >
            <Mail className="h-3.5 w-3.5 shrink-0" />
            {contactInfo.email}
          </a>
          <span className="hidden md:flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {localize(contactInfo.officeHours, language)}
          </span>
        </div>
      </div>
    </div>
  );
}
