'use client'
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { collection, getDocs, query, orderBy, setDoc, doc, getDoc, deleteDoc, where, limit, startAfter, updateDoc, increment } from 'firebase/firestore'; 
import { db } from '@/lib/firebase'; 
import { toast } from 'sonner';


const BlogContext = createContext();
const FIRST_BLOG_LOAD = 10;
const NEXT_BLOG_LOAD = 9;

export const BlogProvider = ({ children }) => {

  const { userEmail, logged , handleOpen } = useAuth();

  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('show-all');
  const [blogSearchTerm, setBlogSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [lastBlogDoc, setLastBlogDoc] = useState(null);
  const [hasMoreBlogs, setHasMoreBlogs] = useState(true);
  const [loadingMoreBlogs, setLoadingMoreBlogs] = useState(false);


    useEffect(() => {
      const fetchBlogs = async () => {
        setLoading(true);
        setBlogPosts([]);
        setLastBlogDoc(null);
        setHasMoreBlogs(true);
  
        try {
          const blogCollection = collection(db, 'blogPosts');
          const filters = [
            where('approved', '==', 'yes'),
            orderBy('dateCreated', 'desc'),
            limit(FIRST_BLOG_LOAD),
          ];

          if (selectedCategory !== 'show-all') {
            filters.splice(1, 0, where('category', '==', selectedCategory));
          }

          const querySnapshot = await getDocs(query(blogCollection, ...filters));
  
          
          const blogs = querySnapshot.docs.map((doc) => {
              const blogData = doc.data();
              return {
                id: doc.id,
                ...blogData,
                likesCount: blogData.likesCount || 0,
                commentsCount: blogData.commentsCount || 0,
              };
            });
          
          
          
          // console.log('Fetched blogs:', blogs);
          setBlogPosts(blogs);
          setLastBlogDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
          setHasMoreBlogs(querySnapshot.docs.length === FIRST_BLOG_LOAD);
    
          // Extract unique categories, years, and months for filters
          if (selectedCategory === 'show-all') {
            const categories = [...new Set(blogs.map(blog => blog.category).filter(Boolean))];
            setCategories(categories);
          }
    
          const years = [...new Set(blogs.map(blog => new Date(blog.dateCreated).getFullYear()).filter(Boolean))];
          setYears(years);
    
          const months = [...new Set(blogs.map(blog => new Date(blog.dateCreated).getMonth() + 1).filter(Boolean))];
          setMonths(months);
        } catch (error) {
          console.error("Error fetching blogs: ", error);
        }
       finally {
        setLoading(false); 
      }
      };
  
      fetchBlogs();
    }, [selectedCategory]); 

    const fetchMoreBlogs = async () => {
      if (!lastBlogDoc || !hasMoreBlogs || loadingMoreBlogs) return;

      setLoadingMoreBlogs(true);

      try {
        const blogCollection = collection(db, 'blogPosts');
        const filters = [
          where('approved', '==', 'yes'),
          orderBy('dateCreated', 'desc'),
          startAfter(lastBlogDoc),
          limit(NEXT_BLOG_LOAD),
        ];

        if (selectedCategory !== 'show-all') {
          filters.splice(1, 0, where('category', '==', selectedCategory));
        }

        const querySnapshot = await getDocs(query(blogCollection, ...filters));
        const nextBlogs = querySnapshot.docs.map((doc) => {
          const blogData = doc.data();
          return {
            id: doc.id,
            ...blogData,
            likesCount: blogData.likesCount || 0,
            commentsCount: blogData.commentsCount || 0,
          };
        });

        setBlogPosts((currentBlogs) => {
          const existingIds = new Set(currentBlogs.map((blog) => blog.id));
          return [...currentBlogs, ...nextBlogs.filter((blog) => !existingIds.has(blog.id))];
        });
        setLastBlogDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || lastBlogDoc);
        setHasMoreBlogs(querySnapshot.docs.length === NEXT_BLOG_LOAD);

        const nextYears = nextBlogs.map(blog => new Date(blog.dateCreated).getFullYear()).filter(Boolean);
        const nextMonths = nextBlogs.map(blog => new Date(blog.dateCreated).getMonth() + 1).filter(Boolean);
        setYears((currentYears) => [...new Set([...currentYears, ...nextYears])]);
        setMonths((currentMonths) => [...new Set([...currentMonths, ...nextMonths])]);

        if (selectedCategory === 'show-all') {
          const nextCategories = nextBlogs.map(blog => blog.category).filter(Boolean);
          setCategories((currentCategories) => [...new Set([...currentCategories, ...nextCategories])]);
        }
      } catch (error) {
        console.error("Error fetching more blogs: ", error);
      } finally {
        setLoadingMoreBlogs(false);
      }
    };


    

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
      
        if (blogIndex === -1) return;

        if (userLikeDoc.exists()) {
          // User has liked, so remove their like
          await deleteDoc(userDocRef);
          await updateDoc(doc(db, 'blogPosts', blogId), { likesCount: increment(-1) });
          likedPosts.delete(blogId); // Remove from liked posts
      
          // Decrement the like count in the local state
          updatedBlogs[blogIndex].likesCount = updatedBlogs[blogIndex].likesCount - 1;
        } else {
          // User has not liked, so add their like
          await setDoc(userDocRef, { email: userEmail });
          await updateDoc(doc(db, 'blogPosts', blogId), { likesCount: increment(1) });
          likedPosts.add(blogId); // Add to liked posts
      
          // Increment the like count in the local state
          updatedBlogs[blogIndex].likesCount = updatedBlogs[blogIndex].likesCount + 1;
        }
      
        // Update the local state to reflect the new likes count
        setBlogPosts(updatedBlogs);
        setLikedPosts(new Set(likedPosts)); 
      };

      
      const filteredBlogs = blogPosts.filter(blog => {
        const normalizedSearch = blogSearchTerm.trim().toLowerCase();
        const matchesSearch = !normalizedSearch || [
          blog.title,
          blog.author,
          blog.coAuthor,
          blog.category,
        ].some((value) => String(value || '').toLowerCase().includes(normalizedSearch));
        const matchesCategory = selectedCategory === 'show-all' || blog.category === selectedCategory;
        const matchesYear = !selectedYear || new Date(blog.dateCreated).getFullYear().toString() === selectedYear;
        const matchesMonth = !selectedMonth || (new Date(blog.dateCreated).getMonth() + 1).toString() === selectedMonth;
    
        return matchesSearch && matchesCategory && matchesYear && matchesMonth;
      });
    
      const recentBlog = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
      const otherBlogs = filteredBlogs.length > 1 ? filteredBlogs.slice(1) : [];

      const showBlogOptions = () => setIsDrawerOpen(true);
      const closeBlogOptions = () => setIsDrawerOpen(false);

    return(
        <BlogContext.Provider value={{blogPosts, loading, loadingMoreBlogs, hasMoreBlogs, fetchMoreBlogs, categories, years, months, blogSearchTerm, setBlogSearchTerm, selectedCategory, setSelectedCategory, likedPosts, handleLike, showBlogOptions, recentBlog, closeBlogOptions, otherBlogs, selectedYear, setSelectedYear, selectedMonth, setSelectedMonth, isDrawerOpen, setIsDrawerOpen}}>
            { children }
        </BlogContext.Provider>
    )

}

export const useBlog = () => useContext(BlogContext);
