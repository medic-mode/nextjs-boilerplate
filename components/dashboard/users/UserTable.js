"use client"
import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase'; 
import { collection, getDocs} from 'firebase/firestore'; 
import './UserTable.css'; 
import { useAuth } from '../../../app/context/AuthContext';
import { GridLoader } from 'react-spinners';
import Link from 'next/link';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  CircularProgress 
} from '@mui/material';

const UserTable = () => {


  const {loading, setLoading} = useAuth();

  const [users, setUsers] = useState([]);

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users')); 
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        usersList.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0; 
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA; // Descending order
        });
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

  const handleClickOpen = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleConfirmDelete = async () => {
  if (!selectedUser) return;

  setIsDeleting(true);

    try {

      const res = await fetch('/api/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: selectedUser.id, 
          authUid: selectedUser.uid || null
        }),
      });

      if (res.ok) {
        setUsers((prevUsers) => {
          const updatedList = prevUsers.filter((u) => u.id !== selectedUser.id);
          return [...updatedList];
        });
        toast.success("User deleted successfully from Database and Auth.");
        setOpen(false);
      } else {
        const data = await res.json();
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting user: ', error);
      toast.error("An error occurred while deleting the user.");
    } finally {
    setIsDeleting(false); 
  }
};


  const formatDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000); 
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
                
                <td>
                  {user.password ? (
                    user.password
                  ) : (
                    <span style={{ color: 'green', fontWeight: 'bold' }}>
                      {user.migratedToAuth ? "✅ Migrated" : "Auth Only"}
                    </span>
                  )}
                </td>
                 
                <td style={{  whiteSpace: 'nowrap'}}>{formatDate(user.createdAt)}</td> 
                <td>
                  {user.name === 'admin'? '' : 
                  <button 
                    onClick={() => handleClickOpen(user)} 
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

      <Dialog
          open={open}
          onClose={() => !isDeleting && setOpen(false)} // Prevent closing while deleting
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete <b>{selectedUser?.firstName}</b>? 
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpen(false)} 
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmDelete} 
              color="error" 
              variant="contained"
              disabled={isDeleting}
              startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  );
};

export default UserTable;
