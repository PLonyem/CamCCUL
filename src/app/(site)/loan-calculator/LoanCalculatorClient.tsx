"use client";

import { useState } from "react";
import { Calculator, Lightbulb } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

const REPAYMENT_TERMS = [6, 12, 18, 24, 36] as const;
const REQUIRED_SAVINGS_RATE = 0.25;

interface LoanResult {
  monthlyPayment: number;
  requiredSavings: number;
  totalRepayment: number;
}

const copy = {
  en: {
    eyebrow: "CAMCCUL FINANCIAL TOOLS",
    title: "Simple Loan Calculator",
    subtitle:
      "Estimate your monthly payment and the savings balance you may need before applying through your own credit union.",
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
    requiredSavings: "Required Savings Balance",
    totalRepayment: "Total Repayment",
    savingsNote:
      "Your credit union may require you to maintain a savings balance before your loan is granted. This is an estimated requirement based on a standard 25% savings policy.",
    nextStep: "Next Step",
    nextStepLead: "Go to the credit union where you already have an account.",
    nextStepBody:
      "Present your loan estimate to the credit union staff to begin your application process.",
    trustNote:
      "CamCCUL does not issue loans directly. Loans are provided by your affiliated credit union under their policies and approval.",
  },
  fr: {
    eyebrow: "OUTILS FINANCIERS CAMCCUL",
    title: "Calculateur de prêt simple",
    subtitle:
      "Estimez votre mensualité et le solde d’épargne dont vous pourriez avoir besoin avant de faire une demande auprès de votre propre coopérative.",
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
    requiredSavings: "Solde d’épargne requis",
    totalRepayment: "Remboursement total",
    savingsNote:
      "Votre coopérative peut exiger le maintien d’un solde d’épargne avant l’octroi du prêt. Il s’agit d’une estimation fondée sur une politique standard d’épargne de 25 %.",
    nextStep: "Prochaine étape",
    nextStepLead: "Rendez-vous à la coopérative où vous avez déjà un compte.",
    nextStepBody:
      "Présentez votre estimation au personnel de la coopérative pour commencer votre demande de prêt.",
    trustNote:
      "CamCCUL n’accorde pas directement de prêts. Les prêts sont accordés par votre coopérative affiliée selon ses politiques et sous réserve de son approbation.",
  },
} as const;

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
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

  const formattedAmount = amount
    ? new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Number(amount))
    : "";

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
      requiredSavings: principal * REQUIRED_SAVINGS_RATE,
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
        <div className="mx-auto max-w-5xl space-y-8">
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
                  onChange={(event) => {
                    setAmount(digitsOnly(event.target.value));
                    setResult(null);
                  }}
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
                    onChange={(event) => {
                      setInterestRate(event.target.value);
                      setResult(null);
                    }}
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
                    onClick={() => {
                      setTerm(option);
                      setResult(null);
                    }}
                    className={cn(
                      "min-h-11 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
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
                <div className="rounded-xl border border-primary-100 bg-primary-50 p-5">
                  <p className="text-sm text-primary-700">{c.monthlyPayment}</p>
                  <p className="mt-2 text-xl font-bold text-primary-900">
                    {formatCurrency(result.monthlyPayment)}
                  </p>
                </div>

                <div className="rounded-xl border border-primary-200 bg-primary-50 p-5">
                  <p className="text-sm text-primary-700">{c.requiredSavings}</p>
                  <p className="mt-2 text-xl font-bold text-primary-900">
                    {formatCurrency(result.requiredSavings)}
                  </p>
                  <p className="mt-3 text-xs leading-5 text-gray-500">{c.savingsNote}</p>
                </div>

                <div className="rounded-xl border border-primary-100 bg-primary-50 p-5">
                  <p className="text-sm text-primary-700">{c.totalRepayment}</p>
                  <p className="mt-2 text-xl font-bold text-primary-900">
                    {formatCurrency(result.totalRepayment)}
                  </p>
                </div>
              </div>
            )}
          </div>

          <section className="rounded-2xl border border-primary-200 bg-primary-50 p-8 text-center">
            <Lightbulb className="mx-auto h-8 w-8 text-primary-500" aria-hidden="true" />
            <h2 className="font-display mt-4 text-2xl font-bold text-primary-900">
              {c.nextStep}
            </h2>
            <p className="mt-3 text-lg text-gray-700">{c.nextStepLead}</p>
            <p className="mx-auto mt-2 max-w-2xl text-gray-600">{c.nextStepBody}</p>
            <div className="mx-auto my-6 h-px max-w-2xl bg-primary-200" aria-hidden="true" />
            <p className="mx-auto max-w-2xl text-sm italic leading-6 text-gray-500">
              {c.trustNote}
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}
