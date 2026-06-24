"use client"
import React, { useEffect, useState } from 'react';
import './UserTable.css'; 
import { GridLoader } from 'react-spinners';
import Link from 'next/link';
import TablePaginationFooter from '../table-pagination/TablePaginationFooter';
import { useFirestorePagination } from '@/hooks/useFirestorePagination';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
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


  const {
    rows: users,
    setRows: setUsers,
    allRows,
    allRowsLoading,
    fetchAllRows,
    loading: tableLoading,
    page,
    pageSize,
    setPageSize,
    totalRows,
    totalPages,
    fetchFirstPage,
    fetchLastPage,
    fetchNextPage,
    fetchPreviousPage,
  } = useFirestorePagination({
    collectionName: 'users',
    orderField: 'createdAt',
  });

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const searchableUsers = normalizedSearch ? allRows || [] : users;
  const visibleUsers = normalizedSearch
    ? searchableUsers.filter((user) =>
        [
          user.firstName,
          user.lastName,
          user.email,
          user.phone,
          user.jobTitle,
          user.organization,
          formatDate(user.createdAt),
        ].some((value) => String(value || '').toLowerCase().includes(normalizedSearch))
      )
    : users;

  useEffect(() => {
    if (normalizedSearch) {
      fetchAllRows();
    }
  }, [normalizedSearch, fetchAllRows]);

  const handleClickOpen = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleConfirmDelete = async () => {
  if (!selectedUser) return;

  setIsDeleting(true);

    try {
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        toast.error("Admin session expired. Please log in again.");
        return;
      }

      const res = await fetch('/api/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
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


  function formatDate(timestamp) {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000); 
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`; // Format date as 'dd-mm-yyyy'
    }
    return 'N/A'; // Return 'N/A' if the timestamp is invalid
  }


  return (
    <div className="user-table-container">
      <div className="dashboard-list-toolbar">
        <h1>User List</h1>
        <input
          className="dashboard-list-search"
          type="search"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
      {(users.length > 0 || tableLoading || allRowsLoading) ? (
        <>
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
            {tableLoading || allRowsLoading ? (
              <tr>
                <td colSpan="11" className="dashboard-table-loading-cell">
                  <div className="dashboard-table-loading">
                    <GridLoader color={"#0A4044"} loading={tableLoading} size={10} />
                  </div>
                </td>
              </tr>
            ) : visibleUsers.length > 0 ? (
            visibleUsers.map((user, index) => (
              <tr key={user.id}>
                  <td>{normalizedSearch ? index + 1 : (page - 1) * pageSize + index + 1}</td> 
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
            ))
            ) : (
              <tr>
                <td colSpan="11" className="dashboard-table-empty-cell">
                  <div className="dashboard-table-empty">No users found.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
        {!normalizedSearch && <TablePaginationFooter
          totalRows={totalRows}
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          onFirstPage={fetchFirstPage}
          onPreviousPage={fetchPreviousPage}
          onNextPage={fetchNextPage}
          onLastPage={fetchLastPage}
          disabled={tableLoading}
        />}
        </>
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
