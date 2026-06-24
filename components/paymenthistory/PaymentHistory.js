import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import './PaymentHistory.css';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { GridLoader } from 'react-spinners';
import Link from 'next/link';
import TablePaginationFooter from '@/components/dashboard/table-pagination/TablePaginationFooter';

const PaymentHistory = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

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
      const startIndex = (page - 1) * pageSize;
      const pagePurchases = userDetails.purchaseHistory.slice(startIndex, startIndex + pageSize);

      pagePurchases.forEach((purchase) => {
        if (purchase.paymentId) {
          fetchPaymentStatus(purchase.paymentId);
        }
      });
    }
  }, [userDetails, page, pageSize]);

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

  const purchaseHistory = userDetails.purchaseHistory || [];
  const totalRows = purchaseHistory.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const pagePurchases = purchaseHistory.slice((page - 1) * pageSize, page * pageSize);
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visiblePagePurchases = normalizedSearch
    ? pagePurchases.filter((purchase) =>
        [
          formatDate(purchase.purchaseDate),
          purchase.paymentAmount,
          purchase.paymentId,
          purchase.courseTitle,
          paymentStatus[purchase.paymentId],
        ].some((value) => String(value || '').toLowerCase().includes(normalizedSearch))
      )
    : pagePurchases;

  const handlePageSizeChange = (nextPageSize) => {
    setPageSize(nextPageSize);
    setPage(1);
  };

  return (
    <div className='payment-history-container'>
      <div className="purchase-history">
        <div className="dashboard-list-toolbar">
          <h1>Purchase History</h1>
          <input
            className="dashboard-list-search"
            type="search"
            placeholder="Search purchases..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="purchase-user-details">
          <h4>Name: {userDetails.firstName} {userDetails.lastName}</h4>
          <h4>Contact: {userDetails.phone}</h4>
          <h4>Email: {userDetails.email}</h4>
        </div>

        <div className="purchase-history-details">
          {purchaseHistory.length > 0 ? (
            visiblePagePurchases.length > 0 ? (
            visiblePagePurchases.map((purchase, index) => {
              const status = paymentStatus[purchase.paymentId] || 'Fetching status...';
              return (
                <div key={`${purchase.paymentId || purchase.courseId}-${index}`} className="purchase-items">
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
                      {!(status === 'Fetching status...' || status === 'authorized' || status === 'pending' || status === 'captured' || status === 'capturing' || status === 'refunded' || status === 'failed' || status === 'cancelled') && (
                        <p>{formatStatus(status)}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
            ) : (
              <div className="dashboard-table-empty">No purchases found.</div>
            )
          ) : (
            <div>No purchase history found.</div>
          )}
          {purchaseHistory.length > 0 && (
            <TablePaginationFooter
              totalRows={totalRows}
              page={page}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              onFirstPage={() => setPage(1)}
              onPreviousPage={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              onNextPage={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
              onLastPage={() => setPage(totalPages)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
