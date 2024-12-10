"use client"
import { useEffect, useState } from 'react';
import AOS from 'aos'
import 'aos/dist/aos.css'
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
import { useAuth } from "../AuthContext";
import { useRouter } from 'next/navigation';
import { useBlog } from '../BlogContext';


const Blogs = () => {

  const { logged, handleOpen, userEmail } = useAuth();

  const { blogPosts, categories, years, months, selectedCategory, setSelectedCategory, likedPosts, handleLike, showBlogOptions, recentBlog, closeBlogOptions, otherBlogs, selectedYear, setSelectedYear, selectedMonth, setSelectedMonth, isDrawerOpen, setIsDrawerOpen} = useBlog()

  const [loading, setLoading] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);
  
  const router = useRouter()


  const handlePost = (path, e) => {
    setLoading(true)
    if (!logged) {
      toast.info('Please login to create a blog!', {
        duration: 3000 
      });
      e.preventDefault();
      setPendingPath(path);
      handleOpen(); 
    } else {
     
      router.push(path);
    }
  };

  useEffect(() => {
    AOS.init({duration: 1000})
  }, [])

  useEffect(() => {
    if (logged && pendingPath) {
      router.push(pendingPath); // Navigate to saved path
      setPendingPath(null); // Reset the pending path
    }
  }, [logged, pendingPath, router]);

  if (loading || !blogPosts) {
    return (
      <div className="loading-container">
        <GridLoader color={"#0A4044"} loading={loading} size={10} />
      </div>
    );
  }


  const handleCommentIconClick = (id) => {
    setLoading(true)
    router.push(`/blogs/${id}?focusOnComments=true`, undefined, { shallow: true });
  };
  
  const viewBlogs = (id) => {
    setLoading(true);
    router.push(`/blogs/${id}`)
  }



  return (
    <div style={{display:'flex', justifyContent:'center', }}>
    <div className="blogs">
       <Toaster position="top-center" richColors /> 
      <div className="blog-header">
        <Image className="blog-header-image" src='/assets/blogs/blog.png' alt="Blog Header" width={1280} height={400} priority />
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
              (<p className='create-user-blog-btn create-user-blog'  onClick={(e) => handlePost('/blogs/create-post', e)} >Create Blog</p>
              )
              }
        </div>
        
      </div>

      <div className="primary">
        {recentBlog ? (
          
          <div className="primary-blog" data-aos='fade-up'>
            <div className="blog-image-container">
              <div onClick={() => viewBlogs(recentBlog.id)} style={{cursor:'pointer'}}>
                <img src={recentBlog.thumbnail} alt={recentBlog.title} />
              </div>
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
                <div onClick={() => viewBlogs(recentBlog.id)} style={{cursor:'pointer'}}>
                  <h2>{recentBlog.title}</h2>
                </div>
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
                    text: "Medic Mode - A Gazette for Emergency Medical Professionals",
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
                <div onClick={() => viewBlogs(blog.id)} style={{cursor:'pointer'}}>
                  <img src={blog.thumbnail} alt={blog.title} />
                </div>
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
                  <div onClick={() => viewBlogs(blog.id)} style={{cursor:'pointer'}}>
                    <h2>{blog.title}</h2>
                  </div>
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
                    text: "Medic Mode - A Gazette for Emergency Medical Professionals",
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
    </div>
  );
};

export default Blogs;
