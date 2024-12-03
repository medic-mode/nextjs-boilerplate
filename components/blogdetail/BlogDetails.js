"use client"
import React, { useEffect, useState, useRef } from 'react';
import './BlogDetails.css';
import { db } from '../../lib/firebase'; // Add your auth configuration
import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot, getDocs, where, deleteDoc, updateDoc, increment } from 'firebase/firestore';
import SendIcon from '@mui/icons-material/Send';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import { toast, Toaster } from 'sonner';
import YouTube from 'react-youtube';
import { GridLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAuth } from '../AuthContext';
import { useBlog } from '../BlogContext';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import { RWebShare } from "react-web-share";
import Image from 'next/image';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';


var getYouTubeID = require('get-youtube-id');

const BlogDetail = ({ loading, slug}) => {

    const { handleOpen , userEmail, logged } = useAuth()
    
    const {blogPosts, likedPosts, handleLike } = useBlog()

    const searchParams = useSearchParams();
    
    const postId = slug


    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [userDetails, setUserDetails] = useState({}); // To store user details

    const commentSectionRef = useRef(null);


    const [scrollProgress, setScrollProgress] = useState(0);

      const updateScrollProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        setScrollProgress(scrollPercent);
    };

    useEffect(() => {
        window.addEventListener('scroll', updateScrollProgress);
        return () => window.removeEventListener('scroll', updateScrollProgress);
    }, []);


    // Fetch the blog post details
    useEffect(() => {
        
        const fetchPost = async () => {
            try {
                const docRef = doc(db, 'blogPosts', postId); // Get the specific document by ID
                const docSnap = await getDoc(docRef);
        
                if (docSnap.exists()) {
                    setPost({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching post: ', error);
            }
        };

        fetchPost();
        // eslint-disable-next-line
    }, [postId]);


    useEffect(() => {
        const fetchComments = () => {
            const commentsRef = collection(db, 'blogPosts', postId, 'comments');
            const q = query(commentsRef, orderBy('timestamp', 'desc'));

            const unsubscribe = onSnapshot(q, async (snapshot) => {
                const commentsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Fetch user details for each comment
                const userDetailsMap = {};
                await Promise.all(
                    commentsData.map(async (comment) => {
                        if (!userDetailsMap[comment.email]) {
                            const userRef = collection(db, 'users');
                            const userQuery = query(userRef, where('email', '==', comment.email));
                            const userSnapshot = await getDocs(userQuery); // Use getDocs to query the data

                            // Iterate over the result to find the user details
                            userSnapshot.forEach((userDoc) => {
                                userDetailsMap[comment.email] = {
                                    firstName: userDoc.data().firstName,
                                    lastName: userDoc.data().lastName,
                                };
                            });
                        }
                    }) 
                );

                setComments(commentsData);
                setUserDetails(userDetailsMap);
            });

            return unsubscribe;
        };

        fetchComments();
    }, [postId]);

    const handleLikeClick = (id) => {
        if (id && handleLike) {
          handleLike(id);  
        }
      };

    // Handle comment submission
    const handleCommentSubmit = async () => {
        if (!userEmail || !logged) {
          toast.info("Please login to add a comment!", {
            duration: 3000,
          });
          handleOpen();
          return;
        }
    
        if (!commentText.trim()) {
          toast.info("Please type a comment before clicking send.", {
            duration: 3000,
          });
          return;
        }
    
        try {
          const commentsRef = collection(db, "blogPosts", postId, "comments");
          await addDoc(commentsRef, {
            email: userEmail,
            commentText,
            timestamp: new Date(),
          });
    
          const blogPostRef = doc(db, "blogPosts", postId);
          await updateDoc(blogPostRef, {
            commentsCount: increment(1),
          });
    
          setCommentText("");
        } catch (error) {
          console.error("Error adding comment: ", error);
        }
      };

    // Handle comment deletion
    const deleteComment = async (commentId) => {
        const commentRef = doc(db, 'blogPosts', postId, 'comments', commentId);
        try {
            await deleteDoc(commentRef);
        } catch (error) {
            console.error('Error deleting comment: ', error);
        }
    };

    useEffect(() => {
        if (!loading && post ) {
            if (comments.length || comments.length === 0) {

                const focusOnComments = searchParams.get('focusOnComments') === 'true';
                // Ensure the comments section exists
                if (focusOnComments && commentSectionRef.current) {
                   
                    const offset = 100; 
                    const topPosition = commentSectionRef.current.getBoundingClientRect().top + window.scrollY - offset;
    
                    window.scrollTo({
                        top: topPosition,
                        behavior: 'smooth',
                    });
                }
            }
        }
    }, [loading, post, comments]);
    

   

    if (loading || !post) {
        return (
          <div className="loading-container">
            <GridLoader color={"#0A4044"} loading={loading} size={10} />
          </div>
        );
      }
   
      
    const opts = {
        playerVars: {
          autoplay: 1,
        },
    }

    function capitalizeNames(name) {
        return name
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ");
      }


    return (
        <div className='blog-detail-container'>
             <div
                className="scroll-progress-bar"
                style={{ width: `${scrollProgress}%`, height: '7px', backgroundColor: 'var(--orange)', position: 'fixed', top: 83, left: 0, zIndex: 100 }}
            ></div>
            <Toaster position="top-center" richColors /> 
            <div className="blog-details">
                <div className="blog-detail-title">
                    <h1>{post.title}</h1>
                </div>
                <div className="blog-detail-description">

                    <div className="blog-detail-description-one">
                        {post.authorImg ? (
                            <Image src={post.authorImg} alt="Person" width={48} height={48} layout='responsive'/>
                        ):(
                            <Image src='/assets/home/person.png' alt="Person" width={48} height={48} layout='responsive'/>
                        )}
                        <div className="blog-detail-description-text" >
                            <h3>{capitalizeNames(post.author)}</h3>
                            {post.coAuthor && post.coAuthor.trim() && post.coAuthor !== 'None' && (
                                <>
                            <span style={{display:'flex', fontSize:'14px', gap:'10px'}}><p>with</p><h4> {capitalizeNames(post.coAuthor)}</h4></span> 
                                </>
                            )}
                        </div>
                    </div>

                    <div className="blog-detail-description-two">
                        <p className="blog-detail-description-two-p">{post.category}</p>
                        <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                                <CalendarTodayIcon style={{fontSize:'15px'}}/>
                                {post.updatedDate ? (
                                    <p>{new Date(post.updatedDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}</p>
                                ):(
                                    <p>{new Date(post.dateCreated).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}</p>
                                )}
                                
                        </div>
                    </div>

                            
                        </div>
                
               
                <hr className='separator'/>
                <div className="blog-detail-content">
                {post.slideImages && post.slideImages.length > 0 && (
                    <div className="slides-container">
                        {post.slideImages.map((slide, index) => (
                            <img 
                                key={index} 
                                src={slide} // Ensure this is the URL from Firebase Storage
                                alt={`Slide ${index + 1}`} 
                                style={{ width: '100%', height: 'auto', objectFit: 'cover', margin: '10px 0' }} 
                            />
                        ))}
                    </div>
                )}
                </div>
                <div className="blog-detail-content" dangerouslySetInnerHTML={{ __html: post.content }} />
                {post.youtubeUrl && (
                    <div className="youtube-link">
                        <YouTube videoId={getYouTubeID(post.youtubeUrl)} opts={opts} className='youtube' />
                    </div>
                )}
                
               
                {/* Comment Section */}
                <div className="comment-section" id='comment-section' ref={commentSectionRef}>

                    <div className="like-comment-share">
                        <div  style={{display:'flex', alignItems:'center'}} >
                        {likedPosts.has(postId) ? (
                            <FavoriteIcon 
                                onClick={() => handleLikeClick(postId)}
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
                                onClick={() => handleLikeClick(postId)}
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
                            )} 
                        <h3><span>{blogPosts.find((post) => post.id === postId)?.likesCount > 0 
                            ? `${blogPosts.find((post) => post.id === postId).likesCount} LIKES` 
                            : 'LIKE'}</span></h3>
                            </div>
                            <div  style={{display:'flex', alignItems:'center', gap:'8px'}}>
                            <ChatBubbleOutlineIcon/>
                            <h3>COMMENTS</h3>
                            </div>
                            <div  style={{display:'flex', alignItems:'center', gap:'8px'}}>
                            <RWebShare
                                data={{
                                    text: "Medic Mode - A Gazette for Emergency Medical Professionals",
                                    url: `https://medicmode.com/blogs/${postId}`,
                                    title: "Medic Mode",

                                }}
                                onClick={() => toast.success('Shared successfully!', {
                                    duration: 3000 
                                })}
                                >
                            <ShareIcon style={{cursor:'pointer'}}/>
                            </RWebShare>
                            <h3>SHARE</h3>
                            </div>
                    </div>
                    <hr className='separator'/>

                    {/* Input for adding a comment */}
                    <div className="input-wrapper">
                        <textarea
                            type="text"
                            placeholder="Write a comment..."
                            rows='2'
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <SendIcon onClick={handleCommentSubmit} className='send-icon' style={{ cursor: 'pointer' }} />
                    </div>

                    {/* Display comments */}
                    <div className="display-comments">
                        {comments.length > 0 ? (
                            comments.map(comment => (
                                <div key={comment.id} className="comment">
                                    <div className="comment-details">
                                        <div className="user-comment-details">
                                            <AccountBoxRoundedIcon style={{ fontSize: '40px', color: 'var(--orange)', marginRight:'10px' }} />
                                            <div>
                                                <h3>
                                                    {userDetails[comment.email]
                                                        ? `${userDetails[comment.email].firstName} ${userDetails[comment.email].lastName}`
                                                        : 'Loading...'}
                                                    {userEmail === 'admin@medicmode.com' ? 
                                                        <span
                                                            className="delete-text"
                                                            onClick={() => deleteComment(comment.id)}
                                                        >
                                                            Delete
                                                        </span> 
                                                    : ''}
                                                </h3>
                                                <p>{new Date(comment.timestamp.toDate()).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <p className='comment-text'>{comment.commentText}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{marginTop: '15px', color: 'var(--drak-green)'}}>No comments yet. Be the first to comment!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;


