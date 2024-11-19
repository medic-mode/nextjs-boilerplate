import {  getDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import JobDetails from '@/components/careersnew/JobDetails';
import CareersLayout from '@/components/careersnew/CareersLayout';

export async function generateMetadata({ params }) {
    
    
    const jobId = params.slug;
    const docRef = doc(db, 'jobs', jobId);
    const docSnap = await getDoc(docRef);
    
   
    
    const job = docSnap.data();

    

    return {
        title: `Medic Mode - ${job.jobTitle}`,
        openGraph: {
            title: job.jobTitle,
            url: `https://medicmode.com/careers/${jobId}`,
        },
    };
}

export default function Page({ params }) {
    return (
        <CareersLayout>
        <JobDetails slug={params.slug} />
        </CareersLayout>
	)
}
