
import BlogDetails from "@/components/blogdetail/BlogDetails";

export const metadata = {
	title: "Medic Mode - Blogs",
	description: "This is a blog page",
	openGraph: {
	  title: "Medic Mode",
	  description: "This is a blog page",
	  url: "https://medicmode-seo.vercel.app/blogs", 
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
  

export default function Page ( {params}) {
	return (<BlogDetails slug={params.slug}/>
	)

	
	
}