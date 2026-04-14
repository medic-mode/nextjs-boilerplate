import {  getDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

import CourseDetail from '@/components/coursedetail/CourseDetail';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const courseId = slug;
    const docRef = doc(db, 'courses', courseId);
    const docSnap = await getDoc(docRef);
    
   
    
    const course = docSnap.data();

    const cleanDescription = course.courseDescription.replace(/<\/?[^>]+(>|$)/g, "");

    return {
        title: `Medic Mode - ${course.courseTitle}`,
        description: cleanDescription,
        openGraph: {
            title: course.courseTitle,
            description: cleanDescription,
            images: course.thumbnail,
            url: `https://medicmode.com/courses/${courseId}`,
        },
    };
}

export default async function Page({ params }) {
    const { slug } = await params;

    return <CourseDetail slug={slug} />
}
