import Home from "../components/home/Home";

export const metadata = {
	title: "Medic Mode",
	description: "A Gazette for Emergency Medical Professionals - Empowering paramedics and first responders with innovative training, research, and community-focused initiatives to create a safer, more prepared India.",
	openGraph: {
	  title: "Medic Mode",
	  description: "A Gazette for Emergency Medical Professionals - Empowering paramedics and first responders with innovative training, research, and community-focused initiatives to create a safer, more prepared India.",
	  url: "https://medicmode.com/", 
	  images: [
		{
		  url: "https://firebasestorage.googleapis.com/v0/b/medic-mode.appspot.com/o/logo%2Fmedicmode.png?alt=media&token=8ea38f8d-fabd-49af-adb6-d1a94042f3fc", 
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