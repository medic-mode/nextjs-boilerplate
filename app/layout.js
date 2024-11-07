import { AuthProvider } from "../components/AuthContext"
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <div className="content-wrapper">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
