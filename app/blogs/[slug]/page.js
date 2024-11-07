// In your `page.js` file

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust the import path
import BlogDetails from "@/components/blogdetail/BlogDetails";

export async function generateMetadata({ params }) {
  const postId = params.slug;

  // Fetch blog post data
  const docRef = doc(db, 'blogPosts', postId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error('Post not found');
  }

  const postData = docSnap.data();

  // Define the metadata using the post data
  const metadata = {
    title: `Medic Mode - ${postData.title}`,
    description: postData.description,
    openGraph: {
      title: postData.title,
      description: postData.description,
      url: `https://yourwebsite.com/blogs/${postId}`, // Use your domain here
      images: [
        {
          url: postData.thumbnail,
          width: 1200,
          height: 630,
          alt: postData.title
        }
      ],
      site_name: "Medic Mode"
    }
  };

  return metadata;
}

export default async function Page({ params }) {
  const postId = params.slug;

  // Fetch post data for rendering
  const docRef = doc(db, 'blogPosts', postId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return <div>Post not found</div>;
  }

  const postData = docSnap.data();

  // Pass post data as a prop to the BlogDetails component
  return <BlogDetails postData={postData} />;
}
