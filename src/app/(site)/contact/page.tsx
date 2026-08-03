"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { contactInfo } from "@/lib/mock-data";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

type FormStatus = "idle" | "submitting" | "success" | "error";

const infoItems = [
  { icon: MapPin, label: "Address", value: contactInfo.address },
  { icon: Phone, label: "Phone", value: contactInfo.phone },
  { icon: Mail, label: "Email", value: contactInfo.email },
  { icon: Clock, label: "Office Hours", value: contactInfo.officeHours },
];

export default function ContactPage() {
  const [status, setStatus] = useState<FormStatus>("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = handleSubmit(async () => {
    setStatus("submitting");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  });

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out to the League headquarters or your regional office."
      />

      <div className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card className="p-8">
                {status === "success" ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mt-4">
                      Thank You!
                    </h2>
                    <p className="text-green-600 dark:text-green-400 mt-2">
                      Your message has been received. We&apos;ll respond
                      within 2 business days.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-6"
                      onClick={() => {
                        reset();
                        setStatus("idle");
                      }}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <>
                    {status === "error" && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-3 mb-6">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-700 dark:text-red-300 text-sm">
                          Something went wrong. Please try again.
                        </p>
                      </div>
                    )}

                    <form onSubmit={onSubmit} noValidate>
                      <div className="space-y-1 mb-5">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          disabled={status === "submitting"}
                          className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition disabled:opacity-50"
                          {...register("name")}
                        />
                        <p className="text-xs text-red-500 min-h-[16px]">
                          {errors.name?.message}
                        </p>
                      </div>

                      <div className="space-y-1 mb-5">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          disabled={status === "submitting"}
                          className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition disabled:opacity-50"
                          {...register("email")}
                        />
                        <p className="text-xs text-red-500 min-h-[16px]">
                          {errors.email?.message}
                        </p>
                      </div>

                      <div className="space-y-1 mb-5">
                        <label
                          htmlFor="subject"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Subject
                        </label>
                        <input
                          id="subject"
                          type="text"
                          disabled={status === "submitting"}
                          className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition disabled:opacity-50"
                          {...register("subject")}
                        />
                        <p className="text-xs text-red-500 min-h-[16px]">
                          {errors.subject?.message}
                        </p>
                      </div>

                      <div className="space-y-1 mb-5">
                        <label
                          htmlFor="message"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          rows={5}
                          disabled={status === "submitting"}
                          className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition disabled:opacity-50"
                          {...register("message")}
                        />
                        <p className="text-xs text-red-500 min-h-[16px]">
                          {errors.message?.message}
                        </p>
                      </div>

                      <Button
                        type="submit"
                        variant="accent"
                        size="lg"
                        className="w-full"
                        disabled={status === "submitting"}
                      >
                        {status === "submitting" ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </Card>
            </div>

            <div className="md:col-span-1">
              <Card className="p-6 h-fit sticky top-24">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
                  Contact Information
                </h3>

                {infoItems.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3 mb-4">
                    <div className="bg-primary-100 dark:bg-primary-900/40 rounded-full p-2 h-9 w-9 text-primary-600 dark:text-primary-300 flex-shrink-0 flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                        {label}
                      </p>
                      <p className="text-sm font-medium text-primary-900 dark:text-white">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="my-4 border-t border-gray-200 dark:border-gray-800" />

                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Regional Offices
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  CamCCUL maintains regional offices in all 10 regions.
                  Contact the headquarters for regional office information.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
