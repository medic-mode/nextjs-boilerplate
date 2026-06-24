"use client"
import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase'; // Adjust the path as necessary
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import './ReviewPost.css';
import { GridLoader } from 'react-spinners';
import Link from 'next/link';
import TablePaginationFooter from '../table-pagination/TablePaginationFooter';
import { useFirestorePagination } from '@/hooks/useFirestorePagination';

const ReviewPost = () => {
  
  const [approvalStatus, setApprovalStatus] = useState({});
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    rows: blogPosts,
    setRows: setBlogPosts,
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
    collectionName: 'blogPosts',
    orderField: 'dateCreated',
  });
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const searchablePosts = normalizedSearch ? allRows || [] : blogPosts;
  const visiblePosts = normalizedSearch
    ? searchablePosts.filter((post) =>
        [
          formatDate(post.dateCreated),
          post.title,
          post.author,
          post.coAuthor,
          post.category,
        ].some((value) => String(value || '').toLowerCase().includes(normalizedSearch))
      )
    : blogPosts;

  useEffect(() => {
    if (normalizedSearch) {
      fetchAllRows();
    }
  }, [normalizedSearch, fetchAllRows]);

  useEffect(() => {
    const initialApprovalStatus = {};
    const approvedList = [];

    blogPosts.forEach((post) => {
      initialApprovalStatus[post.id] = post.approved === 'yes';
      if (initialApprovalStatus[post.id]) {
        approvedList.push(post);
      }
    });

    setApprovalStatus(initialApprovalStatus);
    setApprovedPosts(approvedList);
  }, [blogPosts]);

  const handleApprovalChange = async (postId) => {
    const isApproved = approvalStatus[postId];
    const newApprovalStatus = !isApproved;

    setApprovalStatus((prevState) => ({
      ...prevState,
      [postId]: newApprovalStatus,
    }));

    const approvedPost = blogPosts.find((post) => post.id === postId);
    if (approvedPost) {
      // Update approved posts state
      if (newApprovalStatus && !approvedPosts.includes(approvedPost)) {
        setApprovedPosts((prevApproved) => [...prevApproved, approvedPost]);
      } else if (!newApprovalStatus) {
        setApprovedPosts((prevApproved) => prevApproved.filter((post) => post.id !== postId));
      }

      try {
        await updateDoc(doc(db, 'blogPosts', postId), {
          approved: newApprovalStatus ? 'yes' : 'no',
        });
      } catch (error) {
        console.error('Error updating blog post approval status: ', error);
      }
    }
  };

  function formatDate(date) {
    if (!date) {
      return 'N/A';
    }

    if (typeof date === 'object' && date.seconds) {
      const timestamp = new Date(date.seconds * 1000);
      return formatDateString(timestamp);
    }

    const parsedDate = new Date(date);
    return formatDateString(parsedDate);
  }

  function formatDateString(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');

    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'blogPosts', postId));
        setBlogPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } catch (error) {
        console.error('Error deleting blog post: ', error);
      }
    }
  };

  return (
    <div className="review-post-container">
      <div className="dashboard-list-toolbar">
        <h1>Review Post</h1>
        <input
          className="dashboard-list-search"
          type="search"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
      {(blogPosts.length > 0 || tableLoading || allRowsLoading) ? (
        <>
        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Date Created</th>
                <th>Blog Title</th>
                <th>Author Name</th>
                <th>Co Authors</th>
                <th>Category</th>
                <th colSpan="2">Content</th>
                <th>Thumbnail</th>
                <th colSpan="2">Actions</th>
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
              ) : visiblePosts.length > 0 ? (
              visiblePosts.map((post, index) => (
                <tr key={post.id}>
                  <td>{normalizedSearch ? index + 1 : (page - 1) * pageSize + index + 1}</td>
                  <td>{formatDate(post.dateCreated)}</td>
                  <td>{post.title}</td>
                  <td>{post.author}</td>
                  <td>{post.coAuthor}</td>
                  <td>{post.category}</td>
                  <td>
                    <Link href={`/blogs/${post.id}`} >
                      View Post
                    </Link>
                  </td>
                  <td>
                  
                  <Link
                    href={{
                      pathname: '/dashboard/review-post/edit-post',
                      query: {
                        id: post.id
                      }
                    }}
                  >
                    Edit Post
                  </Link>

                  </td>
                  <td>
                    {post.thumbnail ? (
                      <Link href={post.thumbnail} >
                        View Thumbnail
                      </Link>
                    ) : (
                      <>No Image</>
                    )}
                  </td>

                  <td>
                    <button
                      onClick={() => handleApprovalChange(post.id)}
                      className={`approve-btn ${approvalStatus[post.id] ? 'approved' : 'pending'}`}
                    >
                      {approvalStatus[post.id] ? 'Approved' : 'Approve'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(post.id)} className="delete-btn">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan="11" className="dashboard-table-empty-cell">
                    <div className="dashboard-table-empty">No posts found.</div>
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

    </div>
    
  );
};

export default ReviewPost;
