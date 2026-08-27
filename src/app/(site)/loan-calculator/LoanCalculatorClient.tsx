"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Building2,
  Calculator,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Download,
  Info,
  Landmark,
  LockKeyhole,
  MapPin,
  Minus,
  Phone,
  Plus,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  WalletCards,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { basisPointsToPercent } from "@/lib/loan-calculator/engine";
import type { LoanSimulationResult, ResolvedLoanPolicy } from "@/lib/loan-calculator/types";

interface ProductSummary {
  id: string;
  code: string;
  nameEn: string;
  nameFr: string;
  descriptionEn: string;
  descriptionFr: string;
  category: string;
  minimumAmount: number;
  maximumAmount: number;
  availableTerms: number[];
  interestRateBasisPoints: number;
  interestPeriod: "annual" | "monthly";
  calculationMethod: "flat" | "reducing_balance";
  requiredSavingsBasisPoints: number;
}

interface AffiliateSummary {
  id: string;
  code: string;
  name: string;
  region: string;
  city: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
}

interface SimulationResponse {
  reference: string;
  policy: ResolvedLoanPolicy;
  result: LoanSimulationResult;
}

const copy = {
  en: {
    eyebrow: "CAMCCUL FINANCIAL TOOLS",
    headline: "Make Smarter Borrowing Decisions",
    intro: "Understand estimated eligibility, savings requirements, repayments and borrowing costs before applying through a participating affiliated credit union.",
    calculate: "Calculate My Loan",
    explore: "Explore Loan Options",
    network: "CamCCUL Network",
    secure: "Secure Simulation",
    transparent: "Transparent Estimates",
    currency: "FCFA Calculations",
    title: "CamCCUL Smart Loan Calculator",
    descriptor: "Loan Eligibility • Repayment Planning • Financial Simulation",
    loan: "Loan",
    details: "Financial Details",
    eligibility: "Eligibility",
    results: "Results",
    affiliate: "Affiliated Credit Union",
    standard: "CamCCUL Network Standard Simulation",
    affiliateHelp: "Choose a participating credit union to apply its authorized product overrides.",
    product: "What type of loan are you interested in?",
    noProducts: "No public loan policies are configured yet.",
    noProductsHelp: "A CamCCUL administrator must publish at least one versioned loan product before simulations can be performed.",
    amount: "How much would you like to borrow?",
    term: "Preferred Repayment Period",
    months: "months",
    savings: "Current Qualifying Savings",
    improve: "Improve My Affordability Estimate",
    netIncome: "Monthly Net Income",
    otherIncome: "Other Monthly Income",
    existingLoans: "Existing Loan Repayments",
    housing: "Rent / Housing Obligations",
    commitments: "Other Major Commitments",
    review: "Review indicative eligibility",
    back: "Back",
    continue: "Continue",
    simulation: "Your Loan Simulation",
    simulationIntro: "Based on the information provided, here is an estimated overview of your loan.",
    requested: "Requested Amount",
    monthly: "Estimated Monthly Payment",
    interest: "Total Interest",
    repayment: "Estimated Total Repayment",
    eligible: "Potentially Eligible",
    shortfall: "Savings Requirement Not Yet Met",
    moreInfo: "Additional Information Required",
    disclaimer: "This simulation does not constitute loan approval. Final eligibility is determined by the participating affiliated credit union following verification and applicable credit policies.",
    requiredSavings: "Required Savings",
    currentSavings: "Current Savings",
    savingsGap: "Additional Savings Required",
    savingsMet: "Savings Requirement Met",
    breakdown: "Detailed Cost Breakdown",
    principal: "Principal",
    taxes: "Taxes",
    fees: "Processing & Other Fees",
    insurance: "Insurance",
    borrowingCost: "Estimated Borrowing Cost",
    whatCost: "What will this loan cost you?",
    schedule: "Amortization Schedule",
    paymentNo: "Payment #",
    date: "Payment Date",
    opening: "Opening Balance",
    principalPaid: "Principal",
    payment: "Payment",
    closing: "Closing Balance",
    showSchedule: "Show Full Schedule",
    hideSchedule: "Hide Schedule",
    compare: "Compare Loan Options",
    saveScenario: "Save this scenario",
    scenariosFull: "You can compare up to three scenarios.",
    affordability: "Indicative Affordability Assessment",
    disposable: "Estimated Disposable Income",
    ratio: "Repayment-to-Income Ratio",
    comfortable: "Comfortable",
    moderate: "Moderate",
    high: "High Repayment Burden",
    path: "Your Path to Loan Readiness",
    plannedSavings: "Planned Monthly Savings",
    estimatedTime: "Estimated time to savings requirement",
    understand: "Understand Your Loan",
    faq: "Frequently Asked Questions",
    important: "Important",
    print: "Print Simulation",
    download: "Save as PDF",
    nextStep: "Ready for the Next Step?",
    contact: "Contact My Credit Union",
    find: "Find a CamCCUL Credit Union",
    searchAffiliate: "Search by name, code, town or region",
    loading: "Loading configured loan policies…",
    calculating: "Calculating securely…",
  },
  fr: {
    eyebrow: "OUTILS FINANCIERS CAMCCUL",
    headline: "Prenez de meilleures décisions d’emprunt",
    intro: "Comprenez votre admissibilité estimative, l’épargne requise, les remboursements et le coût du crédit avant de vous adresser à une coopérative affiliée.",
    calculate: "Calculer mon prêt",
    explore: "Explorer les options",
    network: "Réseau CamCCUL",
    secure: "Simulation sécurisée",
    transparent: "Estimations transparentes",
    currency: "Calculs en FCFA",
    title: "Calculateur de prêt intelligent CamCCUL",
    descriptor: "Admissibilité • Planification du remboursement • Simulation financière",
    loan: "Prêt",
    details: "Détails financiers",
    eligibility: "Admissibilité",
    results: "Résultats",
    affiliate: "Coopérative de crédit affiliée",
    standard: "Simulation standard du réseau CamCCUL",
    affiliateHelp: "Choisissez une coopérative participante pour appliquer ses règles autorisées.",
    product: "Quel type de prêt vous intéresse ?",
    noProducts: "Aucune politique de prêt publique n’est encore configurée.",
    noProductsHelp: "Un administrateur CamCCUL doit publier au moins une version de produit avant toute simulation.",
    amount: "Quel montant souhaitez-vous emprunter ?",
    term: "Durée de remboursement souhaitée",
    months: "mois",
    savings: "Épargne admissible actuelle",
    improve: "Améliorer mon estimation d’abordabilité",
    netIncome: "Revenu mensuel net",
    otherIncome: "Autres revenus mensuels",
    existingLoans: "Remboursements de prêts existants",
    housing: "Loyer / logement",
    commitments: "Autres engagements importants",
    review: "Vérifier l’admissibilité indicative",
    back: "Retour",
    continue: "Continuer",
    simulation: "Votre simulation de prêt",
    simulationIntro: "Selon les informations fournies, voici une estimation de votre prêt.",
    requested: "Montant demandé",
    monthly: "Mensualité estimée",
    interest: "Intérêts totaux",
    repayment: "Remboursement total estimé",
    eligible: "Potentiellement admissible",
    shortfall: "Exigence d’épargne non satisfaite",
    moreInfo: "Informations supplémentaires requises",
    disclaimer: "Cette simulation ne constitue pas une approbation. L’admissibilité finale dépend de la coopérative participante, après vérification et application de ses politiques.",
    requiredSavings: "Épargne requise",
    currentSavings: "Épargne actuelle",
    savingsGap: "Épargne supplémentaire requise",
    savingsMet: "Exigence d’épargne satisfaite",
    breakdown: "Détail des coûts",
    principal: "Capital",
    taxes: "Taxes",
    fees: "Frais de traitement et autres",
    insurance: "Assurance",
    borrowingCost: "Coût estimatif du crédit",
    whatCost: "Combien coûtera ce prêt ?",
    schedule: "Tableau d’amortissement",
    paymentNo: "Échéance #",
    date: "Date",
    opening: "Solde initial",
    principalPaid: "Capital",
    payment: "Paiement",
    closing: "Solde final",
    showSchedule: "Afficher tout le tableau",
    hideSchedule: "Masquer le tableau",
    compare: "Comparer les options",
    saveScenario: "Enregistrer ce scénario",
    scenariosFull: "Vous pouvez comparer jusqu’à trois scénarios.",
    affordability: "Évaluation indicative de l’abordabilité",
    disposable: "Revenu disponible estimé",
    ratio: "Ratio remboursement / revenu",
    comfortable: "Confortable",
    moderate: "Modéré",
    high: "Charge de remboursement élevée",
    path: "Votre parcours vers l’admissibilité",
    plannedSavings: "Épargne mensuelle prévue",
    estimatedTime: "Délai estimé pour atteindre l’épargne requise",
    understand: "Comprendre votre prêt",
    faq: "Questions fréquentes",
    important: "Important",
    print: "Imprimer la simulation",
    download: "Enregistrer en PDF",
    nextStep: "Prêt pour la prochaine étape ?",
    contact: "Contacter ma coopérative",
    find: "Trouver une coopérative CamCCUL",
    searchAffiliate: "Rechercher par nom, code, ville ou région",
    loading: "Chargement des politiques configurées…",
    calculating: "Calcul sécurisé en cours…",
  },
} as const;

function formatFcfa(value: number, language: "en" | "fr") {
  return `FCFA ${Math.round(value || 0).toLocaleString(language === "fr" ? "fr-FR" : "en-US")}`;
}

function parseCurrency(value: string) {
  const digits = value.replace(/[^0-9]/g, "");
  return digits ? Number(digits) : 0;
}

function CurrencyInput({ value, onChange, label }: { value: number; onChange: (value: number) => void; label: string }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-800 mb-2">{label}</span>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-800">FCFA</span>
        <input
          inputMode="numeric"
          value={value ? value.toLocaleString("en-US") : ""}
          onChange={(event) => onChange(parseCurrency(event.target.value))}
          className="w-full h-14 rounded-2xl border border-slate-200 bg-white pl-16 pr-4 text-lg font-bold text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          aria-label={label}
        />
      </div>
    </label>
  );
}

export function LoanCalculatorClient() {
  const { language } = useLanguage();
  const c = copy[language];
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [affiliates, setAffiliates] = useState<AffiliateSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [productId, setProductId] = useState("");
  const [affiliateId, setAffiliateId] = useState("");
  const [affiliateSearch, setAffiliateSearch] = useState("");
  const [amount, setAmount] = useState(0);
  const [termMonths, setTermMonths] = useState(0);
  const [savings, setSavings] = useState(0);
  const [showAffordability, setShowAffordability] = useState(false);
  const [profile, setProfile] = useState({ monthlyNetIncome: 0, otherMonthlyIncome: 0, existingLoanRepayments: 0, housingObligations: 0, otherCommitments: 0 });
  const [simulation, setSimulation] = useState<SimulationResponse | null>(null);
  const [scenarios, setScenarios] = useState<SimulationResponse[]>([]);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const [plannedSavings, setPlannedSavings] = useState(50_000);

  useEffect(() => {
    fetch("/api/loan-products")
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load policies.");
        return response.json();
      })
      .then((data) => {
        setProducts(data.products ?? []);
        setAffiliates(data.affiliates ?? []);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load policies."))
      .finally(() => setLoading(false));
  }, []);

  const product = products.find((item) => item.id === productId);
  const affiliate = affiliates.find((item) => item.id === affiliateId);
  const filteredAffiliates = useMemo(() => {
    const query = affiliateSearch.trim().toLowerCase();
    if (!query) return affiliates;
    return affiliates.filter((item) => [item.name, item.code, item.city, item.region].some((value) => value?.toLowerCase().includes(query)));
  }, [affiliateSearch, affiliates]);

  function chooseProduct(id: string) {
    const next = products.find((item) => item.id === id);
    setProductId(id);
    if (next) {
      setAmount((current) => current >= next.minimumAmount && current <= next.maximumAmount ? current : next.minimumAmount);
      setTermMonths((current) => next.availableTerms.includes(current) ? current : next.availableTerms[0]);
    }
    setSimulation(null);
  }

  async function calculate() {
    if (!product) return;
    setCalculating(true);
    setError("");
    try {
      const response = await fetch("/api/simulations/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          affiliateId: affiliateId || undefined,
          language,
          requestedAmount: amount,
          termMonths,
          savingsBalance: savings,
          financialProfile: showAffordability ? profile : undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to calculate this loan.");
      setSimulation(data);
      setStep(4);
      setTimeout(() => document.getElementById("loan-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to calculate this loan.");
    } finally {
      setCalculating(false);
    }
  }

  const steps = [c.loan, c.details, c.eligibility, c.results];
  const result = simulation?.result;
  const policy = simulation?.policy;
  const statusLabel = result?.eligibilityStatus === "potentially_eligible" ? c.eligible : result?.eligibilityStatus === "savings_shortfall" ? c.shortfall : c.moreInfo;
  const savingsMonths = result?.savingsGap && plannedSavings > 0 ? Math.ceil(result.savingsGap / plannedSavings) : 0;

  return (
    <div className="bg-[#f5f7f5] text-slate-950 print:bg-white">
      <section className="relative overflow-hidden bg-[#082c2a] text-white print:hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #34d399 0, transparent 30%), radial-gradient(circle at 15% 80%, #d4a72c 0, transparent 24%)" }} />
        <div className="relative mx-auto grid max-w-[1200px] gap-12 px-4 py-16 md:grid-cols-[1.05fr_.95fr] md:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-xs font-bold tracking-[.16em] text-emerald-200"><Sparkles className="h-4 w-4" />{c.eyebrow}</div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">{c.headline}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">{c.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#smart-calculator" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3 font-bold text-emerald-950 hover:bg-emerald-300">{c.calculate}<ArrowRight className="h-4 w-4" /></a>
              <a href="#loan-education" className="inline-flex min-h-12 items-center rounded-xl border border-white/30 px-6 py-3 font-semibold hover:bg-white/10">{c.explore}</a>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              {[[Landmark,c.network],[LockKeyhole,c.secure],[BadgeCheck,c.transparent],[CircleDollarSign,c.currency]].map(([Icon,label]) => {
                const IconComponent = Icon as typeof Landmark;
                return <div key={label as string} className="flex items-center gap-2 text-slate-200"><IconComponent className="h-4 w-4 text-emerald-300" />{label as string}</div>;
              })}
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-md rounded-[28px] border border-white/15 bg-white p-6 text-slate-950 shadow-2xl">
              <div className="flex items-start justify-between"><div><p className="text-xs font-bold tracking-widest text-emerald-700">CAMCCUL LOANSMART</p><h2 className="mt-1 text-xl font-bold">{c.title}</h2></div><div className="rounded-2xl bg-emerald-100 p-3"><Calculator className="h-6 w-6 text-emerald-800" /></div></div>
              <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white"><p className="text-sm text-slate-300">{c.monthly}</p><p className="mt-2 text-3xl font-bold">{result ? formatFcfa(result.monthlyPayment, language) : "FCFA —"}</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full w-2/3 rounded-full bg-emerald-400" /></div></div>
              <div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">{c.requiredSavings}</p><p className="mt-1 font-bold">{result ? formatFcfa(result.requiredSavings, language) : "—"}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">{c.repayment}</p><p className="mt-1 font-bold">{result ? formatFcfa(result.totalRepayment, language) : "—"}</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white print:hidden"><div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-4 px-4 py-5 text-sm font-semibold text-slate-700 md:grid-cols-5">{[[ShieldCheck,c.network],[BarChart3,c.transparent],[Building2,c.affiliate],[LockKeyhole,c.secure],[BookOpen,"English & Français"]].map(([Icon,label]) => { const X=Icon as typeof ShieldCheck; return <div key={label as string} className="flex items-center gap-2"><X className="h-5 w-5 text-emerald-700" />{label as string}</div>; })}</div></section>

      <section id="smart-calculator" className="mx-auto max-w-[1200px] px-4 py-16 print:py-0">
        <div className="mb-10 text-center print:hidden"><p className="text-sm font-bold tracking-[.16em] text-emerald-700">CAMCCUL LOANSMART</p><h2 className="mt-3 text-3xl font-bold md:text-4xl">{c.title}</h2><p className="mt-3 text-slate-600">{c.descriptor}</p></div>
        <div className="mb-6 grid grid-cols-4 overflow-hidden rounded-2xl border border-slate-200 bg-white print:hidden">{steps.map((label,index) => <button key={label} type="button" disabled={index+1>step || (index+1===4&&!simulation)} onClick={() => setStep(index+1)} className={`flex min-h-16 flex-col items-center justify-center gap-1 border-r border-slate-100 px-2 text-xs font-semibold last:border-r-0 sm:flex-row sm:text-sm ${step===index+1?"bg-emerald-800 text-white":index+1<step?"text-emerald-800":"text-slate-400"}`}><span className={`grid h-6 w-6 place-items-center rounded-full text-xs ${step===index+1?"bg-white text-emerald-900":"bg-slate-100"}`}>{index+1<step?<Check className="h-3.5 w-3.5" />:index+1}</span>{label}</button>)}</div>

        {loading ? <div className="rounded-3xl border border-slate-200 bg-white p-14 text-center text-slate-600">{c.loading}</div> : products.length === 0 ? <div className="rounded-3xl border border-amber-200 bg-amber-50 p-10 text-center"><AlertCircle className="mx-auto h-10 w-10 text-amber-600" /><h3 className="mt-4 text-xl font-bold text-amber-950">{c.noProducts}</h3><p className="mx-auto mt-2 max-w-2xl text-amber-800">{c.noProductsHelp}</p><Link href="/admin/loan-products" className="mt-6 inline-flex rounded-xl bg-amber-900 px-5 py-3 font-semibold text-white">Open Loan Administration</Link></div> : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr] print:hidden">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              {step === 1 && <div className="space-y-8"><div><h3 className="text-xl font-bold">{c.affiliate}</h3><p className="mt-1 text-sm text-slate-500">{c.affiliateHelp}</p><div className="relative mt-4"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input value={affiliateSearch} onChange={e=>setAffiliateSearch(e.target.value)} placeholder={c.searchAffiliate} className="h-12 w-full rounded-xl border border-slate-200 pl-12 pr-4 outline-none focus:border-emerald-600" /></div><select value={affiliateId} onChange={e=>setAffiliateId(e.target.value)} className="mt-3 h-14 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold outline-none focus:border-emerald-600"><option value="">{c.standard}</option>{filteredAffiliates.map(item=><option key={item.id} value={item.id}>{item.name} — {item.code} · {item.city ?? item.region}</option>)}</select></div><div><h3 className="text-xl font-bold">{c.product}</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">{products.map(item=><button type="button" key={item.id} onClick={()=>chooseProduct(item.id)} className={`rounded-2xl border p-5 text-left transition ${productId===item.id?"border-emerald-700 bg-emerald-50 ring-2 ring-emerald-100":"border-slate-200 hover:border-emerald-300"}`}><div className="flex items-start justify-between"><div className="rounded-xl bg-emerald-100 p-2.5"><WalletCards className="h-5 w-5 text-emerald-800" /></div>{productId===item.id&&<Check className="h-5 w-5 text-emerald-700" />}</div><h4 className="mt-4 font-bold">{language==="fr"?item.nameFr:item.nameEn}</h4><p className="mt-2 line-clamp-2 text-sm text-slate-500">{language==="fr"?item.descriptionFr:item.descriptionEn}</p><div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600"><span className="rounded-full bg-slate-100 px-2.5 py-1">{item.availableTerms.at(-1)} {c.months} max</span><span className="rounded-full bg-slate-100 px-2.5 py-1">{basisPointsToPercent(item.interestRateBasisPoints).toFixed(2)}%</span></div></button>)}</div></div></div>}
              {step === 2 && product && <div className="space-y-8"><CurrencyInput label={c.amount} value={amount} onChange={setAmount} /><div><input type="range" min={product.minimumAmount} max={product.maximumAmount} step={Math.max(1,Math.round((product.maximumAmount-product.minimumAmount)/100))} value={amount} onChange={e=>setAmount(Number(e.target.value))} className="w-full accent-emerald-700" /><div className="mt-2 flex justify-between text-xs text-slate-500"><span>{formatFcfa(product.minimumAmount,language)}</span><span>{formatFcfa(product.maximumAmount,language)}</span></div></div><div><p className="text-sm font-semibold text-slate-800">{c.term}</p><div className="mt-3 flex flex-wrap gap-2">{product.availableTerms.map(term=><button key={term} type="button" onClick={()=>setTermMonths(term)} className={`min-h-11 rounded-xl border px-4 text-sm font-semibold ${termMonths===term?"border-emerald-700 bg-emerald-800 text-white":"border-slate-200 hover:border-emerald-400"}`}>{term} {c.months}</button>)}</div></div><CurrencyInput label={c.savings} value={savings} onChange={setSavings} /></div>}
              {step === 3 && <div><button type="button" onClick={()=>setShowAffordability(value=>!value)} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 p-5 text-left"><span><span className="block font-bold">{c.improve}</span><span className="mt-1 block text-sm text-slate-500">Optional · Indicative assessment only</span></span><ChevronDown className={`h-5 w-5 transition ${showAffordability?"rotate-180":""}`} /></button>{showAffordability&&<div className="mt-5 grid gap-5 sm:grid-cols-2">{([["monthlyNetIncome",c.netIncome],["otherMonthlyIncome",c.otherIncome],["existingLoanRepayments",c.existingLoans],["housingObligations",c.housing],["otherCommitments",c.commitments]] as const).map(([key,label])=><CurrencyInput key={key} label={label} value={profile[key]} onChange={value=>setProfile(current=>({...current,[key]:value}))} />)}</div>}<div className="mt-7 rounded-2xl bg-slate-50 p-5"><h4 className="font-bold">{c.review}</h4><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between"><dt>{c.product}</dt><dd className="font-semibold">{product?language==="fr"?product.nameFr:product.nameEn:"—"}</dd></div><div className="flex justify-between"><dt>{c.requested}</dt><dd className="font-semibold">{formatFcfa(amount,language)}</dd></div><div className="flex justify-between"><dt>{c.term}</dt><dd className="font-semibold">{termMonths} {c.months}</dd></div><div className="flex justify-between"><dt>{c.affiliate}</dt><dd className="max-w-[55%] text-right font-semibold">{affiliate?.name??c.standard}</dd></div></dl></div></div>}
              {error&&<div role="alert" className="mt-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertCircle className="h-5 w-5 shrink-0" />{error}</div>}
              <div className="mt-8 flex items-center justify-between gap-3"><button type="button" disabled={step===1} onClick={()=>setStep(value=>Math.max(1,value-1))} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-slate-200 px-5 font-semibold disabled:opacity-30"><ChevronLeft className="h-4 w-4" />{c.back}</button>{step<3?<button type="button" disabled={step===1&&!product} onClick={()=>setStep(value=>value+1)} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald-800 px-6 font-bold text-white disabled:opacity-40">{c.continue}<ChevronRight className="h-4 w-4" /></button>:<button type="button" disabled={!product||calculating} onClick={calculate} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald-700 px-6 font-bold text-white disabled:opacity-50"><Calculator className="h-5 w-5" />{calculating?c.calculating:c.calculate}</button>}</div>
            </div>
            <aside className="h-fit rounded-3xl bg-slate-950 p-6 text-white shadow-xl lg:sticky lg:top-24 sm:p-8"><p className="text-xs font-bold tracking-[.16em] text-emerald-300">LIVE LOAN SUMMARY</p><h3 className="mt-2 text-2xl font-bold">{product?language==="fr"?product.nameFr:product.nameEn:c.title}</h3><div className="mt-7 space-y-5"><div><p className="text-sm text-slate-400">{c.requested}</p><p className="mt-1 text-3xl font-bold">{formatFcfa(amount,language)}</p></div><div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-white/5 p-4"><p className="text-xs text-slate-400">{c.term}</p><p className="mt-1 font-bold">{termMonths||"—"} {termMonths?c.months:""}</p></div><div className="rounded-xl bg-white/5 p-4"><p className="text-xs text-slate-400">{c.currentSavings}</p><p className="mt-1 font-bold">{formatFcfa(savings,language)}</p></div></div>{product&&<div className="border-t border-white/10 pt-5 text-sm"><div className="flex justify-between py-2"><span className="text-slate-400">Indicative rate</span><span>{basisPointsToPercent(product.interestRateBasisPoints).toFixed(2)}% · {product.interestPeriod}</span></div><div className="flex justify-between py-2"><span className="text-slate-400">Method</span><span>{product.calculationMethod.replaceAll("_"," ")}</span></div><div className="flex justify-between py-2"><span className="text-slate-400">Savings rule</span><span>{basisPointsToPercent(product.requiredSavingsBasisPoints).toFixed(2)}%</span></div></div>}</div><div className="mt-7 flex gap-3 rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-xs leading-5 text-amber-100"><Info className="h-4 w-4 shrink-0" />Rates and rules shown here come from the selected published policy and may be overridden by the selected affiliate.</div></aside>
          </div>
        )}
      </section>

      {simulation&&result&&policy&&<section id="loan-results" className="mx-auto max-w-[1200px] px-4 pb-16 scroll-mt-24"><div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm sm:p-9"><div className="flex flex-col justify-between gap-5 border-b border-slate-100 pb-7 md:flex-row md:items-end"><div><p className="text-sm font-bold tracking-widest text-emerald-700">SIMULATION ID: {simulation.reference}</p><h2 className="mt-2 text-3xl font-bold">{c.simulation}</h2><p className="mt-2 text-slate-600">{c.simulationIntro}</p></div><div className="flex gap-2 print:hidden"><button type="button" onClick={()=>window.print()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 font-semibold"><Printer className="h-4 w-4" />{c.print}</button><button type="button" onClick={()=>window.print()} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 font-semibold text-white"><Download className="h-4 w-4" />{c.download}</button></div></div><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[[c.requested,result.requestedAmount],[c.monthly,result.monthlyPayment],[c.interest,result.totalInterest],[c.repayment,result.totalRepayment]].map(([label,value])=><div key={label as string} className="rounded-2xl border border-slate-200 p-5"><p className="text-sm text-slate-500">{label as string}</p><p className="mt-2 text-xl font-bold">{formatFcfa(value as number,language)}</p></div>)}</div><div className={`mt-6 rounded-2xl border p-6 ${result.eligibilityStatus==="potentially_eligible"?"border-emerald-200 bg-emerald-50":result.eligibilityStatus==="savings_shortfall"?"border-amber-200 bg-amber-50":"border-blue-200 bg-blue-50"}`}><div className="flex gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white"><BadgeCheck className="h-6 w-6 text-emerald-700" /></div><div><h3 className="text-xl font-bold">{statusLabel}</h3><p className="mt-2 text-sm leading-6 text-slate-700">{c.disclaimer}</p></div></div></div><div className="mt-8 grid gap-6 lg:grid-cols-2"><div className="rounded-2xl bg-[#082c2a] p-6 text-white"><h3 className="text-xl font-bold">{result.savingsGap?c.path:c.savingsMet}</h3><div className="mt-5 h-3 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-emerald-400" style={{width:`${result.savingsProgressBasisPoints/100}%`}} /></div><p className="mt-2 text-sm text-emerald-100">{(result.savingsProgressBasisPoints/100).toFixed(0)}% of savings requirement reached</p><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><dt className="text-slate-300">{c.requiredSavings}</dt><dd className="font-bold">{formatFcfa(result.requiredSavings,language)}</dd></div><div className="flex justify-between"><dt className="text-slate-300">{c.currentSavings}</dt><dd className="font-bold">{formatFcfa(savings,language)}</dd></div><div className="flex justify-between border-t border-white/10 pt-3"><dt>{c.savingsGap}</dt><dd className="font-bold text-amber-300">{formatFcfa(result.savingsGap,language)}</dd></div></dl>{result.savingsGap>0&&<div className="mt-5 rounded-xl bg-white/5 p-4"><CurrencyInput label={c.plannedSavings} value={plannedSavings} onChange={setPlannedSavings} /><p className="mt-3 text-sm">{c.estimatedTime}: <strong>{savingsMonths} {c.months}</strong></p></div>}</div><div className="rounded-2xl border border-slate-200 p-6"><h3 className="text-xl font-bold">{c.whatCost}</h3><div className="mx-auto mt-6 grid h-44 w-44 place-items-center rounded-full" style={{background:`conic-gradient(#047857 0 ${(result.requestedAmount/result.totalRepayment)*100}%, #d4a72c 0 ${((result.requestedAmount+result.totalInterest)/result.totalRepayment)*100}%, #334155 0)`}}><div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center"><div><p className="text-xs text-slate-500">{c.borrowingCost}</p><p className="mt-1 font-bold">{formatFcfa(result.borrowingCost,language)}</p></div></div></div><div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs"><div><span className="mx-auto block h-2 w-8 rounded bg-emerald-700" />{c.principal}</div><div><span className="mx-auto block h-2 w-8 rounded bg-[#d4a72c]" />{c.interest}</div><div><span className="mx-auto block h-2 w-8 rounded bg-slate-700" />{c.fees}</div></div></div></div><div className="mt-6 grid gap-6 lg:grid-cols-2"><div className="rounded-2xl border border-slate-200 p-6"><h3 className="text-xl font-bold">{c.breakdown}</h3><dl className="mt-5 space-y-3 text-sm">{[[c.principal,result.requestedAmount],[c.interest,result.totalInterest],[c.taxes,result.totalTaxes],[c.fees,result.totalFees],[c.insurance,result.totalInsurance]].map(([label,value])=><div key={label as string} className="flex justify-between"><dt className="text-slate-600">{label as string}</dt><dd className="font-semibold">{formatFcfa(value as number,language)}</dd></div>)}<div className="flex justify-between border-t border-slate-200 pt-4 text-base"><dt className="font-bold">{c.repayment}</dt><dd className="font-bold">{formatFcfa(result.totalRepayment,language)}</dd></div></dl></div><div className="rounded-2xl border border-slate-200 p-6"><h3 className="text-xl font-bold">{c.affordability}</h3>{result.affordability.supplied?<><div className={`mt-5 inline-flex rounded-full px-3 py-1 text-sm font-bold ${result.affordability.rating==="comfortable"?"bg-emerald-100 text-emerald-800":result.affordability.rating==="moderate"?"bg-amber-100 text-amber-800":"bg-red-100 text-red-800"}`}>{result.affordability.rating==="comfortable"?c.comfortable:result.affordability.rating==="moderate"?c.moderate:c.high}</div><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><dt>{c.disposable}</dt><dd className="font-bold">{formatFcfa(result.affordability.disposableIncome,language)}</dd></div><div className="flex justify-between"><dt>{c.ratio}</dt><dd className="font-bold">{result.affordability.repaymentToIncomeBasisPoints==null?"—":`${(result.affordability.repaymentToIncomeBasisPoints/100).toFixed(1)}%`}</dd></div></dl></>:<p className="mt-4 text-sm leading-6 text-slate-600">Add optional monthly income and commitments to receive an indicative affordability assessment. This is not an underwriting decision.</p>}</div></div><div className="mt-6 rounded-2xl border border-slate-200"><button type="button" onClick={()=>setShowSchedule(value=>!value)} className="flex w-full items-center justify-between p-6 text-left"><span className="text-xl font-bold">{c.schedule}</span><span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">{showSchedule?c.hideSchedule:c.showSchedule}<ChevronDown className={`h-4 w-4 transition ${showSchedule?"rotate-180":""}`} /></span></button>{showSchedule&&<div className="overflow-x-auto border-t border-slate-200"><table className="w-full min-w-[900px] text-sm"><thead className="bg-slate-50 text-left text-xs uppercase text-slate-500"><tr>{[c.paymentNo,c.date,c.opening,c.principalPaid,c.interest,c.fees,c.payment,c.closing].map(label=><th key={label} className="px-4 py-3">{label}</th>)}</tr></thead><tbody>{result.schedule.map(row=><tr key={row.paymentNumber} className="border-t border-slate-100"><td className="px-4 py-3 font-semibold">{String(row.paymentNumber).padStart(2,"0")}</td><td className="px-4 py-3">{row.paymentDate}</td>{[row.openingBalance,row.principal,row.interest,row.fees,row.payment,row.closingBalance].map((value,index)=><td key={index} className="px-4 py-3 tabular-nums">{formatFcfa(value,language)}</td>)}</tr>)}</tbody></table></div>}</div><div className="mt-6 rounded-2xl border border-slate-200 p-6 print:hidden"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h3 className="text-xl font-bold">{c.compare}</h3><p className="mt-1 text-sm text-slate-500">{c.scenariosFull}</p></div><button type="button" disabled={scenarios.length>=3||scenarios.some(item=>item.reference===simulation.reference)} onClick={()=>setScenarios(current=>[...current,simulation])} className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white disabled:opacity-40"><Plus className="mr-2 inline h-4 w-4" />{c.saveScenario}</button></div>{scenarios.length>0&&<div className="mt-5 overflow-x-auto"><table className="w-full min-w-[650px] text-sm"><thead><tr><th className="p-3 text-left">Metric</th>{scenarios.map((item,index)=><th key={item.reference} className="p-3 text-left">Scenario {String.fromCharCode(65+index)}<button onClick={()=>setScenarios(current=>current.filter(x=>x.reference!==item.reference))} className="ml-2 text-red-600"><Minus className="h-4 w-4" /></button></th>)}</tr></thead><tbody>{[[c.requested,"requestedAmount"],[c.monthly,"monthlyPayment"],[c.interest,"totalInterest"],[c.fees,"totalCharges"],[c.repayment,"totalRepayment"],[c.requiredSavings,"requiredSavings"]].map(([label,key])=><tr key={label} className="border-t border-slate-100"><td className="p-3 font-semibold">{label}</td>{scenarios.map(item=><td key={item.reference} className="p-3">{formatFcfa(item.result[key as keyof LoanSimulationResult] as number,language)}</td>)}</tr>)}</tbody></table></div>}</div><div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-2xl bg-emerald-50 p-7 text-center sm:flex-row sm:text-left"><div><h3 className="text-2xl font-bold">{c.nextStep}</h3><p className="mt-2 text-slate-600">{affiliate?.name??c.standard}</p></div><div className="flex flex-wrap justify-center gap-3">{affiliate?.phone&&<a href={`tel:${affiliate.phone}`} className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 font-bold text-white"><Phone className="h-4 w-4" />{c.contact}</a>}<Link href="/affiliates" className="inline-flex items-center gap-2 rounded-xl border border-emerald-800 px-5 py-3 font-bold text-emerald-900"><MapPin className="h-4 w-4" />{c.find}</Link></div></div><div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5"><h3 className="flex items-center gap-2 font-bold text-amber-950"><AlertCircle className="h-5 w-5" />{c.important}</h3><p className="mt-2 text-sm leading-6 text-amber-900">{c.disclaimer}</p></div></div></section>}

      <section id="loan-education" className="bg-white py-16 print:hidden"><div className="mx-auto max-w-[1200px] px-4"><div className="text-center"><p className="text-sm font-bold tracking-widest text-emerald-700">FINANCIAL EDUCATION</p><h2 className="mt-3 text-3xl font-bold">{c.understand}</h2></div><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{(language==="fr"?[{t:"Fonctionnement des intérêts",d:"Comprenez les taux fixes et dégressifs avant de comparer."},{t:"Pourquoi l’épargne compte",d:"L’épargne admissible peut faire partie de la politique d’un produit."},{t:"Coût total du crédit",d:"Comparez le capital, les intérêts, taxes et frais ensemble."},{t:"Emprunter responsablement",d:"Choisissez une mensualité compatible avec votre budget."}]:[{t:"How Interest Works",d:"Understand flat and reducing-balance methods before comparing."},{t:"Why Savings Matter",d:"Qualifying savings may form part of a product’s configured policy."},{t:"Total Cost of Credit",d:"Compare principal, interest, taxes and fees together."},{t:"Borrowing Responsibly",d:"Choose a repayment obligation that leaves room in your budget."}]).map((item,index)=>{const icons=[TrendingDown,WalletCards,CircleDollarSign,ShieldCheck];const Icon=icons[index];return <article key={item.t} className="rounded-2xl border border-slate-200 p-6"><div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100"><Icon className="h-5 w-5 text-emerald-800" /></div><h3 className="mt-4 font-bold">{item.t}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.d}</p></article>})}</div><div className="mx-auto mt-14 max-w-3xl"><h2 className="text-center text-3xl font-bold">{c.faq}</h2><div className="mt-7 space-y-3">{(language==="fr"?[{q:"Le calculateur garantit-il l’approbation ?",a:"Non. Il fournit uniquement une estimation indicative. La coopérative participante prend la décision finale."},{q:"Pourquoi les exigences d’épargne varient-elles ?",a:"Chaque produit et coopérative peut avoir une politique autorisée différente. Le moteur applique la règle publiée la plus spécifique."},{q:"Les frais sont-ils inclus ?",a:"Oui, lorsque l’administrateur les a configurés pour le produit ou la coopérative sélectionnée."}]:[{q:"Does the calculator guarantee loan approval?",a:"No. It provides indicative planning estimates only. The participating credit union makes the final decision."},{q:"Why do savings requirements vary?",a:"Each product and affiliate may have a different authorized policy. The engine applies the most specific published rule."},{q:"Are fees included?",a:"Yes, whenever an administrator has configured them for the selected product or affiliate."}]).map(item=><details key={item.q} className="group rounded-2xl border border-slate-200 p-5"><summary className="cursor-pointer list-none font-bold">{item.q}<ChevronDown className="float-right h-5 w-5 transition group-open:rotate-180" /></summary><p className="mt-3 text-sm leading-6 text-slate-600">{item.a}</p></details>)}</div></div></div></section>
    </div>
  );
}
