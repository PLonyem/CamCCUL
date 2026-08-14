import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

  await resend.emails.send({
    from: "CamCCUL Portal <notifications@camccul.cm>",
    to: "info@camccul.cm",
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

  await resend.emails.send({
    from: "CamCCUL Headquarters <info@camccul.cm>",
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

  await resend.emails.send({
    from: "CamCCUL Headquarters <info@camccul.cm>",
    to: creditUnionEmail,
    subject: "Profile Approved — CamCCUL",
    html: `
      <h2>Your Profile Has Been Approved</h2>
      <p>Dear ${creditUnionName},</p>
      <p>Great news! Your credit union profile has been reviewed and approved.</p>
      <p>Your profile is now live on the CamCCUL website. Visitors can see your information when they browse the Affiliates directory.</p>
      <p>If you need to make changes, sign in to your dashboard and update your profile.</p>
      <p>— CamCCUL Headquarters</p>
    `,
  });
}
