import Blogs from "../../components/blogs/Blogs";

export const metadata = {
	title: "Medic Mode - Blogs",
	description: "Medicmode LLP’s blog provides expert insights, training tips, and industry updates to help paramedics and healthcare professionals stay informed and enhance care standards.",
	openGraph: {
	  title: "Medic Mode - Blogs",
	  description: "Medicmode LLP’s blog provides expert insights, training tips, and industry updates to help paramedics and healthcare professionals stay informed and enhance care standards.",
	  url: "https://nextjs-boilerplate-nine-theta-17.vercel.app/blogs", 
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
	return <Blogs />
}