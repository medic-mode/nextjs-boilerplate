"use client";

import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { usePathname } from "next/navigation";
import { BlogProvider } from "@/app/context/BlogContext";
import ScrollToTop from "@/components/scrolltotop/ScrollToTop";
import { Toaster } from "sonner";
import { AuthProvider } from "@/app/context/AuthContext";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      <Toaster position="top-center" richColors />
      <AuthProvider>
        <BlogProvider>
          <GoogleAnalytics gaId="G-KV23NQK3GB" />
          <div className="next-app">
            <div className="content-header">
              <Header />
            </div>
            {isDashboard ? (
              <DashboardLayout>{children}</DashboardLayout>
            ) : (
              <div className="content-wrapper">{children}</div>
            )}
            <div className="content-footer">
              <Footer />
            </div>
            <div className="float">
              <div className="scroll-to-top">
                <ScrollToTop />
              </div>
              <div className="whatsapp-float">
                <a
                  href="https://wa.me/919008761372"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with us on WhatsApp"
                >
                  <WhatsAppIcon
                    style={{
                      fontSize: "25px",
                      color: "white",
                      cursor: "pointer",
                    }}
                  />
                </a>
              </div>
            </div>
          </div>
        </BlogProvider>
      </AuthProvider>
    </>
  );
}
