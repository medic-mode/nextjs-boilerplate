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
        duration: 3000,
      });
      return;
    }

    try {
      // Call the API to create an order
      const response = await fetch('/api/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: price }),
      });
  
      const data = await response.json();
  
      if (!data.success) {
        throw new Error('Order creation failed');
      }
  
      const { id: orderId } = data.order;
  
    // Initialize purchaseDetails
    const purchaseDetails = {
      courseId: id,
      courseTitle: title,
      purchaseDate: new Date().toISOString(),
      paymentId: null, // Will be updated upon payment success
      paymentStatus: null, // Will be updated to 'Success' or 'Failed'
      paymentAmount: price,
      failureReason: null, // Will be updated if the payment fails
    };
  
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: price * 100,
      currency: 'INR',
      name: 'Medicmode',
      description: `Payment for ${title}`,
      order_id: orderId,
      handler: async (response) => {
        // Update payment details on success
        purchaseDetails.paymentId = response.razorpay_payment_id;
        purchaseDetails.paymentStatus = 'Success';
  
        alert(`Payment Successful! Razorpay Payment ID: ${response.razorpay_payment_id}. Our Team will contact you soon.`);
        toast.success('Payment Successful!', { duration: 3000 });
  
        try {
          const userDocRef = query(collection(db, 'users'), where('email', '==', userEmail));
          const querySnapshot = await getDocs(userDocRef);
  
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userDocRef = userDoc.ref;
  
            // Update the user's purchase history
            await updateDoc(userDocRef, {
              purchaseHistory: arrayUnion(purchaseDetails),
            });
  
            // Send purchase details to the API
            await fetch('/api/sendPurchaseDetails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userDetails, purchaseDetails }),
            });
          } else {
            toast.alert('User not found. Please try again.', { duration: 3000 });
          }
        } catch (error) {
          toast.alert('Failed to save purchase details. Please contact support.', { duration: 3000 });
        }
      },
      prefill: {
        name: userDetails.firstName,
        email: userDetails.email || userEmail,
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
  
    rzp.on('payment.failed', async function (response) {
      // Update purchaseDetails for failure
      purchaseDetails.paymentId = response.error.metadata.payment_id || 'N/A';
      purchaseDetails.paymentStatus = 'Failed';
      purchaseDetails.failureReason = response.error.description;
  
      alert('Payment failed. Please try again.');
      toast.alert('Payment Failed: ' + response.error.description, { duration: 3000 });
  
      try {
        const userDocRef = query(collection(db, 'users'), where('email', '==', userEmail));
        const querySnapshot = await getDocs(userDocRef);
  
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userDocRef = userDoc.ref;
  
          // Update the user's purchase history
          await updateDoc(userDocRef, {
            purchaseHistory: arrayUnion(purchaseDetails),
          });
        } else {
          toast.alert('User not found. Please try again.', { duration: 3000 });
        }
      } catch (error) {
        toast.alert('Failed to save failed payment details. Please contact support.', { duration: 3000 });
      }
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
