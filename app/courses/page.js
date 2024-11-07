
import Courses from "../../components/courses/Courses";

export const metadata = {
	title: "Medic Mode - Courses",
	description: "This is a Courses page",
	openGraph: {
	  title: "Medic Mode",
	  description: "This is a Courses page",
	  url: "https://medicmode-seo.vercel.app/courses", 
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
	return <Courses />
}