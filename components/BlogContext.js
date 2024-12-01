'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { collection, getDocs, query, orderBy, setDoc, doc, getDoc, deleteDoc, where } from 'firebase/firestore'; 
import { db } from '../lib/firebase'; 
import { toast } from 'sonner';


const BlogContext = createContext();

export const BlogProvider = ({ children }) => {

  const { userEmail, logged , handleOpen } = useAuth();

  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('show-all');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);


    useEffect(() => {
      const fetchBlogs = async () => {
  
        try {
          const blogCollection = collection(db, 'blogPosts');
          const querySnapshot = await getDocs(
            query(
              blogCollection,
              where('approved', '==', 'yes'),
              orderBy('dateCreated', 'desc')
            )
          );
  
          
          const blogs = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
              const blogData = doc.data();
              
              // Fetch likes and comments count for each blog post
              const likesCollection = collection(doc.ref, 'likes');
              const commentsCollection = collection(doc.ref, 'comments');
              
              const likesSnapshot = await getDocs(likesCollection);
              const commentsSnapshot = await getDocs(commentsCollection);
              
              return {
                id: doc.id,
                ...blogData,
                likesCount: likesSnapshot.size,
                commentsCount: commentsSnapshot.size,
              };
            })
          );
          
  
          
          // console.log('Fetched blogs:', blogs);
          setBlogPosts(blogs);
    
          // Extract unique categories, years, and months for filters
          const categories = [...new Set(blogs.map(blog => blog.category))];
          setCategories(categories);
    
          const years = [...new Set(blogs.map(blog => new Date(blog.dateCreated).getFullYear()))];
          setYears(years);
    
          const months = [...new Set(blogs.map(blog => new Date(blog.dateCreated).getMonth() + 1))];
          setMonths(months);
        } catch (error) {
          console.error("Error fetching blogs: ", error);
        }
       finally {
        setLoading(false); 
      }
      };
  
    
      fetchBlogs();
    }, [setLoading]); 


    



    useEffect(() => {
        const checkLikes = async () => {
          if (!userEmail) return; // If user is not logged in, exit early
      
          const newLikedPosts = new Set(); // Create a new Set for liked posts
          const likesPromises = blogPosts.map(async (blog) => {
            const userDocRef = doc(collection(db, `blogPosts/${blog.id}/likes`), userEmail);
            const userLikeDoc = await getDoc(userDocRef);
            if (userLikeDoc.exists()) {
              newLikedPosts.add(blog.id); // Add blog ID to the set of liked posts
            }
          });
          await Promise.all(likesPromises);
          setLikedPosts(newLikedPosts); // Update the state with the new Set
        };
      
        checkLikes();
      }, [userEmail, blogPosts]); 



    const handleLike = async (blogId) => {

        if (!logged) {
          toast.info('Please login to like a post!', {
            duration: 3000 
          }); 
          handleOpen();
          return; 
        }
      
        const likeRef = collection(db, `blogPosts/${blogId}/likes`);
        const userDocRef = doc(likeRef, userEmail);
      
        const userLikeDoc = await getDoc(userDocRef);
        
        let updatedBlogs = [...blogPosts]; // Create a copy of the current blog posts
        const blogIndex = updatedBlogs.findIndex(blog => blog.id === blogId);
      
        if (userLikeDoc.exists()) {
          // User has liked, so remove their like
          await deleteDoc(userDocRef);
          likedPosts.delete(blogId); // Remove from liked posts
      
          // Decrement the like count in the local state
          updatedBlogs[blogIndex].likesCount = updatedBlogs[blogIndex].likesCount - 1;
        } else {
          // User has not liked, so add their like
          await setDoc(userDocRef, { email: userEmail });
          likedPosts.add(blogId); // Add to liked posts
      
          // Increment the like count in the local state
          updatedBlogs[blogIndex].likesCount = updatedBlogs[blogIndex].likesCount + 1;
        }
      
        // Update the local state to reflect the new likes count
        setBlogPosts(updatedBlogs);
        setLikedPosts(new Set(likedPosts)); 
      };

      const filteredBlogs = blogPosts.filter(blog => {
        const matchesCategory = selectedCategory === 'show-all' || blog.category === selectedCategory;
        const matchesYear = !selectedYear || new Date(blog.dateCreated).getFullYear().toString() === selectedYear;
        const matchesMonth = !selectedMonth || (new Date(blog.dateCreated).getMonth() + 1).toString() === selectedMonth;
    
        return matchesCategory && matchesYear && matchesMonth;
      });
    
      const recentBlog = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
      const otherBlogs = filteredBlogs.length > 1 ? filteredBlogs.slice(1) : [];

      const showBlogOptions = () => setIsDrawerOpen(true);
      const closeBlogOptions = () => setIsDrawerOpen(false);

    return(
        <BlogContext.Provider value={{selectedCategory, setSelectedCategory, likedPosts, handleLike, showBlogOptions, recentBlog, otherBlogs, closeBlogOptions, blogPosts, categories, months, years, selectedYear, setSelectedYear, selectedMonth, setSelectedMonth, setIsDrawerOpen, isDrawerOpen }}>
            { children }
        </BlogContext.Provider>
    )

}

export const useBlog = () => useContext(BlogContext);