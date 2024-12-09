import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import './PaymentHistory.css';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { GridLoader } from 'react-spinners';
import Link from 'next/link';

const PaymentHistory = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState({});

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
  
          // Check if purchaseHistory exists and iterate through it
          if (userData.purchaseHistory && userData.purchaseHistory.length > 0) {
            userData.purchaseHistory.forEach(async (purchase) => {
              const paymentId = purchase.paymentId;
              
              // Log to verify the paymentId
              console.log('Fetching status for paymentId:', paymentId);
  
              if (paymentId) {
                try {
                  const response = await fetch(`/api/paymentStatus?paymentId=${paymentId}`);
                  const data = await response.json();
                  if (data.status) {
                    // Handle the payment status
                    console.log('Payment Status:', data.status);
                    setPaymentStatus(data.status); // Update the state with payment status
                  } else {
                    console.warn('No status in response:', data);
                  }
                } catch (error) {
                  console.error('Error fetching payment status:', error);
                }
              } else {
                console.warn('No paymentId found for purchase:', purchase);
              }
            });
          }
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
  

  useEffect(() => {
    const fetchPaymentStatus = async (paymentId) => {
      try {
        const response = await fetch(`/api/paymentStatus?paymentId=${paymentId}`);
        const data = await response.json();
        if (data.status) {
          setPaymentStatus(prev => ({
            ...prev,
            [paymentId]: data.status
          }));
        }
      } catch (error) {
        console.error('Error fetching payment status:', error);
      }
    };

    if (userDetails && userDetails.purchaseHistory) {
      userDetails.purchaseHistory.forEach((purchase) => {
        if (purchase.paymentId) {
          fetchPaymentStatus(purchase.paymentId);
        }
      });
    }
  }, [userDetails]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

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

  const formatStatus = (status) => {
    if (!status) return ''; // In case there's no status
    return status.charAt(0).toUpperCase() + status.slice(1); // Capitalize the first letter
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
            userDetails.purchaseHistory.map((purchase, index) => {
              const status = paymentStatus[purchase.paymentId] || 'Fetching status...';
              return (
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
                      <p>Payment Status:</p>
                      {status === 'Fetching status...' && (
                        <p style={{ color: 'grey' }}>{formatStatus(status)}</p>
                      )}
                      {(status === 'authorized' || status === 'pending') && (
                        <p style={{ color: 'orange' }}>{formatStatus(status)}</p>
                      )}
                      {(status === 'captured' || status === 'capturing' || status === 'refunded') && (
                        <p style={{ color: 'green' }}>{formatStatus(status)}</p>
                      )}
                      {(status === 'failed' || status === 'cancelled') && (
                        <p style={{ color: 'red' }}>{formatStatus(status)}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div>No purchase history found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
