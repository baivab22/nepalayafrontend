import { PageTransition, FadeIn } from "@/components/PageTransition";
import { siteConfig } from "@/lib/data";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting us. We will get back to you shortly.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <PageTransition>
      {/* Header */}
      <div className="bg-primary py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <FadeIn>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              We're here to help. Reach out with any questions or visit our campus.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <FadeIn delay={0.1} className="bg-white rounded-2xl p-8 shadow-lg border border-border text-center group">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl text-primary mb-3">Visit Us</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {siteConfig.contact.address}<br/>
              {siteConfig.contact.city}
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="bg-white rounded-2xl p-8 shadow-lg border border-border text-center group">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl text-primary mb-3">Call Us</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {siteConfig.contact.phone}<br/>
              +977-01-5524891
            </p>
          </FadeIn>

          <FadeIn delay={0.3} className="bg-white rounded-2xl p-8 shadow-lg border border-border text-center group">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl text-primary mb-3">Email Us</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {siteConfig.contact.email}<br/>
              admissions@tribhuvancollege.edu.np
            </p>
          </FadeIn>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-20">
          
          {/* Form */}
          <FadeIn>
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-border">
              <h2 className="font-display text-3xl font-bold text-primary mb-2">Send a Message</h2>
              <p className="text-muted-foreground text-sm mb-8">Fill out the form below and our team will get back to you within 24 hours.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">First Name</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="Ram" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Last Name</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="Thapa" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Email Address</label>
                  <input required type="email" className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="ram@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Subject</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none">
                    <option>General Inquiry</option>
                    <option>Admissions</option>
                    <option>Academic Programs</option>
                    <option>Alumni Relations</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Message</label>
                  <textarea required rows={5} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </FadeIn>

          {/* Map & Hours */}
          <FadeIn delay={0.2} className="space-y-8 flex flex-col">
            <div className="bg-secondary rounded-3xl p-8 border border-border flex-1">
               <h3 className="font-display text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-accent" />
                  Office Hours
                </h3>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center border-b border-border/50 pb-4">
                    <span className="font-semibold">Sunday - Thursday</span>
                    <span className="text-muted-foreground">9:00 AM - 5:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-border/50 pb-4">
                    <span className="font-semibold">Friday</span>
                    <span className="text-muted-foreground">9:00 AM - 1:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center pb-2 text-accent font-semibold">
                    <span>Saturday & Public Holidays</span>
                    <span>Closed</span>
                  </li>
                </ul>
            </div>
            
            <div className="rounded-3xl overflow-hidden shadow-lg border border-border h-[400px] bg-secondary relative">
              {/* Map Placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-gray-100">
                <MapPin className="w-12 h-12 mb-4 text-primary/30" />
                <p className="font-semibold text-lg text-primary">Interactive Map Placeholder</p>
                <p className="text-sm">Pulchowk Campus, Lalitpur, Nepal</p>
              </div>
            </div>
          </FadeIn>

        </div>
      </div>
    </PageTransition>
  );
}
