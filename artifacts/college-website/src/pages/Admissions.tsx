import { useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, ChevronRight, AlertCircle, FileText } from "lucide-react";
import {
  useSubmitAdmission,
  type AdmissionApplicationResponse,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

// Zod schema matching the backend spec exactly
const admissionSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number required"),
  dateOfBirth: z.string().min(1, "Date of birth required"),
  gender: z.enum(["male", "female", "other"]),
  address: z.string().min(5, "Address is required"),
  district: z.string().min(2, "District is required"),
  program: z.string().min(2, "Program is required"),
  level: z.enum(["bachelor", "master", "phd"]),
  previousSchool: z.string().min(2, "Previous school is required"),
  gpa: z.string().optional(),
  message: z.string().optional(),
});

type AdmissionFormValues = z.infer<typeof admissionSchema>;

const NEPAL_DISTRICTS = [
  "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", 
  "Dharan", "Biratnagar", "Butwal", "Nepalgunj", "Dhangadhi", 
  "Hetauda", "Janakpur", "Birgunj"
];

const PROGRAMS = [
  "B.E. Civil", "B.E. Computer", "BBA", "BBS", "MBBS", "BDS", "BALLB"
];

export default function Admissions() {
  const [step, setStep] = useState(1);
  const [submittedData, setSubmittedData] =
    useState<AdmissionApplicationResponse | null>(null);
  const { toast } = useToast();
  
  const submitMutation = useSubmitAdmission();

  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      gender: "male",
      level: "bachelor",
      district: "Kathmandu",
      program: "B.E. Computer"
    },
    mode: "onTouched"
  });

  const onSubmit = async (data: AdmissionFormValues) => {
    try {
      const response = await submitMutation.mutateAsync({ data });
      setSubmittedData(response);
      setStep(4); // Success step
      toast({
        title: "Application Submitted Successfully",
        description: `Your application ID is #${response.id}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
      });
    }
  };

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger(["firstName", "lastName", "email", "phone", "dateOfBirth", "gender", "address", "district"]);
    } else if (step === 2) {
      isValid = await form.trigger(["program", "level", "previousSchool", "gpa"]);
    }
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <PageTransition>
      {/* Hero Header */}
      <div className="bg-slate-900 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-50 z-0" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-6">
            Begin Your Application
          </h1>
          <p className="text-lg text-slate-300">
            Join TCE for the 2081/2082 session. Fill out the form below to start your journey.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          
          {/* Progress Bar */}
          {step < 4 && (
            <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center flex-1 last:flex-none">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    step >= num ? "bg-primary text-white" : "bg-slate-200 text-slate-500"
                  }`}>
                    {num}
                  </div>
                  {num < 3 && (
                    <div className={`flex-1 h-1 mx-4 rounded-full transition-colors ${
                      step > num ? "bg-primary" : "bg-slate-200"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="p-8 md:p-12">
            {step === 4 && submittedData ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Application Submitted!</h2>
                <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
                  Thank you, {submittedData.firstName}. Your application for {submittedData.program} has been received successfully.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 inline-block mb-8 text-left">
                  <p className="text-sm text-slate-500 mb-1">Application Tracking ID</p>
                  <p className="text-2xl font-mono font-bold text-slate-900">#{submittedData.id}</p>
                </div>
                <div>
                  <Button onClick={() => window.location.href="/"} variant="outline" size="lg" className="rounded-full">
                    Return to Home
                  </Button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold text-slate-900 mb-6">1. Personal Information</h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" {...form.register("firstName")} className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary" placeholder="Ram" />
                          {form.formState.errors.firstName && <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" {...form.register("lastName")} className="h-12 bg-slate-50 border-slate-200" placeholder="Sharma" />
                          {form.formState.errors.lastName && <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" {...form.register("email")} className="h-12 bg-slate-50 border-slate-200" placeholder="ram@example.com" />
                          {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" {...form.register("phone")} className="h-12 bg-slate-50 border-slate-200" placeholder="+977-98XXXXXXXX" />
                          {form.formState.errors.phone && <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth (AD)</Label>
                          <Input id="dateOfBirth" type="date" {...form.register("dateOfBirth")} className="h-12 bg-slate-50 border-slate-200" />
                          {form.formState.errors.dateOfBirth && <p className="text-sm text-red-500">{form.formState.errors.dateOfBirth.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <select id="gender" {...form.register("gender")} className="flex h-12 w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address line</Label>
                        <Input id="address" {...form.register("address")} className="h-12 bg-slate-50 border-slate-200" placeholder="Gwarko, Lalitpur" />
                        {form.formState.errors.address && <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="district">District</Label>
                        <select id="district" {...form.register("district")} className="flex h-12 w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                          {NEPAL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold text-slate-900 mb-6">2. Academic Information</h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="level">Study Level</Label>
                          <select id="level" {...form.register("level")} className="flex h-12 w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            <option value="bachelor">Bachelor's Degree</option>
                            <option value="master">Master's Degree</option>
                            <option value="phd">PhD</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="program">Program</Label>
                          <select id="program" {...form.register("program")} className="flex h-12 w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="previousSchool">Previous School / College</Label>
                        <Input id="previousSchool" {...form.register("previousSchool")} className="h-12 bg-slate-50 border-slate-200" placeholder="Trinity International College" />
                        {form.formState.errors.previousSchool && <p className="text-sm text-red-500">{form.formState.errors.previousSchool.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gpa">GPA / Percentage (Latest)</Label>
                        <Input id="gpa" {...form.register("gpa")} className="h-12 bg-slate-50 border-slate-200" placeholder="e.g. 3.8 or 85%" />
                      </div>

                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start mt-6">
                        <FileText className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <strong>Note on Documents:</strong> You will be required to bring physical copies of your transcripts and citizenship certificate during the interview phase. Do not upload them here.
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div 
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold text-slate-900 mb-6">3. Review & Submit</h3>
                      
                      <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 space-y-4 text-sm">
                        <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-4">
                          <div>
                            <span className="text-slate-500 block mb-1">Full Name</span>
                            <span className="font-semibold text-slate-900">{form.getValues("firstName")} {form.getValues("lastName")}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block mb-1">Email</span>
                            <span className="font-semibold text-slate-900">{form.getValues("email")}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-4">
                          <div>
                            <span className="text-slate-500 block mb-1">Program</span>
                            <span className="font-semibold text-slate-900">{form.getValues("program")} ({form.getValues("level")})</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block mb-1">Address</span>
                            <span className="font-semibold text-slate-900">{form.getValues("address")}, {form.getValues("district")}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Additional Message / Statement of Purpose (Optional)</Label>
                        <Textarea id="message" {...form.register("message")} className="min-h-[120px] bg-slate-50 border-slate-200" placeholder="Why do you want to join TCE?" />
                      </div>

                      {Object.keys(form.formState.errors).length > 0 && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
                          <AlertCircle className="w-5 h-5 mr-2" />
                          Please fix the errors in previous steps before submitting.
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={prevStep} className="h-12 px-6 rounded-full border-slate-200">
                      Back
                    </Button>
                  ) : <div></div>}
                  
                  {step < 3 ? (
                    <Button type="button" onClick={nextStep} className="h-12 px-8 rounded-full bg-slate-900 text-white hover:bg-slate-800">
                      Continue <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={submitMutation.isPending}
                      className="h-12 px-8 rounded-full bg-gradient-to-r from-primary to-violet-600 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                      {submitMutation.isPending ? "Submitting..." : "Submit Application"}
                    </Button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
