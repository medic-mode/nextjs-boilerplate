import Products from "@/components/products/Products";

export const metadata = {
	title: "Medic Mode - Products",
	description: "Explore our range of emergency medical products and services.",
	openGraph: {
	  title: "Medic Mode - Products",
	  description: "Explore our range of emergency medical products and services.",
	  url: "https://medicmode.com/products", 
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
	return <Products />
}