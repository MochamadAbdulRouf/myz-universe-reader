import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import ComicList from "./pages/ComicList";
import ComicDetail from "./pages/ComicDetail";
import Reader from "./pages/Reader";
import Genre from "./pages/Genre";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/komik" element={<ComicList />} />
            <Route path="/komik/:slug" element={<ComicDetail />} />
            <Route path="/baca/:slug/:chapter" element={<Reader />} />
            <Route path="/genre" element={<Genre />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
