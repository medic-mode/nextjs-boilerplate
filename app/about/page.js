import About from "../../components/about/About"

export const metadata = {
	title: "Medic Mode - About Us",
	description: "Medicmode LLP is a paramedic-led organization focused on the welfare, development, and ongoing education of paramedics and healthcare professionals across India. We prioritize accessible, high-quality training to ensure paramedics are equipped with the knowledge and skills needed to deliver exceptional care in a constantly evolving field.",
	openGraph: {
	  title: "Medic Mode - About Us",
	  description: "Medicmode LLP is a paramedic-led organization focused on the welfare, development, and ongoing education of paramedics and healthcare professionals across India. We prioritize accessible, high-quality training to ensure paramedics are equipped with the knowledge and skills needed to deliver exceptional care in a constantly evolving field.",
	  url: "https://medicmode-seo.vercel.app/about", 
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
	return <About />
}