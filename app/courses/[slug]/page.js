import {  getDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

import CourseDetail from '@/components/coursedetail/CourseDetail';

export async function generateMetadata({ params }) {
    const courseId = params.slug;
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

export default function Page({ params }) {
    return <CourseDetail slug={params.slug} />;
}
