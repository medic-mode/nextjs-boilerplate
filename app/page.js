import Home from "../components/home/Home";


export const metadata = {
	title: "Medic Mode",
	description: "A Gazette for Emergency Medical Professionals",
	openGraph: {
	  title: "Medic Mode",
	  description: "A Gazette for Emergency Medical Professionals",
	  url: "https://medicmode-seo.vercel.app/", 
	  
	  site_name: "Medic Mode"
	}
  };
  

export default function Page () {
	return (
	<>
	<Home />
	</>)
}