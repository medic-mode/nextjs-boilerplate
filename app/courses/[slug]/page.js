import {  getDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

import CourseDetail from '@/components/coursedetail/CourseDetail';

export async function generateMetadata({ params }) {
    const courseId = params.slug;
    const docRef = doc(db, 'courses', courseId);
    const docSnap = await getDoc(docRef);
    
   
    
    const course = docSnap.data();

    

    return {
        title: `Medic Mode - ${course.courseTitle}`,
        description: course.courseDescription,
        openGraph: {
            title: course.courseTitle,
            description: course.courseDescription,
            images: course.thumbnail,
            url: `https://nextjs-boilerplate-nine-theta-17.vercel.app/blogs/${courseId}`,
        },
    };
}

export default function Page({ params }) {
    return <CourseDetail slug={params.slug} />;
}