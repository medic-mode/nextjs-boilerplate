"use client"
import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase'; // Adjust the path as necessary
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import './ReviewPost.css';
import { GridLoader } from 'react-spinners';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';

const ReviewPost = () => {
  
  const {loading, setLoading} = useAuth();
  const [blogPosts, setBlogPosts] = useState([]);
  const [approvalStatus, setApprovalStatus] = useState({});
  const [approvedPosts, setApprovedPosts] = useState([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'blogPosts'));
        const posts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBlogPosts(posts);

        // Initialize approval status and approved posts
        const initialApprovalStatus = {};
        const approvedList = []; // Temporary array to hold approved posts

        posts.forEach((post) => {
          initialApprovalStatus[post.id] = post.approved === 'yes'; // Check Firestore approval status
          if (initialApprovalStatus[post.id]) {
            approvedList.push(post); // Add to approved list if already approved
          }
        });

        setApprovalStatus(initialApprovalStatus);
        setApprovedPosts(approvedList);
      } catch (error) {
        console.error('Error fetching blog posts: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
    // eslint-disable-next-line
  }, []);

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

  const formatDate = (date) => {
    if (!date) {
      return 'N/A';
    }

    if (typeof date === 'object' && date.seconds) {
      const timestamp = new Date(date.seconds * 1000);
      return formatDateString(timestamp);
    }

    const parsedDate = new Date(date);
    return formatDateString(parsedDate);
  };

  const formatDateString = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

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

  if (loading || !blogPosts) {
    return (
      <div className="loading-container">
        <GridLoader color={"#0A4044"} loading={loading} size={10} />
      </div>
    );
  }


 

  return (
    <div className="review-post-container">
      <h1>Review Post</h1>
      {blogPosts.length > 0 ? (
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
              {blogPosts.map((post, index) => (
                <tr key={post.id}>
                  <td>{index + 1}</td>
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
                        id: post.id,
                        author: post.author,
                        coAuthor: post.coAuthor,
                        title: post.title,
                        category: post.category,
                        content: post.content,
                        keyword: JSON.stringify(post.keyword),  // Stringify complex data
                        reference: post.reference,
                        thumbnail: JSON.stringify(post.thumbnail),
                        youtubeUrl: post.youtubeUrl,
                        slideImages: JSON.stringify(post.slideImages),  // Stringify complex data
                        preview: post.preview,
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

export default ReviewPost;
