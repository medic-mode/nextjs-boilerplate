import "./globals.css";
import Script from 'next/script';
import { Montserrat } from 'next/font/google'
import AppShell from "@/components/AppShell";


const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100','200','300','400','500','600','700','800','900'],
  display: 'swap',
  variable: '--font-montserrat'
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${montserrat.className}`}>
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
      <body id="app-root">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
