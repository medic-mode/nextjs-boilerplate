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
		  url: "https://drive.google.com/file/d/1jyz9gBWj_W9JUsQ2B1QskPTaMJ6o6N1n/view?usp=drive_link", 
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