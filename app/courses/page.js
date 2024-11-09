
import Courses from "../../components/courses/Courses";

export const metadata = {
	title: "Medic Mode - Courses",
	description: "Medicmode LLP’s course offers high-quality, accessible training programs designed to enhance the skills and knowledge of paramedics and healthcare professionals, empowering them to deliver exceptional care.",
	openGraph: {
	  title: "Medic Mode - Courses",
	  description: "Medicmode LLP’s course offers high-quality, accessible training programs designed to enhance the skills and knowledge of paramedics and healthcare professionals, empowering them to deliver exceptional care.",
	  url: "https://medicmode-seo.vercel.app/courses", 
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
	return <Courses />
}