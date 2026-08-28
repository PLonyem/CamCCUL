import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Overridable for testing before camccul.cm is verified as a sending domain
// in Resend — sends from an unverified domain are rejected outright, and
// Resend's sandbox mode only ever delivers to the account owner's own
// verified email. Both fall back to the real CamCCUL addresses when unset,
// so removing these two env vars once the domain is verified is the whole
// migration back to production — no code change needed.
const FROM_NOTIFICATIONS = process.env.RESEND_FROM || "CamCCUL Portal <notifications@camccul.cm>";
const FROM_HEADQUARTERS = process.env.RESEND_FROM || "CamCCUL Headquarters <info@camccul.cm>";
const ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL || "info@camccul.cm";

// The Resend SDK returns { data, error } rather than throwing on a
// rejected send (bad domain, rate limit, invalid recipient, etc.) — every
// call site below already wraps its email sends in Promise.allSettled and
// logs anything that lands in the "rejected" bucket, but that only ever
// sees actual JS exceptions. Without this, a rejected send would silently
// look identical to a successful one everywhere in the app.
async function sendOrThrow(params: Parameters<NonNullable<typeof resend>["emails"]["send"]>[0]) {
  const { error } = await resend!.emails.send(params);
  if (error) {
    throw new Error(`Resend rejected the send: ${error.message}`);
  }
}

interface ProfileSubmissionToCamCCULParams {
  creditUnionName: string;
  creditUnionCode: string;
  chapter: string;
  submittedAt: string;
}

// Notifies League HQ that a chapter submitted (or resubmitted) its profile
// and is waiting in the review queue. Falls back to a console log — not a
// thrown error — when RESEND_API_KEY isn't set, so profile submission
// keeps working in every environment that doesn't have email configured
// yet (local dev, CI, a fresh deploy before the key is added).
export async function sendProfileSubmissionToCamCCUL({
  creditUnionName,
  creditUnionCode,
  chapter,
  submittedAt,
}: ProfileSubmissionToCamCCULParams) {
  if (!resend) {
    console.log("MOCK EMAIL TO CAMCCUL:", {
      creditUnionName,
      creditUnionCode,
      chapter,
      submittedAt,
    });
    return;
  }

  await sendOrThrow({
    from: FROM_NOTIFICATIONS,
    to: ADMIN_EMAIL,
    subject: `New Profile Submission — ${creditUnionName}`,
    html: `
      <h2>New Credit Union Profile Submission</h2>
      <p><strong>Credit Union:</strong> ${creditUnionName}</p>
      <p><strong>Code:</strong> ${creditUnionCode}</p>
      <p><strong>Chapter:</strong> ${chapter}</p>
      <p><strong>Submitted At:</strong> ${submittedAt}</p>
      <p><a href="https://camccul.cm/admin/affiliates/review">Review in Admin Dashboard</a></p>
    `,
  });
}

interface ProfileConfirmationToCreditUnionParams {
  creditUnionName: string;
  creditUnionEmail: string;
}

// Confirms receipt to the chapter itself. Same console-log fallback as
// above when no API key is configured.
export async function sendProfileConfirmationToCreditUnion({
  creditUnionName,
  creditUnionEmail,
}: ProfileConfirmationToCreditUnionParams) {
  if (!resend) {
    console.log("MOCK EMAIL TO CREDIT UNION:", { creditUnionName, creditUnionEmail });
    return;
  }

  await sendOrThrow({
    from: FROM_HEADQUARTERS,
    to: creditUnionEmail,
    subject: "Profile Submission Received — CamCCUL",
    html: `
      <h2>Thank You for Your Submission</h2>
      <p>Dear ${creditUnionName},</p>
      <p>Your credit union profile has been received and is now under review.</p>
      <p>Once approved, your profile will appear on the CamCCUL website for the public to see.</p>
      <p>You will receive another email when your profile has been approved.</p>
      <p>— CamCCUL Headquarters</p>
    `,
  });
}

interface ProfileApprovalEmailParams {
  creditUnionName: string;
  creditUnionEmail: string;
}

// Sent when an admin approves a profile from the review dashboard — the
// email the confirmation above promises ("You will receive another email
// when your profile has been approved."). Same console-log fallback.
export async function sendProfileApprovalEmail({
  creditUnionName,
  creditUnionEmail,
}: ProfileApprovalEmailParams) {
  if (!resend) {
    console.log("MOCK APPROVAL EMAIL:", { creditUnionName, creditUnionEmail });
    return;
  }

  await sendOrThrow({
    from: FROM_HEADQUARTERS,
    to: creditUnionEmail,
    subject: "Profile Approved — CamCCUL",
    html: `
      <h2>Your Profile Has Been Approved</h2>
      <p>Dear ${creditUnionName},</p>
      <p>Great news! Your credit union profile has been reviewed and approved.</p>
      <p>Your profile is now live on the CamCCUL website. Visitors can see your information on the Find a Credit Union page.</p>
      <p>If you need to make changes, sign in to your dashboard and update your profile.</p>
      <p>— CamCCUL Headquarters</p>
    `,
  });
}

interface CreditUnionCredentialsParams {
  creditUnionName: string;
  email: string;
  password: string;
  chapter: string;
}

export async function sendCreditUnionCredentials({
  creditUnionName,
  email,
  password,
  chapter,
}: CreditUnionCredentialsParams) {
  const website = process.env.NEXT_PUBLIC_SITE_URL || "https://camccul.cm";
  const loginUrl = `${website.replace(/\/$/, "")}/login`;

  if (!resend) {
    console.log("MOCK CREDIT UNION CREDENTIALS EMAIL:", {
      creditUnionName,
      email,
      chapter,
      loginUrl,
    });
    return;
  }

  await sendOrThrow({
    from: FROM_HEADQUARTERS,
    to: email,
    subject: "Your CamCCUL Portal Access",
    html: `
      <p>Dear ${creditUnionName},</p>
      <p>An account has been created for you by CamCCUL.</p>
      <p><strong>Chapter:</strong> ${chapter}</p>
      <p><strong>Login Email:</strong> ${email}</p>
      <p><strong>Temporary Password:</strong> ${password}</p>
      <p>Please sign in and update your profile.</p>
      <p><strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
      <p>— CamCCUL Headquarters</p>
    `,
  });
}
