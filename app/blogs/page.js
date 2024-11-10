import Blogs from "../../components/blogs/Blogs";

export const metadata = {
	title: "Medic Mode - Blogs",
	description: "Medicmode LLP’s blog provides expert insights, training tips, and industry updates to help paramedics and healthcare professionals stay informed and enhance care standards.",
	openGraph: {
	  title: "Medic Mode - Blogs",
	  description: "Medicmode LLP’s blog provides expert insights, training tips, and industry updates to help paramedics and healthcare professionals stay informed and enhance care standards.",
	  url: "https://medicmode.com/blogs", 
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
	return <Blogs />
}