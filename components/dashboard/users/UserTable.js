"use client"
import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase'; // Adjust the path as necessary
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Firestore functions
import './UserTable.css'; 
import { useAuth } from '@/components/AuthContext';
import { GridLoader } from 'react-spinners';

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
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Password</th>
              <th>Account Created</th>
              <th>Delete</th> {/* New Delete column */}
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td> {/* S.No starts from 1 */}
                <td>{user.id}</td> {/* Firestore User ID */}
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td> {/* Email field */}
                <td>{user.phone}</td> {/* Phone field */}
                <td>{user.password}</td> {/* Password field */}
                <td>{formatDate(user.createdAt)}</td> {/* Format date */}
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
