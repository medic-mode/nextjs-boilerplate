import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import BlogDetail from '../../../components/blogdetail/BlogDetails';

export async function generateMetadata({ params }) {
    const postId = params.slug;
    const docRef = doc(db, 'blogPosts', postId);

    try {
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error('Blog post not found');
        }

        const post = docSnap.data();

        return {
            title: `Medic Mode - ${post.title || 'Untitled'}`,
            description: post.description || 'No description available',
            openGraph: {
                title: post.title || 'Untitled',
                description: post.description || 'No description available',
                images: post.thumbnail || '/default-thumbnail.jpg', // Provide a default thumbnail
                url: `https://medicmode.com/blogs/${postId}`,
            },
        };
    } catch (error) {
        console.error('Error fetching blog metadata:', error);

        return {
            title: 'Medic Mode - Blog',
            description: 'Discover insightful content on Medic Mode.',
        };
    }
}

export default function Page({ params }) {
    return (
       
            <BlogDetail slug={params.slug} />
        
    );
}
