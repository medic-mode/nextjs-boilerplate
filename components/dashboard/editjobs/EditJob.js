
import './EditJob.css'
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { db, storage } from '../../../lib/firebase'; // Adjust the path as necessary
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { toast, Toaster } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { useAuth } from '@/components/AuthContext';


const EditJob = () => {

    const searchParams = useSearchParams();  
    const jobId = searchParams.get('id');

    const {setLoading} = useAuth()


  const [jobTitle, setJobTitle] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [experience, setExperience] = useState('');
  const [jobType, setJobType] = useState('');
  const [content, setContent] = useState('');
  const [jobArea, setjobArea] = useState('');


  useEffect(() => {
    async function fetchJobData() {
      if (!jobId) return;

      try {
        const docRef = doc(db, 'jobs', jobId);  // Adjust collection name if needed
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const jobData = docSnap.data();
          
          setJobTitle(jobData.jobTitle || '');
          setCity(jobData.city || '');
          setState(jobData.state || '');
          setCountry(jobData.country || '');
          setExperience(jobData.experience || '');
          setJobType(jobData.jobType || '');
          setContent(jobData.content || '');
          setjobArea(jobData.jobArea || '')
        } else {
          setError("Job not found");
        }
      } catch (err) {
        setError("Error fetching job data");
      } finally {
        setLoading(false);
      }
    }

    fetchJobData();
  }, [jobId]);


  const navigate = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save the data to Firestore
      await updateDoc(doc(db, 'jobs', jobId), {
        jobTitle,
        city,
        state,
        country,
        experience,
        jobType,
        content,
        createdAt: new Date(),
        approved: false,
        jobArea
      });
     
      toast.success('Job updated successfully.', {
        duration: 3000 
      });
      navigate.push('/dashboard'); 
    } catch (error) {
      toast.error("Error updating document:");
    }
  };

  return (
    <div className="create-job-container">
      <h1>Edit Job</h1>
      <Toaster position="top-center" richColors/>
      <form onSubmit={handleSubmit}>
        <div className="p-field">
          <label htmlFor="jobTitle">Job Title</label>
          <InputText
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Enter Job Title"
            required
          />
        </div>

        <div className="p-field">
          <label htmlFor="city">City</label>
          <InputText
            type="text"
            id="city"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter City"
            required
          />
        </div>

        <div className="p-field">
          <label htmlFor="state">State</label>
          <InputText
            type="text"
            id="state"
            name="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Enter State"
            required
          />
        </div>

        <div className="p-field">
          <label htmlFor="country">Country</label>
          <InputText
            type="text"
            id="country"
            name="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Enter Country"
            required
          />
        </div>

        <div className="p-field">
          <label htmlFor="experience">Experience</label>
          <select
            id="experience"
            name="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
          >
            <option value="">Select Experience</option>
            <option value="Any">Any</option>
            <option value="Fresher">Fresher</option>
            <option value="1-3">1-3 Years</option>
            <option value="4-6">4-6 Years</option>
            <option value="6+">6+ Years</option>
          </select>
        </div>

        <div className="p-field">
          <label htmlFor="jobType">Job Type</label>
          <select
            id="jobType"
            name="jobType"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            required
          >
            <option value="">Select Job Type</option>
            <option value="Full-time">Full Time</option>
            <option value="Part-time">Part Time</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>

        <div className="p-field">
          <label htmlFor="jobArea">Job Area</label>
          <InputText
            type="text"
            id="jobArea"
            name="jobArea"
            value={jobArea}
            onChange={(e) => setjobArea(e.target.value)}
            placeholder="Enter Job Area"
            required
          />
        </div>

        <div className="p-field">
          <label htmlFor="content">Job Description</label>
          <Editor
            className="content-editor"
            id="content"
            value={content}
            onTextChange={(e) => setContent(e.htmlValue)} // Get the HTML value
            required
            style={{ minHeight: '300px', backgroundColor: 'white' }}
          />
        </div>

        <Button className="create-job-btn" type="submit" label="Update Job" />
      </form>
    </div>
  );
};

export default EditJob;
