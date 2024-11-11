import Careers from "@/components/careers/Careers";
import Careersn from "@/components/careersnew/Careersn";

export const metadata = {
	title: "Medic Mode - Careers",
	description: "A Gazette for Emergency Medical Professionals",
	openGraph: {
	  title: "Medic Mode - Careers",
	  description: "A Gazette for Emergency Medical Professionals",
	  url: "https://medicmode.com/careers", 
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
	return (
	// <Careersn /> 
	<Careers />
	)
	
}