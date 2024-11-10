
import Contact from "@/components/contact/Contact";

export const metadata = {
	title: "Medic Mode - Contact Us",
	description: "Your thoughts and inquiries are important to us! Don't hesitate to contact our team for assistance or to share your ideas.",
	openGraph: {
	  title: "Medic Mode - Contact Us",
	  description: "Your thoughts and inquiries are important to us! Don't hesitate to contact our team for assistance or to share your ideas.",
	  url: "https://medicmode-seo.vercel.app/contact", 
	  images: [
		{
		  url: "https://firebasestorage.googleapis.com/v0/b/medic-mode.appspot.com/o/thumbnails%2Fmedicmode.jpg?alt=media&token=edae836c-b34a-419c-a1c8-89a22f317c3f", 
		  width: 1200,
		  height: 630,
		  alt: "Medic Mode - Emergency Medical Gazette"
		}
	  ],
	  site_name: "Medic Mode"
	}
  };
  

export default function Page () {
	return <Contact />
}