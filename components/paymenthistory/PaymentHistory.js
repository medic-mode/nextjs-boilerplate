import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import './PaymentHistory.css';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Import necessary Firestore functions
import { GridLoader } from 'react-spinners';
import Link from 'next/link';

const PaymentHistory = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('id'); // Get the userId from the URL parameters
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const db = getFirestore();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;

      try {
        const userDocRef = doc(db, 'users', userId); // Reference to the user's document
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserDetails(userData);
        } else {
          console.warn('No user found with the given ID');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, db]);

  if (loading) {
    return (
        <div className="loading-container">
          <GridLoader color={"#0A4044"} loading={loading} size={10} />
        </div>
      );
  }

  if (!userDetails) {
    return <div>User not found.</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert the string into a Date object
  
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad if single digit
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so add 1) and pad
    const year = date.getFullYear(); // Get full year
  
    return `${day}-${month}-${year}`; // Return in dd-mm-yyyy format
  };

  return (
    <div className='payment-history-container'>
      <h1>Purchase History</h1>
      <div className="purchase-history">
        <div className="purchase-user-details">
            <h4>Name: {userDetails.firstName} {userDetails.lastName}</h4>
            <h4>Contact: {userDetails.phone}</h4>
            <h4>Email: {userDetails.email}</h4>
        </div>
        
        <div className="purchase-history-details">
            {userDetails.purchaseHistory && userDetails.purchaseHistory.length > 0 ? (
            userDetails.purchaseHistory.map((purchase, index) => (
                <div key={index} className="purchase-items">
                    <div className="items-head">
                        <div className="items-head-row">
                            <p>Purchase Date:</p>
                            <p>{formatDate(purchase.purchaseDate)}</p>
                        </div>
                        <div className="items-head-row">
                            <p>Amount:</p>
                            <p>₹ {purchase.paymentAmount}</p>
                        </div>
                        <div className="items-head-row">
                            <p>Payment Id:</p>
                            <p>{purchase.paymentId}</p>
                        </div>    
                    </div>
                    <div className="items-body">
                        <h4>Course Title:</h4>
                        <Link href={`/courses/${purchase.courseId}`}>

                        <h3>{purchase.courseTitle}</h3>

                        </Link>
                        <div className="items-head-row">
                            <p>Payment status:</p>
                            {purchase.paymentStatus === 'Success' ? (
                                <p style={{color:'green'}}>{purchase.paymentStatus}</p>
                            ):(
                                <p style={{color:'red'}}>{purchase.paymentStatus}</p>
                            )}
                            
                        </div>
                    </div>
                </div>
            ))
            ) : (
            <div>No purchase history found.</div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
