import {  getDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import BlogDetail from '@/components/blogdetail/BlogDetails';

export async function generateMetadata({ params }) {
    
    const postId = params.slug;
    const docRef = doc(db, 'blogPosts', postId);
    const docSnap = await getDoc(docRef);
    
   
    
    const post = docSnap.data();

    

    return {
        title: `Medic Mode - ${post.title}`,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            images: post.thumbnail,
            url: `https://nextjs-boilerplate-nine-theta-17.vercel.app/blogs/${postId}`,
        },
    };
}

export default function Page({ params }) {
    return <BlogDetail slug={params.slug} />;
}
