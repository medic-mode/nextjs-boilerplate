"use client";
import { AuthProvider } from "../components/AuthContext";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import GoogleAnalytics from "@/components/GoogleAnalytics"; // Import the updated component
import "./globals.css";
import { usePathname, useRouter } from 'next/navigation';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Script from 'next/script';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { BlogProvider } from "@/components/BlogContext";
import ScrollToTop from "@/components/scrolltotop/ScrollToTop";

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
          <BlogProvider>
          <GoogleAnalytics gaId="G-KV23NQK3GB" />
          <div className="next-app">
            <div className="content-header">
              <Header />
            </div>
            {isDashboard ? (
              <DashboardLayout>{children}</DashboardLayout> 
            ) : (
              <div className="content-wrapper">
                {children}
              </div> 
            )}
            <div className="content-footer">
              <Footer />
            </div>
			<div className="float">
				<div className="scroll-to-top">
					<ScrollToTop />
				</div>
				<div className="whatsapp-float">
					<a href="https://wa.me/919008761372" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
						<WhatsAppIcon style={{ fontSize: '25px', color: 'white', cursor:'pointer' }} />
					</a>
				</div>
			</div>
          </div> 
          </BlogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
