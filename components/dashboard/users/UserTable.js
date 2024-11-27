"use client"
import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase'; // Adjust the path as necessary
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Firestore functions
import './UserTable.css'; 
import { useAuth } from '@/components/AuthContext';
import { GridLoader } from 'react-spinners';
import Link from 'next/link';

const UserTable = () => {


  const {loading, setLoading} = useAuth();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users')); // Fetch users from 'users' collection
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');

    if(confirmDelete){
    try {
      await deleteDoc(doc(db, 'users', userId)); // Delete the user from Firestore
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)); 
      
    } catch (error) {
      console.error('Error deleting user: ', error);
    }
  }
};

  const formatDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000); // Convert Firestore timestamp to JS Date
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`; // Format date as 'dd-mm-yyyy'
    }
    return 'N/A'; // Return 'N/A' if the timestamp is invalid
  };


  if (loading) {
    return (
      <div className="loading-container">
        <GridLoader color={"#0A4044"} loading={loading} size={10} />
      </div>
    );
  }

  return (
    <div className="user-table-container">
      <h1>User List</h1>
      {users.length > 0 ? (
        <div className="scroll">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Designation / Education</th>
              <th>Organization / Institution</th>
              <th>Purchase History</th>
              <th>Password</th>
              <th>Account Created</th>
              <th>Delete</th> 
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td> 
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td> 
                <td>{user.phone}</td> 
                <td>{user.jobTitle}</td>
                <td>{user.organization}</td>
                {user.purchaseHistory ? (
                  <td>
                <Link
                  href={{
                    pathname: '/dashboard/users/payment-history',
                    query: {
                      id: user.id
                    }
                  }}
                >
                  View
                </Link>      
                </td>
                ): (
                  <td>-</td>
                )}
                
                <td>{user.password}</td> 
                <td style={{  whiteSpace: 'nowrap'}}>{formatDate(user.createdAt)}</td> 
                <td>
                  {user.name === 'admin'? '' : 
                  <button 
                    onClick={() => handleDelete(user.id)} 
                    className="delete-btn"
                  >
                    Delete
                  </button> }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default UserTable;
