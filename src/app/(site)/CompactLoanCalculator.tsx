"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowRight, Calculator, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { LoanSimulationResult } from "@/lib/loan-calculator/types";

interface ProductSummary {
  id: string;
  nameEn: string;
  nameFr: string;
  minimumAmount: number;
  maximumAmount: number;
  availableTerms: number[];
}

interface SimulationResponse {
  result: LoanSimulationResult;
}

const COMPACT_TERMS = [6, 12, 18, 24, 36];

function parseFcfa(value: string) {
  const digits = value.replace(/[^0-9]/g, "");
  return digits ? Number(digits) : 0;
}

function formatInput(value: number) {
  return value > 0 ? value.toLocaleString("en-US") : "";
}

function formatFcfa(value: number, language: "en" | "fr") {
  return `FCFA ${Math.round(value).toLocaleString(language === "fr" ? "fr-FR" : "en-US")}`;
}

export function CompactLoanCalculator() {
  const { language } = useLanguage();
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productId, setProductId] = useState("");
  const [amount, setAmount] = useState(0);
  const [termMonths, setTermMonths] = useState(0);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<LoanSimulationResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/loan-products")
      .then(async (response) => {
        if (!response.ok) throw new Error("Loan products could not be loaded.");
        return response.json();
      })
      .then((data) => setProducts(data.products ?? []))
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Loan products could not be loaded."))
      .finally(() => setLoadingProducts(false));
  }, []);

  const selectedProduct = products.find((product) => product.id === productId);
  const validTerms = useMemo(
    () => selectedProduct?.availableTerms.filter((term) => COMPACT_TERMS.includes(term)) ?? [],
    [selectedProduct]
  );

  function selectProduct(nextProductId: string) {
    const product = products.find((item) => item.id === nextProductId);
    const productTerms = product?.availableTerms.filter((term) => COMPACT_TERMS.includes(term)) ?? [];
    setProductId(nextProductId);
    setTermMonths(productTerms[0] ?? 0);
    setResult(null);
    setError("");
  }

  async function calculate(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedProduct || !termMonths || !amount) return;

    setCalculating(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/simulations/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          language,
          requestedAmount: amount,
          termMonths,
          savingsBalance: 0,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "The estimate could not be calculated.");
      setResult((data as SimulationResponse).result);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The estimate could not be calculated.");
    } finally {
      setCalculating(false);
    }
  }

  const hasProducts = products.length > 0;
  const canCalculate = !!selectedProduct && amount > 0 && termMonths > 0 && !calculating;

  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <header>
          <p className="text-xs uppercase tracking-wider text-primary-600 font-semibold">
            CAMCCUL FINANCIAL TOOLS
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mt-2">
            Estimate Your Loan
          </h2>
          <p className="text-gray-600 mt-2">
            Quickly check your estimated monthly payment, savings requirement, and borrowing cost.
          </p>
        </header>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 mt-8">
          {loadingProducts ? (
            <div className="flex min-h-40 items-center justify-center gap-3 text-sm text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin text-primary-500" aria-hidden="true" />
              Loading configured loan products…
            </div>
          ) : !hasProducts ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
              <Calculator className="mx-auto h-9 w-9 text-primary-500" aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg font-bold text-primary-900">
                Loan products are coming soon
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-600">
                Products will appear here once CamCCUL configures and publishes the approved rates,
                terms, savings requirements, and applicable charges.
              </p>
              <select disabled className="mt-5 h-11 w-full max-w-sm rounded-lg border border-gray-200 bg-gray-100 px-3 text-sm text-gray-400">
                <option>Products coming soon</option>
              </select>
            </div>
          ) : (
            <form onSubmit={calculate}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Loan Amount (FCFA)
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatInput(amount)}
                    onChange={(event) => {
                      setAmount(parseFcfa(event.target.value));
                      setResult(null);
                    }}
                    placeholder="e.g., 2,500,000"
                    aria-describedby="compact-loan-range"
                    className="mt-2 h-12 w-full rounded-lg border border-gray-300 bg-white px-3 text-base font-semibold text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                  {selectedProduct && (
                    <span id="compact-loan-range" className="mt-1.5 block text-xs text-gray-400">
                      {formatFcfa(selectedProduct.minimumAmount, language)}–{formatFcfa(selectedProduct.maximumAmount, language)}
                    </span>
                  )}
                </label>

                <label className="block text-sm font-medium text-gray-700">
                  Loan Product
                  <select
                    value={productId}
                    onChange={(event) => selectProduct(event.target.value)}
                    className="mt-2 h-12 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="">Select a loan product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {language === "fr" ? product.nameFr : product.nameEn}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-medium text-gray-700">
                  Preferred Term
                  <select
                    value={termMonths || ""}
                    disabled={!selectedProduct || validTerms.length === 0}
                    onChange={(event) => {
                      setTermMonths(Number(event.target.value));
                      setResult(null);
                    }}
                    className="mt-2 h-12 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition disabled:bg-gray-100 disabled:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="">
                      {!selectedProduct
                        ? "Select a product first"
                        : validTerms.length === 0
                          ? "No compact terms available"
                          : "Select a term"}
                    </option>
                    {validTerms.map((term) => (
                      <option key={term} value={term}>{term} months</option>
                    ))}
                  </select>
                </label>
              </div>

              {error && (
                <div role="alert" className="mt-5 flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!canCalculate}
                className="mt-6 inline-flex w-full md:w-auto items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {calculating ? (
                  <><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />Calculating…</>
                ) : (
                  <><Calculator className="h-5 w-5" aria-hidden="true" />Calculate My Loan</>
                )}
              </button>

              {result && (
                <div className="mt-8 border-t border-gray-200 pt-6" aria-live="polite">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      ["Estimated Monthly Payment", result.monthlyPayment],
                      ["Required Savings", result.requiredSavings],
                      ["Total Repayment", result.totalRepayment],
                    ].map(([label, value]) => (
                      <div key={label as string} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-xs font-medium text-gray-500">{label as string}</p>
                        <p className="mt-2 font-display text-lg font-bold text-primary-900">
                          {formatFcfa(value as number, language)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/loan-calculator"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Open Full Calculator <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </form>
          )}

          <p className="text-xs text-gray-400 mt-6">
            Indicative estimates only. Final terms determined by your affiliated credit union.
          </p>
        </div>
      </div>
    </section>
  );
}
