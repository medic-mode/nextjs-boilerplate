"use client"
import './Home.css'
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; 
import { Autoplay, Navigation, Pagination } from 'swiper/modules';  
import 'swiper/css/navigation';  
import 'swiper/css/pagination'; 
import Image from 'next/image'; 
import Button from '../button/Button'
import Aos from 'aos';
import { useEffect, useState } from 'react';
import 'aos/dist/aos.css';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import SchoolIcon from '@mui/icons-material/School';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import InsightsIcon from '@mui/icons-material/Insights';
import CountUp from 'react-countup';
import CoverFlow from '../testimony/CoverFlow';
import ImageGrid from '../gallery/ImageGrid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Team from '../team/Team'
import {
    VerticalTimeline,
    VerticalTimelineElement,
  } from "react-vertical-timeline-component";
  import "react-vertical-timeline-component/style.min.css";
  import { FaCalendarAlt } from "react-icons/fa";
  import { db } from '../../lib/firebase'; 
import { collection, getDocs } from 'firebase/firestore';




export default function Home() {

	


	useEffect(() => {
		Aos.init({ duration: 1000 });
	  }, []);

	  const [events, setEvents] = useState([]);

	  useEffect(() => {
		const fetchEvents = async () => {

		  try {
			const eventsCollection = collection(db, 'events');
			const eventSnapshot = await getDocs(eventsCollection);
			
			const eventList = eventSnapshot.docs
			  .map(doc => {
				const eventData = doc.data();
				
				// Format date based on the data type
				const formattedDate = typeof eventData.date === 'string' 
				  ? new Date(eventData.date).toLocaleDateString('en-US', {
					  year: 'numeric',
					  month: 'long',
					  day: 'numeric'
					})
				  : eventData.date.toDate().toLocaleDateString('en-US', {
					  year: 'numeric',
					  month: 'long',
					  day: 'numeric'
					});
	
				return {
				  id: doc.id,
				  ...eventData,
				  date: formattedDate,
				};
			  })
			  // Filter for approved events only
			  .filter(event => event.approved === true); // Assuming approved is a string
	
			setEvents(eventList);
		  } catch (error) {
			console.error('Error fetching events:', error);
		  }
		};
	
		fetchEvents();
	  }, []);

  return (
    <div className="home-container">
      <div className='swiper'>
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Navigation, Pagination]} 
        >
          <SwiperSlide>
            <Image
              src="/assets/home/bg1.jpg"
              alt="Background 1"
              width={1920}  
              height={1080} 
              className="swiper-image"  
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/assets/home/bg2.jpg"
              alt="Background 2"
              width={1920}
              height={1080}
              className="swiper-image"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/assets/home/bg3.jpg"
              alt="Background 3"
              width={1920}
              height={1080}
              className="swiper-image"
            />
          </SwiperSlide>
        </Swiper>
        <div className="intro-text">
          <h1>Welcome to Medic <span style={{ color: 'var(--orange)' }}>Mode</span></h1>
          <Link href="#about" >
            <button className="explore-btn">Explore more</button>
          </Link>
        </div>
      </div>

	  {/* ***************** About Us ********************/}
          
	  <div className="about-us-container" id='about' data-aos="zoom-in">
          <div className="about-us">
            <h2>About <span style={{color:'var(--orange)'}}>Medicmode</span></h2>
              <div className="about-us-content">
                <p>Medicmode LLP is a pioneering paramedic-led organisation dedicated to the welfare, development, and ongoing education of paramedics and healthcare professionals across India. With a focus on accessible, high-quality training, we believe that learning does not end with formal education. Instead, we view continuing education as essential for equipping paramedics with the knowledge and skills necessary to provide exemplary care in an ever-evolving field.</p>
              </div>
              <a href='/about' style={{textDecoration:'none'}}><Button /></a>
          </div>
        </div>

{/* ***************** Services *********************/}

<div className="services-container" >
		    <h2 >Why Choose <span style={{color:'var(--orange)'}}>Medicmode</span></h2>
			<p style={{width:'60%'}}>We provide expert paramedic services, led by certified professionals with a proven record in clinical governance, ensuring adherence to international standards.</p>
			<div style={{display:'flex', alignItems:'center'}} className='services-content'>
        <div className="services services-col1" >
			<div className="service" data-aos="fade-right">
				<div>
				<img src='/assets/home/skill.png' alt="" />
				</div>
				<div>
				<h3>Skill-Based Training</h3>
				<p>Hands-on training across essential skills, from soft skills to technical and leadership abilities.</p>
				</div>
			</div>
			
			<div className="service" data-aos="fade-right">
				<div>
				<img src='/assets/home/workshop.png' alt="" /> {/* Add your placeholder image here */}
				</div>
				<div>
				<h3>Educational Workshops</h3>
				<p>Interactive workshops offering real-world knowledge and collaborative learning.</p>
				</div>
			</div>

			<div className="service" data-aos="fade-right">
				<div>
				<img src='/assets/home/online.png' alt="" /> {/* Add your placeholder image here */}
				</div>
				<div>
				<h3>Online Courses</h3>
				<p>Explore a variety of self-paced online courses designed for different learning styles, covering foundational concepts to advanced techniques.</p>
				</div>
			</div>

			<div className="service" data-aos="fade-right">
				<div>
				<img src='/assets/home/seminar.png' alt="" /> {/* Add your placeholder image here */}
				</div>
				<div>
				<h3>Seminars</h3>
				<p>Engaging sessions focused on discussion, problem-solving, and peer support.</p>
				</div>
			</div>
			</div>
			<div className='services-col2'>
				<Image src='/assets/home/doctor.webp' alt="Doctor Image" data-aos="zoom-in" width={50} height={60} layout='responsive'/>
			</div>
			</div>
      </div>


{/* ***************** statistics *********************/}

<div className="statistics">
        <h2>Knowledge Shared by Our <span style={{ color: 'var(--orange)' }}>Expert Faculties</span></h2>
            <div className="stat-items">
                <div className="stat-item">
              <LocalLibraryIcon style={{fontSize:'40px', color:'var(--orange)'}}/>
                  <h3>
                  <CountUp end={1700} duration={3} enableScrollSpy scrollSpyOnce />+
                  </h3>
                  <p>Satisfied Learners</p>
                </div>
                <div className="stat-item">
              <SchoolIcon style={{fontSize:'40px', color:'var(--orange)'}}/>
                  <h3>
                  <CountUp end={10} duration={3} enableScrollSpy scrollSpyOnce />+
                  </h3>
                  <p>Courses Offered</p>
                </div>
                <div className="stat-item">
              <WatchLaterIcon style={{fontSize:'40px', color:'var(--orange)'}}/>
                  <h3>
                  <CountUp end={100} duration={3} enableScrollSpy scrollSpyOnce />+
                  </h3>
                  <p>Hours of Content</p>
                </div>
                <div className="stat-item">
              <InsightsIcon style={{fontSize:'40px', color:'var(--orange)'}}/>
                  <h3>
                  <CountUp end={5} duration={3} enableScrollSpy scrollSpyOnce />+
                  </h3>
                  <p>Years of Excellence</p>
                </div>
            </div>
        </div>

{/* ***************** events *********************/}

	{events.map((event) => (
        event.approved && (
          <div className="events-container" key={event.id}> 
            <h2>Upcoming <span style={{ color: 'var(--orange)' }}>Events</span></h2>
            <VerticalTimeline>
              <VerticalTimelineElement
                key={event.id} 
                date={event.date}
                iconStyle={{ background: "#0A4044", color: "#fff" }}
                contentStyle={{ background: "var(--light-green)", borderRadius:'20px', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'}}
                icon={<FaCalendarAlt />}
              >
                <h3 className="vertical-timeline-element-title" style={{ fontSize: '23px', marginBottom: '8px' }}>
                  {event.title}
                </h3>
                <h4 className="vertical-timeline-element-subtitle" style={{ color: 'var(--orange)', display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon /> {event.location}
                </h4>
                <p>{event.description}</p>
              </VerticalTimelineElement>
              </VerticalTimeline>
          </div>
        )
      ))}

{/* ***************** Testimony *********************/}

	<div className="testimony-container">
		  <h2>What <span style={{ color: 'var(--orange)' }}>People Say</span> About Medicmode</h2>
      <div className="slider">
        <CoverFlow />
      </div>
	</div>

{/* ***************** Gallery *********************/}

<div className="gallery-container">
        <h2>Gallery</h2>
          <ImageGrid />
      </div>

{/* ***************** Team *********************/}

      <div className="team-container">
        <h2>Our <span style={{ color: 'var(--orange)' }}>Team</span></h2>
        <Team />
      </div>

    </div>
  );
}
