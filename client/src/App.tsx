import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";

import { ReactLenis } from "lenis/react";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Programs from "@/pages/Programs";
import ProgramDetail from "@/pages/ProgramDetail";
import Admissions from "@/pages/Admissions";
import Faculty from "@/pages/Faculty";
import FacultyDetail from "@/pages/FacultyDetail";
import News from "@/pages/News";
import NewsDetail from "@/pages/NewsDetail";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("nepalaya_loaded");
    if (hasLoaded) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("nepalaya_loaded", "true");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center"
        >
          <div className="relative flex flex-col items-center">
            <div className="relative w-24 h-24 flex items-center justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary"
              />
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white font-display font-bold text-xl md:text-2xl mb-8"
            >
      Nepalaya Education Foundation
            </motion.h2>

            <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin/:rest*" component={Admin} />
      <Route path="/admin" component={Admin} />
      <Route>
        <Layout>
          <AnimatePresence mode="wait">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/programs" component={Programs} />
              <Route path="/programs/:id" component={ProgramDetail} />
              <Route path="/admissions" component={Admissions} />
              <Route path="/faculty" component={Faculty} />
              <Route path="/faculty/:id" component={FacultyDetail} />
              <Route path="/news" component={News} />
              <Route path="/news/:id" component={NewsDetail} />
              <Route path="/contact" component={Contact} />
              <Route component={NotFound} />
            </Switch>
          </AnimatePresence>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LoadingScreen />
        <ReactLenis root options={{ duration: 1.2, smoothWheel: true }}>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </ReactLenis>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
