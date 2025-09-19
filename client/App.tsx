import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import NotFound from "./pages/NotFound";
import AppLayout from "./pages/AppLayout";
import { lazy, Suspense, useEffect } from "react";
import { prefetchAllIdle } from "@/lib/prefetch";

const Generate = lazy(() => import("./pages/Generate"));
const History = lazy(() => import("./pages/History"));
const Library = lazy(() => import("./pages/Library"));
const Settings = lazy(() => import("./pages/Settings"));

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    prefetchAllIdle();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/app/generate" replace />} />
              <Route path="/app" element={<AppLayout />}>
                <Route index element={<Navigate to="generate" replace />} />
                <Route path="generate" element={<Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading…</div>}><Generate /></Suspense>} />
                <Route path="history" element={<Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading…</div>}><History /></Suspense>} />
                <Route path="library" element={<Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading…</div>}><Library /></Suspense>} />
                <Route path="settings" element={<Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading…</div>}><Settings /></Suspense>} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
