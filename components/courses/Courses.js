"use client"
import { useEffect, useState } from 'react';
import './Courses.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Rating from '@mui/material/Rating';
import { db } from '../../lib/firebase';
import { collection, getDocs, orderBy, query, where, doc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import { GridLoader } from 'react-spinners';
import { toast } from 'sonner';
import { useAuth } from '../AuthContext';

const Courses = () => {

  const {logged} = useAuth()

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [courses, setCourses] = useState([]);
  const [visibleCourses, setVisibleCourses] = useState(8);
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const coursesCollection = collection(db, 'courses');
      const q = query(coursesCollection, where('approved', '==', 'yes'), orderBy('dateCreated', 'desc'));
      const querySnapshot = await getDocs(q);
      const coursesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesList);
    } catch (error) {
      console.error("Error fetching courses: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const updateRating = async (courseId, newRating) => {
    try {
      const courseDoc = doc(db, 'courses', courseId);
      await updateDoc(courseDoc, { ratingValue: newRating });
      toast.success('Thank you for rating our course.');
    } catch (error) {
      console.error("Error updating rating: ", error);
      toast.error('Failed to update rating. Please try again.');
    }
  };

  const handleShowMore = () => {
    setVisibleCourses(prevVisible => prevVisible + 4);
  };

  const capitalizeFirstLetter = (mode) => {
    return mode
      .split(',')
      .map(item => item.trim())
      .map(item => item.charAt(0).toUpperCase() + item.slice(1))
      .join(', ');
  };

  const handleModeChange = (e) => {
    setSelectedMode(e.target.value);
  };

  const handlePriceChange = (e) => {
    setSelectedPrice(e.target.value);
  };

  const filteredCourses = courses.filter(course => {
    const modeMatches = selectedMode ? course.mode.includes(selectedMode) : true;
    const priceMatches = selectedPrice ? course.priceDetail === selectedPrice : true;
    return modeMatches && priceMatches;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <GridLoader color={"#0A4044"} loading={loading} size={10} />
      </div>
    );
  }

  const facultyImages = [
    '/assets/faculties/Praisy Abigail.jpg',
    '/assets/faculties/Jabez.jpg',
    'assets/faculties/Sivanesh E.jpg',
    'assets/faculties/Mangaipagan S.jpg',
    '/assets/faculties/Sneha.jpg',
    'assets/faculties/Bargavi.jpg',
    '/assets/faculties/Sujaritha N.jpg',
    'assets/faculties/Praveen P.jpg',
    'assets/faculties/Sharmila.jpg',
    'assets/faculties/Ishan.jpg',
    '/assets/faculties/Santhosh Ravi.jpg',
    '/assets/faculties/Roginippriya.jpg',
    'assets/faculties/Thamaraiselvam.jpg',
    'assets/faculties/Manoj.jpg'
  ];
  
  const facultyNames = [
    'Praisy Abigail',
    'Jabez',
    'Sivanesh E',
    'Mangaipagan S',
    'Sneha',
    'Bargavi',
    'Sujaritha N',
    'Praveen P',
    'Sharmila',
    'Ishan',
    'Santhosh Ravi',
    'Rogini Priya',
    'Thamaraiselvam',
    'Manoj'
  ];

  return (
    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
    <div className='course-container'>
      <div className="course-header">
        <Swiper
          style={{backgroundColor: 'transparent'}}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Navigation, Pagination]}
        >
          <SwiperSlide><img src='/assets/courses/header1.png' alt="Background 1" className="course-swiper-image" /></SwiperSlide>
          <SwiperSlide><img src='/assets/courses/header2.jpg' alt="Background 2" className="course-swiper-image" /></SwiperSlide>
          <SwiperSlide><img src='/assets/courses/header3.jpg' alt="Background 3" className="course-swiper-image" /></SwiperSlide>
        </Swiper>
      </div>
      <div className="courses">
        <div className="course-heading">
          <h1>Our <span style={{color:'var(--orange)'}}>Courses</span></h1>
          <div className="course-search">
            <h3>Search</h3>
            <div className="search-container">
              <select onChange={handleModeChange}>
                <option value="" disabled>Select Course Mode</option>
                <option value="">All Modes</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
              <select onChange={handlePriceChange}>
                <option value="" disabled>Select Price</option>
                <option value="">All Prices</option>
                <option value="Paid">Paid</option>
                <option value="Free">Free</option>
              </select>
            </div>
          </div>
        </div>
        <div className="course-main">
          <div className="course-list-wrapper">
            {filteredCourses.slice(0, visibleCourses).map((course) => (
              <div className="course-list" key={course.id} data-aos="fade-up">
                <Link href={`/courses/${course.id}`} >
                  <img src={course.thumbnail} alt={course.courseTitle} />
                  <h3>{course.courseTitle}</h3>
                  <div className="course-category">
                    <p>{capitalizeFirstLetter(course.mode)} | {course.priceDetail}</p>
                    <p className="duration">
                      <AccessTimeIcon style={{ fontSize: '15px', marginRight: '5px' }} />
                      {`${course.duration.hours}:${course.duration.minutes} h`}
                    </p>
                  </div>
                </Link>
                {logged ? (
                  <Rating
                    name="simple-controlled"
                    value={course.ratingValue || 0}
                    precision={0.5}
                    onChange={(event, newValue) => {
                      if (newValue > 3.5) {
                        updateRating(course.id, newValue);
                      }
                    }}
                  />
                ) : (
                  <Rating
                    name="half-rating-read"
                    defaultValue={course.ratingValue}
                    precision={0.5}
                    readOnly
                    style={{ marginTop: '10px' }}
                    onClick={() => toast.info("Please log in to rate our course.")}
                  />
                )}
              </div>
            ))}
          </div>
          {visibleCourses < filteredCourses.length && (
            <div className="button-container">
              <button onClick={handleShowMore} className="show-more-button">
                Show More
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="our-trainers">
        <h2 style={{fontSize:'35px'}}>Meet Our <span style={{color:'var(--orange)'}}>Faculties</span></h2>
        <div className="trainers-container">
          <div className="trainers-row">
            {facultyImages.slice(0, 3).map((image, index) => (
              <div className="trainer" key={index}>
                <img src={image} alt={`Trainer ${index + 1}`} className="trainer-image" />
                <h3>{facultyNames[index]}</h3>
              </div>
            ))}
          </div>
          <div className="trainers-row">
            {facultyImages.slice(3, 8).map((image, index) => (
              <div className="trainer" key={index + 3}>
                <img src={image} alt={`Trainer ${index + 4}`} className="trainer-image" />
                <h3>{facultyNames[index + 3]}</h3>
              </div>
            ))}
          </div>
          <div className="trainers-row">
            {facultyImages.slice(8).map((image, index) => (
              <div className="trainer" key={index + 8}>
                <img src={image} alt={`Trainer ${index + 9}`} className="trainer-image" />
                <h3>{facultyNames[index + 8]}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Courses;
