"use client";
import "./globals.css";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import GoogleAnalytics from "@/components/GoogleAnalytics"; 
import { usePathname } from 'next/navigation';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Script from 'next/script';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { BlogProvider } from "./context/BlogContext";
import ScrollToTop from "@/components/scrolltotop/ScrollToTop";
import { Montserrat } from 'next/font/google'
import { Toaster } from 'sonner';
import { AuthProvider } from "./context/AuthContext";


const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100','200','300','400','500','600','700','800','900'],
  display: 'swap',
  variable: '--font-montserrat'
})

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');


  return (
    <html lang="en" className={montserrat.variable}>
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
      <body className={montserrat.className} id="app-root">
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
