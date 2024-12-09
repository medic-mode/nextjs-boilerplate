"use client"
import React, { useEffect, useState } from 'react';
import './Signup.css';
import CloseIcon from '@mui/icons-material/Close';
import { collection, query, where, getDocs, addDoc } from "firebase/firestore"; // Firestore functions
import { db } from '../../lib/firebase'; // Firebase config
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast, Toaster } from 'sonner';

const Signup = ({ setIsSignUp, handleClose, error, setError }) => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [dob, setDob] = useState('');
	const [gender, setGender] = useState('');
	const [nationality, setNationality] = useState('');
	const [status, setStatus] = useState('');
	const [jobTitle, setJobTitle] = useState('');
	const [experience, setExperience] = useState('');
	const [organization, setOrganization] = useState('');
	const [email, setEmail] = useState('');
	const [isValidEmail, setIsValidEmail] = useState(true);
	const [phone, setPhone] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [country, setCountry] = useState('');
	const [postalCode, setPostalCode] = useState('');
	const [preferredContact, setPreferredContact] = useState('');
	const [referral, setReferral] = useState('');
	const [password, setPassword] = useState('');

	const [countries, setCountries] = useState([])
	const [otherStatus, setOtherStatus] = useState('');
	const [otherReferral, setOtherReferral] = useState(''); 



  const handleSignup = async (e) => {

	e.preventDefault();

	if (!phone || phone === '91' || !/^\d{2}\d{10}$/.test(phone)) {
		setError('Phone number is required and should contain country code followed by 10 digits');
		return;
	  }
	  
  

    try {
      // Query Firestore to check if email or phone already exists
      const usersRef = collection(db, "users");

      // Check for existing email
      const emailQuery = query(usersRef, where("email", "==", email));
      const emailSnapshot = await getDocs(emailQuery);
      if (!emailSnapshot.empty) {
        setError('Email already exists.');
        return;
      }

      // Check for existing phone number
      const phoneQuery = query(usersRef, where("phone", "==", phone));
      const phoneSnapshot = await getDocs(phoneQuery);
      if (!phoneSnapshot.empty) {
        setError('Phone number already exists.');
        return;
      }
      
  
      // If no existing email or phone, add new user to Firestore
      await addDoc(usersRef, {
		createdAt: new Date(),
        firstName: firstName,
		lastName: lastName,
		dob: dob,
		gender: gender,
        nationality: nationality,
		status: status,
		otherStatus: otherStatus,
		jobTitle: jobTitle,
        experience: experience,
		organization: organization,
		email: email,
		phone: phone,
		city: city,
		state: state,
		country: country,
		postalCode: postalCode,
		referral: referral,
		otherReferral: otherReferral,
		password:password
      });
	  
	  	setFirstName(''); 
        setLastName(''); 
        setDob(''); 
        setGender(''); 
        setNationality(''); 
        setStatus(''); 
        setOtherStatus(''); 
        setJobTitle(''); 
        setExperience(''); 
        setOrganization(''); 
        setEmail(''); 
        setPhone('');
        setCity(''); 
        setState(''); 
        setCountry(''); 
        setPostalCode(''); 
        setReferral(''); 
        setOtherReferral(''); 
        setPassword('');

      setError('');  
	  toast.success('Registration successful! Welcome!', {
		duration: 3000 
		}); 
      handleClose();
    } catch (error) {
      console.error("Error signing up:", error);
	  toast.error('An error occurred. Please try again later.', {
		duration: 3000 
		}); 
    }

  };

//   useEffect(() => {
//     const fetchCountries = async () => {
//       try {
//         const response = await fetch('https://restcountries.com/v3.1/all');
//         const data = await response.json();
//         const countryNames = data.map((country) => country.name.common).sort();
//         setCountries(countryNames);
//       } catch (error) {
//         console.error('Error fetching country data:', error);
//       }
//     };

//     fetchCountries();
//   }, []);


  /**************Email validation************************/

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const inputEmail = e.target.value.toLowerCase();
    setEmail(inputEmail);
    setIsValidEmail(validateEmail(inputEmail)); 
  };

   /**************Other Status************************/

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatus(value);

    // If "Other" is selected, clear the otherStatus input
    if (value !== 'other') {
      setOtherStatus('');
    }
  };

  const handleOtherStatusChange = (e) => {
    const value = e.target.value;
    setOtherStatus(value);
  };

   /**************Other Referral************************/

   const handleReferralChange = (e) => {
    const value = e.target.value;
    setReferral(value);

    // If "Other" is selected, clear the otherReferral input
    if (value !== 'other') {
      setOtherReferral('');
    }
  };

  const handleOtherReferralChange = (e) => {
    const value = e.target.value;
    setOtherReferral(value);
  };

  return (
    <div className='signup'>
		<Toaster position="top-center" richColors /> 
      <CloseIcon className='close-modal' onClick={handleClose} />
      <div className="login-logo">
        <img src='/assets/logos/medicmode-logo.png' alt="" width='100px' height='45px' />
      </div>
      <div className="signup-form">
        <h1 style={{marginBottom: '20px'}}>Sign Up</h1>
        <form className="form" onSubmit={handleSignup}>
		<div className="personal-info">
			<p>Personal Information</p>
			<div className="row">
				<div className="item">
				<label htmlFor="first-name">First name</label>
				<input
				type="text"
				id="first-name"
				placeholder="First name"
				value={firstName}
				onChange={(e) => setFirstName(e.target.value)}
				required
				/>
				</div>

				<div className="item">
				<label htmlFor="last-name">Last name</label>
				<input
				type="text"
				id="last-name"
				placeholder="Last name"
				value={lastName}
				onChange={(e) => setLastName(e.target.value)}
				required
				/>
				</div>
			</div>
			<div className='row'>
				<div className="item">
				<label htmlFor="dob">Date of Birth</label>
				<input
				type="date"
				id="dob"
				placeholder="Date of Birth"
				value={dob}
				onChange={(e) => setDob(e.target.value)}
				required
				/>
				</div>

				<div className="item">
				<label htmlFor="gender">Gender</label>
				<select
				id="gender"
				value={gender}
				onChange={(e) => setGender(e.target.value)}
				required
				>
				<option value="" disabled>Select Gender</option>
				<option value="male">Male</option>
				<option value="female">Female</option>
				<option value="other">Others</option>
				</select>
				</div>

				{/* <div className="item">
				<label htmlFor="nationality">Nationality</label>
				<select
				id="nationality"
				value={nationality}
				onChange={(e) => setNationality(e.target.value)}
				required
				>
				<option value="" disabled>Select Nationality</option>
				{countries.map((country, index) => (
					<option key={index} value={country}>
					{country}
					</option>
				))}
				</select>
				</div> */}
			</div>
		</div>

   <div className="profession">
  <p>Professional Information</p>
	<div className="row">
		<div className="item">
			<label htmlFor="status">Current Status</label>
			<select
			id="status"
			value={status}
			onChange={handleStatusChange}
			required
			>
			<option value="" disabled>Select Current Status</option>
			<option value="student">Student</option>
			<option value="employed">Employed</option>
			<option value="other">Others</option>
			</select>
		</div>
		{status === 'other' && (
			<div className='item'>
			<label htmlFor="other-status">Please specify:</label>
			<input
				type="text"
				id="other-status"
				placeholder="Specify your status"
				value={otherStatus}
				onChange={handleOtherStatusChange}
				required
			/>
			</div>
		)}
	</div>

	<div className="row">
		<div className="item">
			<label htmlFor="job-title">
			{status === 'student' ? 'Field of Study' : 'Job Title/Designation'}
			</label>
			<input
			type="text"
			id="job-title"
			placeholder={status === 'student' ? 'Field of Study' : 'Job Title/Designation'}
			value={jobTitle}
			onChange={(e) => setJobTitle(e.target.value)}
			required
			/>
		</div>
		<div className="item">
			<label htmlFor="experience">Years of Experience (Optional)</label>
			<input
			type="number"
			id="experience"
			placeholder="Years of Experience"
			value={experience}
			onChange={(e) => setExperience(e.target.value)}
			/>
		</div>
	</div>
	<div className="item">
    <label htmlFor="organization">Employment / Institution / Organization Name</label>
    <input
      type="text"
      id="organization"
      placeholder="Employment / Institution / Organization Name"
      value={organization}
      onChange={(e) => setOrganization(e.target.value)}
	  required
    />
	</div>
  </div>


  <div className="contact-details">
	<p>Contact Details</p>

	<div className="row">
		<div className="item">
			<label htmlFor="email">Email</label>
			<input
			type="text"
			id="email"
			placeholder="Email"
			value={email}
			onChange={handleChange}
			style={{ borderColor: isValidEmail ? 'initial' : 'red' }} 
			required
			/>
			{!isValidEmail && <p style={{ color: 'red', fontSize: '13px' }}>Please enter a valid email.</p>}
		</div>
		<div className="item">
			<label htmlFor="phone">Phone</label>
			<PhoneInput
			className='phoneinput'
			country={'in'}
			value={phone}
			onChange={setPhone}
			inputStyle={{ width: '100%' }}
			/>
		</div>
	</div>

	<div className="row" >
		<div className="item">
			<label htmlFor="city">City</label>
			<input
				type="text"
				id="city"
				placeholder="City"
				value={city}
				onChange={(e) => setCity(e.target.value)}
				required
			/>
	 	</div>
		 <div className="item">
			<label htmlFor="state">State</label>
			<input
				type="text"
				id="state"
				placeholder="State"
				value={state}
				onChange={(e) => setState(e.target.value)}
				required
			/>
		</div>

		<div className="item">
			<label htmlFor="country">Country</label>
			<input
				type="text"
				id="country"
				placeholder="Country"
				value={country}
				onChange={(e) => setCountry(e.target.value)}
				required
			/>
		</div>
		<div className="item">
			<label htmlFor="postal-code">Postal Code</label>
			<input
				type="text"
				id="postal-code"
				placeholder="Postal Code"
				value={postalCode}
				onChange={(e) => setPostalCode(e.target.value)}
				required
			/>
	  	</div>
    </div>
	<div className='row'>
		<div className="item">
		<label >Preferred Mode of Contact:</label>
		<div className="radio-container">
		<div className="radio">
          <input
		  className='radio-btn'
            type="radio"
            value="email"
            checked={preferredContact === 'email'} // Check if this option is selected
            onChange={(e) => setPreferredContact(e.target.value)}
          /> 
		  <p style={{fontSize: '15px'}}>Email</p>
		  </div>
		  <div className="radio">
			<input
				className='radio-btn'
				type="radio"
				value="phone"
				checked={preferredContact === 'phone'} // Check if this option is selected
				onChange={(e) => setPreferredContact(e.target.value)}
			/>
			<p style={{fontSize: '15px'}}>Phone</p>
			</div>
			</div>
		</div>
      </div>
  </div>


	<div className="referral">
		<p>Referal Information</p>
		<div className="row">
			<div className="item">
				<label htmlFor="referral-source">How did you hear about Medicmode?</label>
				<select
				id="referral-source"
				value={referral}
				onChange={handleReferralChange}
				required
				>
				<option value="" disabled>Select</option>
				<option value="search-engine">Search Engine (Google, Bing, etc.)</option>
				<option value="social-media">Social Media (Facebook, Instagram, etc.)</option>
				<option value="referral-friend">Referral from Colleague/Friend</option>
				<option value="advertisement">Advertisement (Online, Print, etc.)</option>
				<option value="event">Medical Conference/Event</option>
				<option value="other">Other</option>
				</select>
			</div>
				{referral === 'other' && (
			<div className="item">
					<label htmlFor="other-referral">Please specify:</label>
					<input
						type="text"
						id="other-referral"
						placeholder="Specify how you heard about Medicmode"
						value={otherReferral}
						onChange={handleOtherReferralChange}
						required
					/>
			</div>
				)}
		</div>
		<div className="contact-details">
			<p>Password for Login</p>
			<div className="row">
				<div className="item">
					<label htmlFor="password">Set Password</label>
					<input
						type="text"
						id="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
	</div>
		</div>
	</div> 
	{error && <p className='incorrect'>{error}</p>}
          
          <button type='submit' className='signup-btn'>SIGN UP</button> 
</form>
        
        
      </div>
    </div>
  );
};

export default Signup;
