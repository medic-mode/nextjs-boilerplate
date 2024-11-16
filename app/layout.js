"use client";
import { AuthProvider } from "../components/AuthContext";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import GoogleAnalytics from "@/components/GoogleAnalytics"; // Import the updated component
import "./globals.css";
import { usePathname } from 'next/navigation';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Script from 'next/script';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-KV23NQK3GB`}
          strategy="afterInteractive"
        />
        
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KV23NQK3GB', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
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
          </div> 
        </AuthProvider>
      </body>
    </html>
  );
}
