import About from "../../components/about/About"

export const metadata = {
	title: "Medic Mode - About Us",
	description: "A Gazette for Emergency Medical Professionals",
	openGraph: {
	  title: "Medic Mode",
	  description: "A Gazette for Emergency Medical Professionals",
	  url: "https://medicmode-seo.vercel.app/about", 
	  images: [
		{
		  url: "https://samuel-ponraj.github.io/medic-mode/images/og-image.jpg", 
		  width: 1200,
		  height: 630,
		  alt: "Medic Mode - Emergency Medical Gazette"
		}
	  ],
	  site_name: "Medic Mode"
	}
  };
  

export default function Page () {
	return <About />
}