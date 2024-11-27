import React, { useEffect, useState } from 'react';
import './BuyCourse.css';
import { useAuth } from '../AuthContext';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore'; // Import arrayUnion
import { toast, Toaster } from 'sonner';

const BuyCourse = ({ id, price, title }) => {
  const { userEmail, logged, handleOpen } = useAuth();
  const [userDetails, setUserDetails] = useState(null);

  const db = getFirestore();

  useEffect(() => {
    // Load Razorpay checkout script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Fetch user details from Firestore
    const fetchUserDetails = async () => {
      if (!userEmail) return;

      try {
        const userQuery = query(
          collection(db, 'users'), // Replace 'users' with the name of your users collection
          where('email', '==', userEmail)
        );
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUserDetails(userData);
        } else {
          console.warn('No user found with email:', userEmail);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [userEmail, db]);

  const handleBuyCourse = async () => {
    if (!logged) {
      handleOpen();
      return;
    }

    if (!userDetails) {
        toast.alert('User details are not loaded yet. Please try again.', {
            duration: 3000 
          });
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
      amount: price * 100, 
      currency: 'INR',
      name: 'Medicmode',
      description: `Payment for ${title}`,
      handler: async (response) => {
        alert(`Payment Successful! Razorpay Payment ID: ${response.razorpay_payment_id}`);
    
        toast.success('Payment Successful!', {
            duration: 3000 
        });
    
        // Create purchaseDetails object
        const purchaseDetails = {
            courseId: id,
            courseTitle: title,
            purchaseDate: new Date().toISOString(),
            paymentId: response.razorpay_payment_id,
            paymentStatus: 'Success',
            paymentAmount: price,
        };
    
        try {
            // Fetch the user document based on the email
            const userDocRef = query(collection(db, 'users'), where('email', '==', userEmail));
    
            const querySnapshot = await getDocs(userDocRef);
    
            if (!querySnapshot.empty) {
                // Get the document reference from the first document in the query snapshot
                const userDoc = querySnapshot.docs[0];
                const userDocRef = userDoc.ref; // Correctly accessing the document reference
    
                // Update the user document with the new purchase details array
                await updateDoc(userDocRef, {
                    purchaseHistory: arrayUnion(purchaseDetails), // Using arrayUnion to add to the array
                });
    
                // Send purchase details and user details to the API
                try {
                    await fetch('/api/sendPurchaseDetails', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ 
                            userDetails: userDetails, 
                            purchaseDetails: purchaseDetails 
                        }),
                    });
                } catch (error) {
                    toast.alert('Failed to send purchase details. Please contact support.', { duration: 3000 });
                }
    
            } else {
                toast.alert('User not found. Please try again.', {
                    duration: 3000 
                });
            }
        } catch (error) {
            toast.alert('Failed to save purchase details. Please contact support.', {
                duration: 3000 
            });
        }
    },
    
      prefill: {
        name: userDetails.firstName, // Fetched name or fallback
        email: userDetails.email || userEmail, // Fetched email or fallback
        contact: userDetails.phone ? userDetails.phone.toString().slice(-10) : '',
      },
      notes: {
        course_id: id,
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    rzp.on('payment.failed', function (response) {
        toast.alert('Payment Failed: ' + response.error.description, {
            duration: 3000 
          });
    });
  };

  return (
    <div>
        <Toaster position="top-center" richColors /> 
      <button onClick={handleBuyCourse} className="buy-course-btn">
        Buy Course
      </button>
    </div>
  );
};

export default BuyCourse;
