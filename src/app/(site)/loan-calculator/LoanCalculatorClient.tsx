"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Calculator,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

const REPAYMENT_TERMS = [6, 12, 18, 24, 36, 48] as const;

const CHAPTERS = [
  "Adamawa Chapter",
  "Centre Chapter",
  "East Chapter",
  "Far North Chapter",
  "Littoral Chapter",
  "North Chapter",
  "Northwest Chapter",
  "South Chapter",
  "Southwest Chapter",
  "West Chapter",
] as const;

interface PublicCreditUnion {
  id: string;
  code: string;
  name: string;
  chapter: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  isPlaceholder?: boolean;
}

interface AffiliateResponse {
  affiliates: PublicCreditUnion[];
  source?: "database" | "fallback";
}

interface LoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
}

const PLACEHOLDER_CREDIT_UNIONS: PublicCreditUnion[] = Array.from(
  { length: 3 },
  (_, index) => ({
    id: `placeholder-${index + 1}`,
    code: `PLACEHOLDER-${index + 1}`,
    name: "[Credit union name]",
    chapter: "[Chapter]",
    address: "[Address]",
    phone: "[Phone]",
    email: "[Email]",
    isPlaceholder: true,
  })
);

const copy = {
  en: {
    eyebrow: "CAMCCUL FINANCIAL TOOLS",
    title: "Simple Loan Calculator",
    subtitle:
      "Estimate a potential loan repayment, then find an affiliated credit union within a CamCCUL chapter.",
    calculatorTitle: "Estimate Your Loan",
    calculatorIntro: "Enter a few details to receive a simple flat-rate estimate.",
    amount: "Loan Amount (FCFA)",
    amountPlaceholder: "e.g., 2,500,000",
    period: "Repayment Period",
    months: "months",
    rate: "Annual Interest Rate (%)",
    method: "Calculation Method",
    flatRate: "Flat rate",
    calculate: "Calculate",
    amountError: "Enter a loan amount greater than zero.",
    rateError: "Enter a valid interest rate.",
    monthlyPayment: "Estimated Monthly Payment",
    totalInterest: "Total Interest",
    totalRepayment: "Total Repayment",
    leagueNote:
      "CamCCUL does not give loans directly. Loans are provided by affiliated credit unions within our chapters. Find one below.",
    finderEyebrow: "AFFILIATED CREDIT UNION DIRECTORY",
    finderTitle: "Where to Get Your Loan",
    finderIntro:
      "Search by credit union name or select one of CamCCUL’s ten chapters.",
    searchLabel: "Search affiliated credit unions",
    searchPlaceholder: "Search by credit union name or chapter...",
    chapterLabel: "Filter by chapter",
    allChapters: "All Chapters",
    loading: "Loading affiliated credit unions...",
    loadError:
      "The live directory is temporarily unavailable. Placeholder cards are shown so the directory layout remains clear.",
    emptyDatabase:
      "Credit unions will appear here once the directory is populated by the CamCCUL IT Coordinator.",
    noMatches: "No credit unions match that name or chapter.",
    address: "Address",
    phone: "Phone",
    email: "Email",
    contact: "Contact",
    directions: "Get Directions",
    trustOne: "All loans are subject to individual credit union policies and approval.",
    trustTwo:
      "CamCCUL provides supervision and support to its network of chapters and credit unions.",
  },
  fr: {
    eyebrow: "OUTILS FINANCIERS CAMCCUL",
    title: "Calculateur de prêt simple",
    subtitle:
      "Estimez le remboursement d’un prêt potentiel, puis trouvez une coopérative affiliée dans un chapitre CamCCUL.",
    calculatorTitle: "Estimez votre prêt",
    calculatorIntro: "Saisissez quelques informations pour obtenir une estimation simple à taux fixe.",
    amount: "Montant du prêt (FCFA)",
    amountPlaceholder: "ex. 2 500 000",
    period: "Durée de remboursement",
    months: "mois",
    rate: "Taux d’intérêt annuel (%)",
    method: "Méthode de calcul",
    flatRate: "Taux fixe",
    calculate: "Calculer",
    amountError: "Saisissez un montant de prêt supérieur à zéro.",
    rateError: "Saisissez un taux d’intérêt valide.",
    monthlyPayment: "Mensualité estimée",
    totalInterest: "Intérêts totaux",
    totalRepayment: "Remboursement total",
    leagueNote:
      "CamCCUL n’accorde pas directement de prêts. Les prêts sont accordés par les coopératives affiliées au sein de nos chapitres. Trouvez-en une ci-dessous.",
    finderEyebrow: "RÉPERTOIRE DES COOPÉRATIVES AFFILIÉES",
    finderTitle: "Où obtenir votre prêt",
    finderIntro:
      "Recherchez une coopérative par son nom ou sélectionnez l’un des dix chapitres CamCCUL.",
    searchLabel: "Rechercher des coopératives affiliées",
    searchPlaceholder: "Rechercher par nom de coopérative ou chapitre...",
    chapterLabel: "Filtrer par chapitre",
    allChapters: "Tous les chapitres",
    loading: "Chargement des coopératives affiliées...",
    loadError:
      "Le répertoire en direct est temporairement indisponible. Des cartes indicatives présentent la mise en page prévue.",
    emptyDatabase:
      "Les coopératives apparaîtront ici une fois le répertoire renseigné par le coordinateur informatique de CamCCUL.",
    noMatches: "Aucune coopérative ne correspond à ce nom ou chapitre.",
    address: "Adresse",
    phone: "Téléphone",
    email: "E-mail",
    contact: "Contacter",
    directions: "Itinéraire",
    trustOne: "Tous les prêts sont soumis aux politiques et à l’approbation de chaque coopérative.",
    trustTwo:
      "CamCCUL assure la supervision et l’appui de son réseau de chapitres et de coopératives.",
  },
} as const;

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

export function LoanCalculatorClient() {
  const { language } = useLanguage();
  const c = copy[language];
  const locale = language === "fr" ? "fr-FR" : "en-US";

  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState<(typeof REPAYMENT_TERMS)[number]>(12);
  const [interestRate, setInterestRate] = useState("18");
  const [result, setResult] = useState<LoanResult | null>(null);
  const [calculatorError, setCalculatorError] = useState("");

  const [creditUnions, setCreditUnions] = useState<PublicCreditUnion[]>([]);
  const [directoryState, setDirectoryState] = useState<"loading" | "ready" | "placeholder">(
    "loading"
  );
  const [directoryFailed, setDirectoryFailed] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");

  useEffect(() => {
    let ignore = false;

    fetch("/api/affiliates")
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load affiliates");
        return (await response.json()) as AffiliateResponse;
      })
      .then((data) => {
        if (ignore) return;
        const hasDatabaseRecords = data.source !== "fallback" && data.affiliates.length > 0;
        setCreditUnions(hasDatabaseRecords ? data.affiliates : PLACEHOLDER_CREDIT_UNIONS);
        setDirectoryState(hasDatabaseRecords ? "ready" : "placeholder");
      })
      .catch(() => {
        if (ignore) return;
        setCreditUnions(PLACEHOLDER_CREDIT_UNIONS);
        setDirectoryFailed(true);
        setDirectoryState("placeholder");
      });

    return () => {
      ignore = true;
    };
  }, []);

  const formattedAmount = amount
    ? new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Number(amount))
    : "";

  const filteredCreditUnions = useMemo(() => {
    if (directoryState === "placeholder") return creditUnions;

    const query = search.trim().toLocaleLowerCase(locale);
    return creditUnions.filter((creditUnion) => {
      const matchesSearch =
        !query ||
        creditUnion.name.toLocaleLowerCase(locale).includes(query) ||
        creditUnion.chapter.toLocaleLowerCase(locale).includes(query);
      const matchesChapter = !selectedChapter || creditUnion.chapter === selectedChapter;
      return matchesSearch && matchesChapter;
    });
  }, [creditUnions, directoryState, locale, search, selectedChapter]);

  function formatCurrency(value: number) {
    return `FCFA ${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
      Math.round(value)
    )}`;
  }

  function calculateLoan() {
    const principal = Number(amount);
    const annualRate = Number(interestRate);

    if (!Number.isFinite(principal) || principal <= 0) {
      setCalculatorError(c.amountError);
      setResult(null);
      return;
    }

    if (!Number.isFinite(annualRate) || annualRate < 0) {
      setCalculatorError(c.rateError);
      setResult(null);
      return;
    }

    const totalInterest = principal * (annualRate / 100) * (term / 12);
    const totalRepayment = principal + totalInterest;

    setCalculatorError("");
    setResult({
      monthlyPayment: totalRepayment / term,
      totalInterest,
      totalRepayment,
    });
  }

  return (
    <div className="bg-gray-50">
      <section className="bg-primary-900 px-4 py-14 text-white md:py-18">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">
            {c.eyebrow}
          </p>
          <h1 className="font-display mt-3 text-3xl font-bold md:text-5xl">{c.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-primary-100 md:text-base">
            {c.subtitle}
          </p>
        </div>
      </section>

      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-primary-900">
                  {c.calculatorTitle}
                </h2>
                <p className="mt-1 text-sm text-gray-600">{c.calculatorIntro}</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">{c.amount}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formattedAmount}
                  onChange={(event) => setAmount(digitsOnly(event.target.value))}
                  placeholder={c.amountPlaceholder}
                  className="mt-2 h-12 w-full rounded-lg border border-gray-300 px-4 text-base text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">{c.rate}</span>
                <div className="relative mt-2">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={interestRate}
                    onChange={(event) => setInterestRate(event.target.value)}
                    className="h-12 w-full rounded-lg border border-gray-300 px-4 pr-10 text-base text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    %
                  </span>
                </div>
              </label>
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm font-medium text-gray-700">{c.period}</legend>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
                {REPAYMENT_TERMS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={term === option}
                    onClick={() => setTerm(option)}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                      term === option
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-primary-300 hover:text-primary-600"
                    )}
                  >
                    {option} {c.months}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {c.method}
                </p>
                <p className="mt-1 font-medium text-gray-800">{c.flatRate}</p>
              </div>
              <button
                type="button"
                onClick={calculateLoan}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-6 font-semibold text-white transition-colors hover:bg-primary-600 sm:w-auto"
              >
                <Calculator className="h-5 w-5" aria-hidden="true" />
                {c.calculate}
              </button>
            </div>

            {calculatorError && (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {calculatorError}
              </p>
            )}

            {result && (
              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3" aria-live="polite">
                {[
                  [c.monthlyPayment, result.monthlyPayment],
                  [c.totalInterest, result.totalInterest],
                  [c.totalRepayment, result.totalRepayment],
                ].map(([label, value]) => (
                  <div key={String(label)} className="rounded-xl border border-primary-100 bg-primary-50 p-5">
                    <p className="text-sm text-primary-700">{label}</p>
                    <p className="mt-2 text-xl font-bold text-primary-900">
                      {formatCurrency(Number(value))}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              <Building2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <p>{c.leagueNote}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white px-4 py-14 md:py-18">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">
              {c.finderEyebrow}
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold text-primary-900 md:text-4xl">
              {c.finderTitle}
            </h2>
            <p className="mt-3 text-gray-600">{c.finderIntro}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-[1fr_280px]">
            <label className="block">
              <span className="sr-only">{c.searchLabel}</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={c.searchPlaceholder}
                  className="h-12 w-full rounded-lg border border-gray-300 pl-12 pr-4 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </label>

            <label className="block">
              <span className="sr-only">{c.chapterLabel}</span>
              <select
                value={selectedChapter}
                onChange={(event) => setSelectedChapter(event.target.value)}
                className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="">{c.allChapters}</option>
                {CHAPTERS.map((chapter) => (
                  <option key={chapter} value={chapter}>
                    {chapter}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {directoryState === "loading" ? (
            <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
              {c.loading}
            </div>
          ) : (
            <>
              {directoryState === "placeholder" && (
                <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                  {directoryFailed ? c.loadError : c.emptyDatabase}
                </div>
              )}

              {filteredCreditUnions.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCreditUnions.map((creditUnion) => {
                    const canContact =
                      !creditUnion.isPlaceholder && Boolean(creditUnion.email || creditUnion.phone);
                    const contactHref = creditUnion.email
                      ? `mailto:${creditUnion.email}`
                      : creditUnion.phone
                        ? phoneHref(creditUnion.phone)
                        : "";
                    const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      [creditUnion.name, creditUnion.address, creditUnion.chapter]
                        .filter(Boolean)
                        .join(", ")
                    )}`;

                    return (
                      <article
                        key={creditUnion.id}
                        className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                            <Building2 className="h-6 w-6" aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-display font-bold text-primary-900">
                              {creditUnion.name}
                            </h3>
                            <span className="mt-2 inline-flex rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
                              {creditUnion.chapter}
                            </span>
                          </div>
                        </div>

                        <dl className="mt-5 space-y-3 text-sm text-gray-600">
                          <div className="flex gap-3">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                            <div>
                              <dt className="sr-only">{c.address}</dt>
                              <dd>{creditUnion.address || "[Address]"}</dd>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                            <div>
                              <dt className="sr-only">{c.phone}</dt>
                              <dd>
                                {creditUnion.phone && !creditUnion.isPlaceholder ? (
                                  <a
                                    href={phoneHref(creditUnion.phone)}
                                    className="hover:text-primary-600 hover:underline"
                                  >
                                    {creditUnion.phone}
                                  </a>
                                ) : (
                                  creditUnion.phone || "[Phone]"
                                )}
                              </dd>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                            <div className="min-w-0">
                              <dt className="sr-only">{c.email}</dt>
                              <dd className="break-all">
                                {creditUnion.email && !creditUnion.isPlaceholder ? (
                                  <a
                                    href={`mailto:${creditUnion.email}`}
                                    className="hover:text-primary-600 hover:underline"
                                  >
                                    {creditUnion.email}
                                  </a>
                                ) : (
                                  creditUnion.email || "[Email]"
                                )}
                              </dd>
                            </div>
                          </div>
                        </dl>

                        <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
                          {canContact ? (
                            <a
                              href={contactHref}
                              className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600"
                            >
                              {c.contact}
                            </a>
                          ) : (
                            <span className="inline-flex cursor-not-allowed items-center justify-center rounded-lg bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-400">
                              {c.contact}
                            </span>
                          )}
                          {!creditUnion.isPlaceholder ? (
                            <a
                              href={directionsHref}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center rounded-lg border border-primary-200 px-3 py-2.5 text-center text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50"
                            >
                              {c.directions}
                            </a>
                          ) : (
                            <span className="inline-flex cursor-not-allowed items-center justify-center rounded-lg border border-gray-200 px-3 py-2.5 text-center text-sm font-medium text-gray-400">
                              {c.directions}
                            </span>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
                  {c.noMatches}
                </div>
              )}
            </>
          )}

          <div className="mt-10 rounded-2xl bg-primary-900 p-6 text-primary-50 md:p-8">
            <div className="flex items-start gap-4">
              <ShieldCheck className="h-7 w-7 shrink-0 text-primary-200" aria-hidden="true" />
              <div className="space-y-2 text-sm leading-6 md:text-base">
                <p>{c.trustOne}</p>
                <p>{c.trustTwo}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
