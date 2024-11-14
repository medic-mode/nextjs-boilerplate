
import './CreateJobs.css'
import { useState } from 'react';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { db } from '../../../lib/firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { InputText } from 'primereact/inputtext';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';


const CreateJobs = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [experience, setExperience] = useState('');
  const [jobType, setJobType] = useState('');
  const [content, setContent] = useState('');
  const [jobArea, setjobArea] = useState('');


  const navigate = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save the data to Firestore
      const docRef = await addDoc(collection(db, 'jobs'), {
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
      console.log("Job created with ID: ", docRef.id);
      // Clear the form fields after successful submission
      setJobTitle('');
      setCity('');
      setState('');
      setCountry('');
      setExperience('');
      setJobType('');
      setContent('');
      setjobArea('')
      toast.success('Job saved successfully.', {
        duration: 3000 
      });
      navigate.push('/dashboard'); 
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="create-job-container">
      <h1>Create Jobs</h1>
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
           
          >
            <option value="">Select Experience</option>
            <option value="Any">Any</option>
            <option value="Fresher">Fresher</option>
            <option value="1-3 years">1-3 Years</option>
            <option value="4-6 years">4-6 Years</option>
            <option value="6+ years">6+ Years</option>
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
            <option value="Full-Time">Full Time</option>
            <option value="Part-Time">Part Time</option>
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
          <label htmlFor="content">Content</label>
          <Editor
            className="content-editor"
            id="content"
            value={content}
            onTextChange={(e) => setContent(e.htmlValue)} // Get the HTML value
            required
            style={{ minHeight: '300px', backgroundColor: 'white' }}
          />
        </div>

        <Button className="create-job-btn" type="submit" label="Create Job" />
      </form>
    </div>
  );
};

export default CreateJobs;
