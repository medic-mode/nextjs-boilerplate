
import Contact from "@/components/contact/Contact";

export const metadata = {
	title: "Medic Mode - Contact Us",
	description: "This is a Contact page",
	openGraph: {
	  title: "Medic Mode",
	  description: "This is a Contact page",
	  url: "https://medicmode-seo.vercel.app/contact", 
	  images: [
		{
		  url: "https://firebasestorage.googleapis.com/v0/b/medic-mode.appspot.com/o/thumbnails%2Fc1.PNG?alt=media&token=63edaf0a-8ffe-431d-ba8a-bdc17be61842", 
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