"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Upload,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type Tab = "content" | "appearance" | "sections";

interface HomepageContentData {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  heroImages: string[];
  statsAffiliates: number;
  statsMembers: string;
  statsAssets: string;
}

const MAX_IMAGES = 5;

const tabs: { key: Tab; label: string }[] = [
  { key: "content", label: "Content" },
  { key: "appearance", label: "Appearance" },
  { key: "sections", label: "Sections" },
];

const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition disabled:opacity-50";
const errorClass = "text-xs text-red-600 mt-1";
const countClass = "text-xs text-gray-400 mt-1 text-right";

export default function AdminHomepageEditorPage() {
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [data, setData] = useState<HomepageContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let ignore = false;
    fetch("/api/homepage")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((d: HomepageContentData) => {
        if (!ignore) setData(d);
      })
      .catch(() => {
        if (!ignore) setToast({ type: "error", message: "Could not load homepage content." });
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function updateField<K extends keyof HomepageContentData>(
    key: K,
    value: HomepageContentData[K]
  ) {
    setData((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleAddImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !data) return;
    if (data.heroImages.length >= MAX_IMAGES) {
      setToast({ type: "error", message: `You can only add up to ${MAX_IMAGES} images.` });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/homepage/upload-hero-image", {
      method: "POST",
      body: formData,
    });
    const body = await res.json().catch(() => null);
    setIsUploading(false);

    if (!res.ok) {
      setToast({ type: "error", message: body?.error ?? "Upload failed." });
      return;
    }
    updateField("heroImages", [...data.heroImages, body.url as string]);
  }

  function removeImage(index: number) {
    if (!data) return;
    updateField(
      "heroImages",
      data.heroImages.filter((_, i) => i !== index)
    );
  }

  function moveImage(index: number, direction: -1 | 1) {
    if (!data) return;
    const target = index + direction;
    if (target < 0 || target >= data.heroImages.length) return;
    const next = [...data.heroImages];
    [next[index], next[target]] = [next[target], next[index]];
    updateField("heroImages", next);
  }

  async function handleSave() {
    if (!data) return;
    setIsSaving(true);
    setFieldErrors({});
    setToast(null);

    const res = await fetch("/api/admin/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => null);
    setIsSaving(false);

    if (!res.ok) {
      const details = body?.details?.fieldErrors as Record<string, string[] | undefined> | undefined;
      const nextErrors: Record<string, string> = {};
      if (details) {
        for (const [field, messages] of Object.entries(details)) {
          if (messages?.[0]) nextErrors[field] = messages[0];
        }
      }
      setFieldErrors(nextErrors);
      setToast({ type: "error", message: body?.error ?? "Could not save changes." });
      return;
    }

    setData(body);
    setToast({ type: "success", message: "Homepage content saved" });
  }

  return (
    <div className="max-w-3xl pb-24">
      <h1 className="text-2xl font-bold text-gray-900">Homepage Editor</h1>
      <p className="text-sm text-gray-500 mt-1">
        Manage the content and appearance of the public homepage.
      </p>

      <div className="mt-6 border-b border-gray-200 flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "pb-3 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === tab.key
                ? "border-primary-500 text-primary-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="mt-8 text-sm text-gray-400">Loading...</div>
      ) : !data ? (
        <div className="mt-8 text-sm text-red-600">Could not load homepage content.</div>
      ) : activeTab !== "content" ? (
        <Card className="mt-8 p-8 text-center">
          <p className="text-sm text-gray-500">
            {tabs.find((t) => t.key === activeTab)?.label} settings are coming soon.
          </p>
        </Card>
      ) : (
        <div className="mt-8 space-y-8">
          {/* SECTION 1: HERO IMAGES */}
          <Card className="p-6">
            <h2 className="font-semibold text-gray-900">Hero Images</h2>
            <p className="text-sm text-gray-500 mt-1">
              Upload 1-5 images. Multiple images create an automatic slideshow
              every 5 seconds.
            </p>

            {data.heroImages.length === 0 ? (
              <p className="text-sm text-gray-400 mt-4">
                No images yet. The hero will use a gradient background.
              </p>
            ) : (
              <div className="flex flex-wrap gap-4 mt-4">
                {data.heroImages.map((url, index) => (
                  <div key={url + index} className="group relative">
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={url}
                        alt={`Hero image ${index + 1}`}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        aria-label="Remove image"
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-gray-500">
                      <button
                        type="button"
                        onClick={() => moveImage(index, -1)}
                        disabled={index === 0}
                        className="inline-flex items-center gap-0.5 hover:text-primary-600 disabled:opacity-30 disabled:hover:text-gray-500"
                      >
                        <ChevronLeft className="h-3 w-3" />
                        Move Left
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(index, 1)}
                        disabled={index === data.heroImages.length - 1}
                        className="inline-flex items-center gap-0.5 hover:text-primary-600 disabled:opacity-30 disabled:hover:text-gray-500"
                      >
                        Move Right
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAddImage}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || data.heroImages.length >= MAX_IMAGES}
              className="mt-4 flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:border-primary-400 hover:text-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isUploading ? "Uploading..." : "Add Image"}
            </button>
            <p className="text-xs text-gray-400 mt-2">Recommended size: 1920×1080px</p>
          </Card>

          {/* SECTION 2: HERO TEXT */}
          <Card className="p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">Hero Text</h2>

            <div>
              <label htmlFor="heroBadge" className={labelClass}>
                Badge text
              </label>
              <input
                id="heroBadge"
                type="text"
                placeholder="Regulated by COBAC"
                value={data.heroBadge}
                onChange={(e) => updateField("heroBadge", e.target.value)}
                className={inputClass}
              />
              {fieldErrors.heroBadge && <p className={errorClass}>{fieldErrors.heroBadge}</p>}
              <p className={countClass}>{data.heroBadge.length} characters</p>
            </div>

            <div>
              <label htmlFor="heroTitle" className={labelClass}>
                Headline
              </label>
              <textarea
                id="heroTitle"
                rows={2}
                value={data.heroTitle}
                onChange={(e) => updateField("heroTitle", e.target.value)}
                className={cn(inputClass, "text-lg font-display")}
              />
              {fieldErrors.heroTitle && <p className={errorClass}>{fieldErrors.heroTitle}</p>}
              <p className={countClass}>{data.heroTitle.length} characters</p>
            </div>

            <div>
              <label htmlFor="heroSubtitle" className={labelClass}>
                Subtitle
              </label>
              <textarea
                id="heroSubtitle"
                rows={3}
                value={data.heroSubtitle}
                onChange={(e) => updateField("heroSubtitle", e.target.value)}
                className={inputClass}
              />
              {fieldErrors.heroSubtitle && <p className={errorClass}>{fieldErrors.heroSubtitle}</p>}
              <p className={countClass}>{data.heroSubtitle.length} characters</p>
            </div>
          </Card>

          {/* SECTION 3: BUTTONS */}
          <Card className="p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">Buttons</h2>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="primaryButtonText" className={labelClass}>
                  Primary button text
                </label>
                <input
                  id="primaryButtonText"
                  type="text"
                  value={data.primaryButtonText}
                  onChange={(e) => updateField("primaryButtonText", e.target.value)}
                  className={inputClass}
                />
                {fieldErrors.primaryButtonText && (
                  <p className={errorClass}>{fieldErrors.primaryButtonText}</p>
                )}
              </div>
              <div>
                <label htmlFor="primaryButtonLink" className={labelClass}>
                  Primary button link
                </label>
                <input
                  id="primaryButtonLink"
                  type="text"
                  value={data.primaryButtonLink}
                  onChange={(e) => updateField("primaryButtonLink", e.target.value)}
                  className={inputClass}
                />
                {!data.primaryButtonLink.startsWith("/") && (
                  <p className={errorClass}>Link must start with /</p>
                )}
                {fieldErrors.primaryButtonLink && (
                  <p className={errorClass}>{fieldErrors.primaryButtonLink}</p>
                )}
              </div>
              <div>
                <label htmlFor="secondaryButtonText" className={labelClass}>
                  Secondary button text
                </label>
                <input
                  id="secondaryButtonText"
                  type="text"
                  value={data.secondaryButtonText}
                  onChange={(e) => updateField("secondaryButtonText", e.target.value)}
                  className={inputClass}
                />
                {fieldErrors.secondaryButtonText && (
                  <p className={errorClass}>{fieldErrors.secondaryButtonText}</p>
                )}
              </div>
              <div>
                <label htmlFor="secondaryButtonLink" className={labelClass}>
                  Secondary button link
                </label>
                <input
                  id="secondaryButtonLink"
                  type="text"
                  value={data.secondaryButtonLink}
                  onChange={(e) => updateField("secondaryButtonLink", e.target.value)}
                  className={inputClass}
                />
                {!data.secondaryButtonLink.startsWith("/") && (
                  <p className={errorClass}>Link must start with /</p>
                )}
                {fieldErrors.secondaryButtonLink && (
                  <p className={errorClass}>{fieldErrors.secondaryButtonLink}</p>
                )}
              </div>
            </div>
          </Card>

          {/* SECTION 4: STATISTICS */}
          <Card className="p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">Statistics</h2>

            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label htmlFor="statsAffiliates" className={labelClass}>
                  Affiliates count
                </label>
                <input
                  id="statsAffiliates"
                  type="number"
                  min={0}
                  value={data.statsAffiliates}
                  onChange={(e) => updateField("statsAffiliates", Number(e.target.value) || 0)}
                  className={inputClass}
                />
                {fieldErrors.statsAffiliates && (
                  <p className={errorClass}>{fieldErrors.statsAffiliates}</p>
                )}
              </div>
              <div>
                <label htmlFor="statsMembers" className={labelClass}>
                  Members count
                </label>
                <input
                  id="statsMembers"
                  type="text"
                  placeholder="1.2M+"
                  value={data.statsMembers}
                  onChange={(e) => updateField("statsMembers", e.target.value)}
                  className={inputClass}
                />
                {fieldErrors.statsMembers && <p className={errorClass}>{fieldErrors.statsMembers}</p>}
              </div>
              <div>
                <label htmlFor="statsAssets" className={labelClass}>
                  Assets count
                </label>
                <input
                  id="statsAssets"
                  type="text"
                  placeholder="550B+"
                  value={data.statsAssets}
                  onChange={(e) => updateField("statsAssets", e.target.value)}
                  className={inputClass}
                />
                {fieldErrors.statsAssets && <p className={errorClass}>{fieldErrors.statsAssets}</p>}
              </div>
            </div>
          </Card>
        </div>
      )}

      {data && activeTab === "content" && (
        <div className="sticky bottom-0 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 bg-white border-t border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 z-10">
          <div className="flex-1">
            {toast && (
              <p
                className={cn(
                  "flex items-center gap-1.5 text-sm",
                  toast.type === "success" ? "text-green-700" : "text-red-600"
                )}
              >
                {toast.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {toast.message}
              </p>
            )}
          </div>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
