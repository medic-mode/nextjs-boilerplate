"use client"
import { AuthProvider } from "../components/AuthContext"
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import "./globals.css";
import { usePathname } from 'next/navigation'; 
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function RootLayout({ children }) {

  const pathname = usePathname();

  const isDashboard = pathname.startsWith('/dashboard') 
  

  return (
    <html lang="en">
      <body>
        <AuthProvider>
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
