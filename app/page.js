import Home from "../components/home/Home";

export const metadata = {
	title: "Medic Mode",
	description: "A Gazette for Emergency Medical Professionals - Empowering paramedics and first responders with innovative training, research, and community-focused initiatives to create a safer, more prepared India.",
	openGraph: {
	  title: "Medic Mode",
	  description: "A Gazette for Emergency Medical Professionals - Empowering paramedics and first responders with innovative training, research, and community-focused initiatives to create a safer, more prepared India.",
	  url: "https://medicmode-updated.vercel.app/", 
	  images: [
		{
		  url: "https://firebasestorage.googleapis.com/v0/b/medic-mode.appspot.com/o/logo%2Fmedicmode.png?alt=media&token=4ab025c7-f186-4b51-a8e5-b408e21f327c", 
		  width: 1200,
		  height: 630,
		  alt: "Medic Mode - Emergency Medical Gazette"
		}
	  ],
	  site_name: "Medic Mode"
	}
  };
  

export default function Page () {
	return <Home />
}