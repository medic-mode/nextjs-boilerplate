"use client"
import { useEffect, useState } from 'react';
import AOS from 'aos'
import 'aos/dist/aos.css'
import { collection, getDocs, query, orderBy, setDoc, doc, getDoc, deleteDoc, where } from 'firebase/firestore'; 
import { db } from '../../lib/firebase'; 
import './Blogs.css';
import CategoryIcon from '@mui/icons-material/Category';
import ArchiveIcon from '@mui/icons-material/Archive';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { toast, Toaster } from 'sonner';
import { RWebShare } from "react-web-share";
import { Button } from '@mui/material';
import { GridLoader } from 'react-spinners';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';


const Blogs = ({userEmail, logged , handleOpen}) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('show-all');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [loading, setLoading] = useState(true);
  

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



  
  // Separate useEffect for checking likes
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
    setLikedPosts(new Set(likedPosts)); // Re-render to show liked status immediately
  };


  const handleCommentIconClick = (id) => {
    router.push({
      pathname: `/blogs/${id}`,
      query: { focusOnComments: 'true' },
    });
  };

  const handlePost = (path, e) => {
    if (!logged) {
      
      toast.info('Please login to create a blog!', {
        duration: 3000 
      });
      e.preventDefault();
      handleOpen(); 
    } else {
     
      router.push(path);
    }
  };

  useEffect(() => {
    AOS.init({duration: 1000})
  }, [])

  if (loading || !blogPosts) {
    return (
      <div className="loading-container">
        <GridLoader color={"#0A4044"} loading={loading} size={10} />
      </div>
    );
  }

  console.log(recentBlog.id)
 
  return (
    <div className="blogs">
       <Toaster position="top-center" richColors /> 
      <div className="blog-header">
        <Image className="blog-header-image" src='/assets/blogs/blog.png' alt="Blog Header" width={200} height={400}/>
          <div className="blog-heading">
            <h1>
              Our Latest <span style={{ color: 'var(--orange)' }}>Blogs</span> &{' '}
              <span style={{ color: 'var(--orange)' }}>News</span>
            </h1>
          </div>
        
        <div className="blog-search-bar"  >
          <div onClick={showBlogOptions} style={{display: 'flex', alignItems: 'center'}}>
            <p>Search</p>
            <SearchIcon style={{marginLeft: '5px'}}/>  
          </div>
              {userEmail ===  'admin@medicmode.com' ? (
                <p className='create-user-blog-btn create-user-blog' onClick={(e) => handlePost('/dashboard/create-post', e)}>Create Blog</p>
              )
              :
              (<p className='create-user-blog-btn create-user-blog'  onClick={(e) => handlePost('/blog/create-post', e)} >Create Blog</p>
              )
              }
        </div>
        
      </div>

      <div className="primary">
        {recentBlog ? (
          
          <div className="primary-blog" data-aos='fade-up'>
            <div className="blog-image-container">
              <Link href={`/blogs/${recentBlog.id}`} >
                <img src={recentBlog.thumbnail} alt={recentBlog.title} />
                
              </Link>
            </div>
            <div className="descriptions">
              <div className="details">
                <p>{new Date(recentBlog.dateCreated).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</p>
                <p>{recentBlog.category.toUpperCase()}</p>
              </div>
              <div className="title">
                <Link href={`/blogs/${recentBlog.id}`} style={{ textDecoration: 'none' }}>
                  <h2>{recentBlog.title}</h2>
                </Link>
              </div>
            </div>
            <div className="likes">
			{likedPosts.has(recentBlog.id) ? (
					<FavoriteIcon 
						onClick={() => handleLike(recentBlog.id)} 
						style={{ 
							background: 'none', 
							border: 'none',
							cursor: 'pointer',
							padding: '0',
              marginRight:'5px'
						}} 
						sx={{ color: 'red'}} // Change color for liked state
					/> 
				) : (
					<FavoriteBorderIcon 
						onClick={() => handleLike(recentBlog.id)} 
						sx={{ 
              background: 'none', 
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              transition: 'transform 0.2s ease', 
              marginRight:'5px',
              '&:hover': {
                transform: 'scale(1.1)', // Zoom effect on hover
              },
              color: 'var(--dark-green)' // Adjust color if necessary
            }} // Change color for unliked state
					/>
				)} <span>{recentBlog.likesCount > 0 ? `${recentBlog.likesCount} Likes` : 'Like'}</span>
        
              <div  onClick={() => {handleCommentIconClick(recentBlog.id)}} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
              <ChatBubbleOutlineIcon style={{ marginLeft: '20px', marginRight:'5px' }} /> 
              <span> {recentBlog.commentsCount > 0 ? `${recentBlog.commentsCount} Comments` : 'Comment'}</span>
              </div>
              <RWebShare
                  data={{
                    text: "Medic Modec - A Gazette for Emergency Medical Professionals",
                    url: `https://medicmode.com/blogs/${recentBlog.id}`,
                    title: "Medic Mode",

                  }}
                  onClick={() => toast.success('Shared successfully!', {
                    duration: 3000 
                })}
                >
                   <ShareIcon style={{ cursor: 'pointer', marginLeft: '20px' }} />
                </RWebShare>
             
            </div>
          </div>
        ) : (
          <div className="loading-container">
            <GridLoader color={"#0A4044"} loading={loading} size={10} />
          </div>
        )}

        <div className={`blog-options ${isDrawerOpen ? 'open' : ''}`}>
          <div className="drawer-header">
            <CloseIcon onClick={closeBlogOptions} style={{ cursor: 'pointer', position: 'absolute', right: '20px', color: 'var(--dark-green)' }} />
          </div>
          <div className="categories">
            <h2>
              <CategoryIcon style={{ fontSize: '20px', marginRight: '8px' }} /> Categories
            </h2>
            <div className="options">
              <select value={selectedCategory} onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedYear('');
                setSelectedMonth('');
                setIsDrawerOpen(false);
              }}>
                <option value="show-all">Show All</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="archives">
            <h2>
              <ArchiveIcon style={{ fontSize: '20px', marginRight: '8px' }} /> Archives
            </h2>
            <div className="options">
              <select value={selectedMonth} onChange={(e) => { setSelectedMonth(e.target.value); setIsDrawerOpen(false) }}>
                <option value="">Select Month</option>
                {months.map(month => (
                  <option key={month} value={month}>{new Date(0, month - 1).toLocaleString('default', { month: 'long' })}</option>
                ))}
              </select>

              <select style={{ marginLeft: '8px' }} value={selectedYear} onChange={(e) => { setSelectedYear(e.target.value); setIsDrawerOpen(false) }}>
                <option value="">Select Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="user-create-blog">
              <h3>Thinking about blogging?</h3>
              <h3>Click to get started!</h3>
              {userEmail ===  'admin@medicmode.com' ? (
                <Button className='create-user-blog-btn' onClick={(e) => handlePost('/dashboard/create-post', e)}>Create Blog</Button>
              )
              :
              (<Button className='create-user-blog-btn'  onClick={(e) => handlePost('/blogs/create-post', e)} >Create Blog</Button>
              )
              }
            </div>
        </div>
      </div>

      <div className="secondary">
        {otherBlogs.length > 0 ? (
          otherBlogs.map(blog => (
            <div key={blog.id} className="other-blogs" data-aos='zoom-in'>
              <div className="blog-image-container">
                <Link href={`/blogs/${blog.id}`} >
                  <img src={blog.thumbnail} alt={blog.title} />
                </Link>
              </div>
              <div className="descriptions">
                <div className="details">
                  <p>{new Date(blog.dateCreated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</p>
                  <p>{blog.category.toUpperCase()}</p>
                </div>
                <div className="title">
                  <Link href={`/blogs/${blog.id}`} style={{ textDecoration: 'none' }}>
                    <h2>{blog.title}</h2>
                  </Link>
                </div>
              </div>
              <div className="likes">
			  {likedPosts.has(blog.id) ? (
					<FavoriteIcon 
						onClick={() => handleLike(blog.id)} 
						style={{ 
							background: 'none', 
							border: 'none',
							cursor: 'pointer',
							padding: '0',
              marginRight:'5px'
						}} 
						sx={{ color: 'red' }} // Change color for liked state
					/>
				) : (
					<FavoriteBorderIcon 
						onClick={() => handleLike(blog.id)} 
						sx={{ 
              background: 'none', 
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              marginRight:'5px',
              transition: 'transform 0.2s ease', // Smooth transition
              '&:hover': {
                transform: 'scale(1.1)', // Zoom effect on hover
              },
              color: 'var(--dark-green)' // Adjust color if necessary
            }}  // Change color for unliked state
					/>
				)} <span>{blog.likesCount > 0 ? `${blog.likesCount} Likes` : 'Like'}</span>
                <div  onClick={() => {handleCommentIconClick(blog.id)}} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
              <ChatBubbleOutlineIcon style={{ marginLeft: '20px',marginRight:'5px' }} /> 
              <span>{blog.commentsCount > 0 ? `${blog.commentsCount} Comments` : 'Comment'}</span>
              </div> 
                <RWebShare
                  data={{
                    text: "Medic Modec - A Gazette for Emergency Medical Professionals",
                    url: `https://medicmode.com/blogs/${blog.id}`,
                    title: "Medic Mode",
                  }}
                  onClick={() => toast.success('Shared successfully!', {
                    duration: 3000 
                })}
                >
                   <ShareIcon style={{ cursor: 'pointer', marginLeft: '20px' }} />
                </RWebShare>
                
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Blogs;
