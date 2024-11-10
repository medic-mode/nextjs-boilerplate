
import Courses from "../../components/courses/Courses";

export const metadata = {
	title: "Medic Mode - Courses",
	description: "Medicmode LLP’s course offers high-quality, accessible training programs designed to enhance the skills and knowledge of paramedics and healthcare professionals, empowering them to deliver exceptional care.",
	openGraph: {
	  title: "Medic Mode - Courses",
	  description: "Medicmode LLP’s course offers high-quality, accessible training programs designed to enhance the skills and knowledge of paramedics and healthcare professionals, empowering them to deliver exceptional care.",
	  url: "https://medicmode.com/courses", 
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
	return <Courses />
}