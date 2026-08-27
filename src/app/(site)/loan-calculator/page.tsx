import type { Metadata } from "next";
import { LoanCalculatorClient } from "./LoanCalculatorClient";

export const metadata: Metadata = {
  title: "Smart Loan Calculator | CamCCUL",
  description: "Estimate loan eligibility, savings requirements, repayments and borrowing costs across the CamCCUL network.",
};

export default function LoanCalculatorPage() {
  return <LoanCalculatorClient />;
}
