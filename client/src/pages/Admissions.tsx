import { useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle, 
  FileText, 
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  BookOpen,
  School,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Target,
  Award,
  Building2,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// Zod schema matching the backend spec exactly
const admissionSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
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

interface AdmissionResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  program: string;
  level: string;
  status: string;
  appliedDate: string;
}

const NEPAL_DISTRICTS = [
  "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", 
  "Dharan", "Biratnagar", "Butwal", "Nepalgunj", "Dhangadhi", 
  "Hetauda", "Janakpur", "Birgunj", "Bardiya", "Kailali", "Kanchanpur"
];

const PROGRAMS = [
  "B.E. Civil Engineering",
  "B.E. Computer Engineering", 
  "B.E. Electrical Engineering",
  "B.E. Mechanical Engineering",
  "Bachelor of Business Administration (BBA)",
  "Bachelor of Business Studies (BBS)",
  "Bachelor of Science (B.Sc.)",
  "Master of Business Administration (MBA)",
  "Master of Computer Science (MSc CS)",
  "PhD in Engineering"
];

export default function Admissions() {
  const [step, setStep] = useState(1);
  const [submittedData, setSubmittedData] = useState<AdmissionResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      gender: "male",
      level: "bachelor",
      district: "Kathmandu",
      program: "B.E. Computer Engineering",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      previousSchool: "",
      gpa: "",
      message: ""
    },
    mode: "onTouched"
  });

  const onSubmit = async (data: AdmissionFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/admissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Submission failed");
      }

      const result = await response.json();
      
      setSubmittedData({
        id: result._id || result.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        program: data.program,
        level: data.level,
        status: "pending",
        appliedDate: new Date().toISOString()
      });
      
      setStep(4);
      
      toast({
        title: "Application Submitted Successfully!",
        description: `Your application ID is #${result._id || result.id}. We'll contact you soon.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "There was an error submitting your application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger([
        "firstName", "lastName", "email", "phone", 
        "dateOfBirth", "gender", "address", "district"
      ]);
    } else if (step === 2) {
      isValid = await form.trigger(["program", "level", "previousSchool"]);
    }
    if (isValid) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <PageTransition>
      {/* Simple Hero Header - No Text */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Admission Application
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-sky-500 mx-auto mt-4 rounded-full" />
          </div>
        </div>
      </div>

      {/* Application Form - Centered Layout */}
      <div className="bg-gradient-to-br from-slate-50 to-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            
            {/* Progress Steps - Simplified */}
            {step < 4 && (
              <div className="border-b border-slate-200 bg-white px-8 py-6">
                <div className="flex items-center justify-center gap-4">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                          step >= num
                                ? "bg-gradient-to-r from-primary to-sky-500 text-white shadow-md"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
                      </div>
                      {num < 3 && (
                        <div
                          className={`w-16 h-0.5 mx-2 transition-all ${
                            step > num ? "bg-gradient-to-r from-primary to-sky-500" : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-24 mt-3">
                  <span className={`text-xs font-semibold ${step === 1 ? "text-primary" : "text-slate-400"}`}>
                    Personal
                  </span>
                  <span className={`text-xs font-semibold ${step === 2 ? "text-primary" : "text-slate-400"}`}>
                    Academic
                  </span>
                  <span className={`text-xs font-semibold ${step === 3 ? "text-primary" : "text-slate-400"}`}>
                    Review
                  </span>
                </div>
              </div>
            )}

            <div className="p-8 md:p-10 text-slate-900">
              {step === 4 && submittedData ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-blue-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
                  <p className="text-slate-600 mb-6">
                    Thank you, {submittedData.firstName} {submittedData.lastName}
                  </p>
                  
                  <div className="bg-slate-50 rounded-xl p-6 inline-block mb-6">
                    <p className="text-sm text-slate-500 mb-1">Application ID</p>
                    <p className="text-2xl font-mono font-bold text-primary">
                      #{submittedData.id.slice(-8)}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-slate-500">
                      A confirmation email has been sent to {submittedData.email}
                    </p>
                    <Button 
                      onClick={() => window.location.href = "/"} 
                      variant="outline"
                    >
                      Return to Home
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-5"
                      >
                        <div className="grid md:grid-cols-2 gap-5">
                          <div>
                            <Label className="text-sm font-semibold mb-1.5 block">First Name *</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input 
                                {...form.register("firstName")} 
                                className="pl-10 h-11 bg-slate-50 border-slate-200" 
                                placeholder="Ram"
                              />
                            </div>
                            {form.formState.errors.firstName && (
                              <p className="text-xs text-red-500 mt-1">{form.formState.errors.firstName.message}</p>
                            )}
                          </div>
                          <div>
                            <Label className="text-sm font-semibold mb-1.5 block">Last Name *</Label>
                            <Input 
                              {...form.register("lastName")} 
                              className="h-11 bg-slate-50 border-slate-200" 
                              placeholder="Sharma"
                            />
                            {form.formState.errors.lastName && (
                              <p className="text-xs text-red-500 mt-1">{form.formState.errors.lastName.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                          <div>
                            <Label className="text-sm font-semibold mb-1.5 block">Email Address *</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input 
                                type="email" 
                                {...form.register("email")} 
                                className="pl-10 h-11 bg-slate-50 border-slate-200" 
                                placeholder="ram.sharma@example.com"
                              />
                            </div>
                            {form.formState.errors.email && (
                              <p className="text-xs text-red-500 mt-1">{form.formState.errors.email.message}</p>
                            )}
                          </div>
                          <div>
                            <Label className="text-sm font-semibold mb-1.5 block">Phone Number *</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input 
                                {...form.register("phone")} 
                                className="pl-10 h-11 bg-slate-50 border-slate-200" 
                                placeholder="+977-98XXXXXXXX"
                              />
                            </div>
                            {form.formState.errors.phone && (
                              <p className="text-xs text-red-500 mt-1">{form.formState.errors.phone.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                          <div>
                            <Label className="text-sm font-semibold mb-1.5 block">Date of Birth *</Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input 
                                type="date" 
                                {...form.register("dateOfBirth")} 
                                className="pl-10 h-11 bg-slate-50 border-slate-200"
                              />
                            </div>
                            {form.formState.errors.dateOfBirth && (
                              <p className="text-xs text-red-500 mt-1">{form.formState.errors.dateOfBirth.message}</p>
                            )}
                          </div>
                          <div>
                            <Label className="text-sm font-semibold mb-1.5 block">Gender *</Label>
                            <select 
                              {...form.register("gender")} 
                              className="w-full h-11 px-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-semibold mb-1.5 block">Address *</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input 
                              {...form.register("address")} 
                              className="pl-10 h-11 bg-slate-50 border-slate-200" 
                              placeholder="Gwarko, Lalitpur"
                            />
                          </div>
                          {form.formState.errors.address && (
                            <p className="text-xs text-red-500 mt-1">{form.formState.errors.address.message}</p>
                          )}
                        </div>

                        <div>
                          <Label className="text-sm font-semibold mb-1.5 block">District *</Label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select 
                              {...form.register("district")} 
                              className="w-full h-11 pl-10 pr-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                              {NEPAL_DISTRICTS.map(d => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-5"
                      >
                        <div className="grid md:grid-cols-2 gap-5">
                          <div>
                            <Label className="text-sm font-semibold mb-1.5 block">Study Level *</Label>
                            <div className="relative">
                              <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <select 
                                {...form.register("level")} 
                                className="w-full h-11 pl-10 pr-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                              >
                                <option value="bachelor">Bachelor's Degree</option>
                                <option value="master">Master's Degree</option>
                                <option value="phd">PhD</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-semibold mb-1.5 block">Program *</Label>
                            <div className="relative">
                              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <select 
                                {...form.register("program")} 
                                className="w-full h-11 pl-10 pr-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                              >
                                {PROGRAMS.map(p => (
                                  <option key={p} value={p}>{p}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-semibold mb-1.5 block">Previous School / College *</Label>
                          <div className="relative">
                            <School className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input 
                              {...form.register("previousSchool")} 
                              className="pl-10 h-11 bg-slate-50 border-slate-200" 
                              placeholder="Trinity International College"
                            />
                          </div>
                          {form.formState.errors.previousSchool && (
                            <p className="text-xs text-red-500 mt-1">{form.formState.errors.previousSchool.message}</p>
                          )}
                        </div>

                        <div>
                          <Label className="text-sm font-semibold mb-1.5 block">GPA / Percentage</Label>
                          <div className="relative">
                            <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input 
                              {...form.register("gpa")} 
                              className="pl-10 h-11 bg-slate-50 border-slate-200" 
                              placeholder="e.g., 3.8 or 85%"
                            />
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-blue-700">
                            <span className="font-semibold">Note:</span> Physical copies of transcripts and citizenship will be required during the interview.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div 
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-6"
                      >
                        <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                          <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200">
                            <div>
                              <p className="text-xs text-slate-500 uppercase">Full Name</p>
                              <p className="font-medium text-slate-900">
                                {form.getValues("firstName")} {form.getValues("lastName")}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 uppercase">Email</p>
                              <p className="text-sm text-slate-700">{form.getValues("email")}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200">
                            <div>
                              <p className="text-xs text-slate-500 uppercase">Program</p>
                              <p className="font-medium text-primary">{form.getValues("program")}</p>
                              <p className="text-xs text-slate-400 capitalize mt-1">{form.getValues("level")}'s Degree</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 uppercase">Previous School</p>
                              <p className="text-sm text-slate-700">{form.getValues("previousSchool")}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-slate-500 uppercase">GPA/Percentage</p>
                              <p className="text-sm text-slate-700">{form.getValues("gpa") || "Not provided"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 uppercase">Location</p>
                              <p className="text-sm text-slate-700">{form.getValues("address")}, {form.getValues("district")}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-semibold mb-2 block">Statement of Purpose (Optional)</Label>
                          <Textarea 
                            {...form.register("message")} 
                            className="min-h-[100px] bg-slate-50 border-slate-200 resize-none" 
                            placeholder="Why do you want to join Nepalaya Educational Foundation? Share your goals and aspirations..."
                          />
                        </div>

                        {Object.keys(form.formState.errors).length > 0 && (
                          <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-start gap-2 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>Please fix the errors in previous steps before submitting.</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
                    {step > 1 ? (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={prevStep}
                        disabled={isSubmitting}
                      >
                        Back
                      </Button>
                    ) : <div />}
                    
                    {step < 3 ? (
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        className="bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md hover:shadow-lg"
                      >
                        Continue
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md hover:shadow-lg min-w-[120px]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}