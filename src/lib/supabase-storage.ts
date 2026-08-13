// Minimal Supabase Storage client built on a couple of REST calls rather
// than the full @supabase/supabase-js SDK — this app has exactly one
// upload path (admin chapter profile documents), so a small fetch wrapper
// avoids pulling in a dependency this project otherwise has no use for.
//
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (server-only secret —
// never expose this key to the client) in the environment. Neither is set
// in this project yet; see .env.example for where to find them in the
// Supabase dashboard (Project Settings → API). Until they're set, uploads
// fail with a clear error instead of a silent no-op.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "chapter-profile-uploads";

export function isSupabaseStorageConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

export async function uploadToSupabaseStorage(
  path: string,
  buffer: Buffer,
  contentType: string
): Promise<{ bucket: string; path: string }> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Supabase Storage is not configured (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)."
    );
  }

  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": contentType,
        "x-upsert": "true",
      },
      body: new Uint8Array(buffer),
    }
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Supabase Storage upload failed (${response.status}): ${detail}`);
  }

  return { bucket: BUCKET, path };
}

// The upload bucket is private, so viewing a document (e.g. from the admin
// review dashboard) requires a short-lived signed URL rather than a plain
// public one.
export async function getSignedSupabaseUrl(
  path: string,
  expiresInSeconds = 300
): Promise<string> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Supabase Storage is not configured (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)."
    );
  }

  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/sign/${BUCKET}/${path}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expiresIn: expiresInSeconds }),
    }
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Supabase Storage sign request failed (${response.status}): ${detail}`);
  }

  const data = (await response.json()) as { signedURL?: string };
  if (!data.signedURL) {
    throw new Error("Supabase Storage sign request returned no URL.");
  }

  return `${SUPABASE_URL}/storage/v1${data.signedURL}`;
}
