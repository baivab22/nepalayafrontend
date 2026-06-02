import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <PageTransition>
      <div className="bg-slate-900 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-6">Get in Touch</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light">
            Have questions about admissions, programs, or campus life? We're here to help.
          </p>
        </div>
      </div>

      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-8">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mr-4 shrink-0 text-primary">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Campus Address</h4>
                      <p className="text-slate-600 text-sm">Kalanki 14, Kathmandu 44600,<br/>Kathmandu, Nepal</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mr-4 shrink-0 text-emerald-600">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Phone</h4>
                      <p className="text-slate-600 text-sm">+977-9761522442</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mr-4 shrink-0 text-amber-600">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Email</h4>
                      <p className="text-slate-600 text-sm">info@nepalayaedufoundation.edu.np<br/>admissions@nepalayaedufoundation.edu.np</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mr-4 shrink-0 text-purple-600">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Office Hours</h4>
                      <p className="text-slate-600 text-sm">Sun - Fri: 9:00 AM - 5:00 PM<br/>Sat: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h3>
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Message sent! (Mock)"); }}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" required className="h-12 bg-slate-50 border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" required className="h-12 bg-slate-50 border-slate-200" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" required className="h-12 bg-slate-50 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" required className="min-h-[150px] bg-slate-50 border-slate-200" />
                  </div>
                  <Button type="submit" size="lg" className="w-full h-14 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-lg">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
