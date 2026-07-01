import { FormEvent, useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle } from "lucide-react";

const API_URL = "https://nepalaya-apis.onrender.com";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to send");

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <PageTransition>
      <div className="pt-16 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">Contact</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-slate-600">
              Have questions about admissions, programs, or campus life? We're here to help.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100" />

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-16">

            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm mb-0.5">Address</h4>
                      <p className="text-sm text-slate-500">Kalanki 14, Kathmandu 44600, Nepal</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm mb-0.5">Phone</h4>
                      <p className="text-sm text-slate-500">+977-9761522442</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 text-amber-600">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm mb-0.5">Email</h4>
                      <p className="text-sm text-slate-500">info@nepalayaedufoundation.edu.np</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm mb-0.5">Office Hours</h4>
                      <p className="text-sm text-slate-500">Sun - Fri: 6:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Send us a message</h3>

                {status === "success" ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h4>
                    <p className="text-slate-500">We'll get back to you as soon as possible.</p>
                    <Button
                      onClick={() => setStatus("idle")}
                      variant="outline"
                      className="mt-6"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : status === "error" ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h4>
                    <p className="text-slate-500 mb-6">Please try again or email us directly.</p>
                    <Button
                      onClick={() => setStatus("idle")}
                      className="bg-slate-900 hover:bg-slate-800"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                        <Input id="name" name="name" required className="h-11" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        <Input id="email" name="email" type="email" required className="h-11" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                      <Input id="subject" name="subject" required className="h-11" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                      <Textarea id="message" name="message" required className="min-h-[140px]" />
                    </div>
                    <Button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-base disabled:opacity-60"
                    >
                      {status === "loading" ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
