import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import './CoverFlow.css';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import { Rating } from '@mui/material';
import Image from 'next/image'; 

export default function CoverFlow() {


    const testimonies = [{
        name: 'Aravindhan',
        profession: 'Healthcare Professional',
        message: `I recently attended Medicmode's BLS and ACLS session and was impressed by the trainers' expertise and dedication. The course material was well-structured, and the simulation-based training helped me retain the information better. The training has enhanced my skills and prepared me to handle critical situations effectively. Kudos to Medicmode!`
    },
    {
        name: 'Christina',
        profession: 'School Health Coordinator',
        message: `As a School Health Coordinator, I was looking for a reliable training provider for our staff. Medicmode exceeded our expectations! Their BLS and ACLS training was engaging, informative, and tailored to our needs. The trainers were enthusiastic and ensured everyone understood the concepts. Our staff is now more confident in responding to emergencies.`
    },
    {
        name: 'Abdul Rashith',
        profession: 'Managing director - Poochandi productions',
        message: `Medicmode's CPR and First Aid training was truly exceptional! The instructors were knowledgeable, patient, and made complex concepts easy to grasp. The hands-on training sessions boosted my confidence in responding to emergencies. I highly recommend Medicmode for anyone seeking comprehensive and engaging training.`
    },
    {
        name: 'Aravindhan',
        profession: 'Healthcare Professional',
        message: `I recently attended Medicmode's BLS and ACLS session and was impressed by the trainers' expertise and dedication. The course material was well-structured, and the simulation-based training helped me retain the information better. The training has enhanced my skills and prepared me to handle critical situations effectively. Kudos to Medicmode!`
    }
]

  return (
    <>
      <div className="slider-content">
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={3} // Show 3 slides at a time
          loop={true} 
          autoplay={{
            delay: 2000, 
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={true}
          modules={[EffectCoverflow, Pagination, Autoplay]} 
          breakpoints={{
            0: {
              slidesPerView: 1, // Show one slide on screens up to 768px
            },
            768: {
              slidesPerView: 3, // Show three slides on screens larger than 768px
            },
          }}
          className="mySwiper"
        >
          {testimonies.map((testimony, index) => (
            <SwiperSlide key={index}>
              <div className="person-container">
                <div className="person-info">
                  <Image src='/assets/home/person.png' alt="Person" width={80} height={80} layout='responsive'/>
                  <div>
                    <h3>{testimony.name}</h3>
                    <p>{testimony.profession}</p>
                   </div>
                </div>
                <p className='person-message'>"{testimony.message}"</p>
                <Rating name="read-only" value={5} readOnly />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
