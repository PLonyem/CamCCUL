import type { Metadata } from "next";
import { LoanCalculatorClient } from "./LoanCalculatorClient";

export const metadata: Metadata = {
  title: "Loan Calculator & Credit Union Finder | CamCCUL",
  description:
    "Estimate a potential flat-rate loan repayment and find an affiliated credit union within one of CamCCUL's ten chapters.",
};

export default function LoanCalculatorPage() {
  return <LoanCalculatorClient />;
}
