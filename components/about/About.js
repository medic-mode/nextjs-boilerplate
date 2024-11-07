"use client"
import { useEffect } from 'react'
import './About.css'
import Aos from 'aos';
import 'aos/dist/aos.css';



const About = () => {

	useEffect(() => {
		Aos.init({ duration: 1200 });
	  }, []);



  return (
	<div className="about-container">
		<div className="about-header">
			<img src='/assets/about/header-image.png' alt="" />
			<div className='about-header-title'>
				<h1 data-aos="fade-down">About Us</h1>
				<p  data-aos="fade-up">Empowering paramedics and first responders with innovative training, research, and community-focused initiatives to create a safer, more prepared India.</p>
			</div>
		</div>

		<div className="journey">
			<h2 >Our Journey in <span style={{color:'var(--orange)'}}>Life-Saving Service</span></h2>
			<div className="journey-content">
				<div className="journey-content-text">
					<p>Medicmode LLP is a pioneering paramedic-led organisation dedicated to the welfare, development, and ongoing education of paramedics and healthcare professionals across India. With a focus on accessible, high-quality training, we believe that learning does not end with formal education. Instead, we view continuing education as essential for equipping paramedics with the knowledge and skills necessary to provide exemplary care in an ever-evolving field.</p>
				</div>
				<div className="journey-content-image">
					<img src='/assets/logos/medicmode-logo-slogan.png' alt="" />
				</div>
			</div>
		</div>

		<div className="our-vision-container">
            <div className="our-vision">
                <div className="vision-image">
                    <img src='/assets/about/vision.png' alt="Vision placeholder" />
                </div>
                <div className="vision-content" data-aos="fade-left">
                    <h2>Our <span style={{color:'var(--orange)'}}>vision</span></h2>
                    <p>We envision an India where EMS leadership is paramedic-led and fueled by research, innovation, and simulation. Our long-term vision is to transform emergency medical services into a progressive, research-driven field that values ongoing skill development and promotes paramedics as leaders within the EMS structure. At Medicmode, we’re actively building a robust EMS ecosystem that is powered by quality training and collaboration, empowering paramedics and first responders to make a lifesaving impact on every scene.</p>
                </div>
            </div>
        </div>


		<div className="our-mission-container">
            <div className="our-mission">
                <div className="mission-content"  data-aos="fade-right">
                    <h2>Our <span style={{color:'var(--orange)'}}>Mission</span></h2>
                    <p>Our mission is to elevate paramedic and EMS standards in India by providing comprehensive, affordable, and accessible education. We are committed to supporting paramedics at all stages of their careers, offering a pathway to continual improvement that empowers them to deliver critical, time-sensitive care in emergencies. Beyond individual training, our goal is to create a culture where trained paramedics work alongside informed lay responders, building a future EMS system that is resilient and community-focused.</p>
                </div>
                <div className="mission-image">
                    <img src='/assets/about/mission.png' alt="Vision placeholder" />
                </div>
            </div>
        </div>


		<div className="whatwedo-container">
			<div className="whatwedo">
			<div className="whatwedo-header">
				<h2>What <span style={{color:'var(--orange)'}}>We Do</span></h2>
				<p style={{fontWeight:'400'}}>Medicmode offers a suite of services tailored for paramedics, healthcare workers, and the broader community</p>
			</div>
			<div className="whatwedo-content">
				<div className="whatwedo-item"  data-aos="flip-up">
					<div>
						<img src='/assets/about/open-book.png' alt="" />
					</div>
					<div>
						<h3>Paramedic and Healthcare Education</h3>
						<p>Our curriculum extends beyond foundational training, with specialised courses designed for continued professional development in emergency medicine. Our programs include both online and offline formats, making advanced learning accessible to paramedics across India.</p>
					</div>
				</div>
				<div className="whatwedo-item" data-aos="flip-up">
					<div>
						<img src='/assets/about/teaching.png' alt="" />
					</div>
					<div>
						<h3>First Responder and CPR Training</h3>
						<p>We believe that the future of EMS lies in creating empowered lay first responders who can deliver essential, initial care in emergency situations. Our community-centred approach is realised through CPR and first aid courses offered in schools, colleges, and industrial setups. Our “Chennai Knows CPR” initiative embodies this mission by training thousands in lifesaving skills across Chennai, creating a safer and more prepared community. We are proud to have been among the first organisations in Chennai, and the second in Tamil Nadu, to conduct CPR and first aid training for the transgender community, fostering inclusivity in EMS training.</p>
					</div>
              </div>
              <div className="whatwedo-item" data-aos="flip-up" >
					<div>
						<img src='/assets/about/research-and-development.png' alt="" />
					</div>
					<div>
						<h3>Research and EMS Development</h3>
						<p>Research is central to our mission. We aim to drive EMS forward in India by encouraging a research-focused approach, fostering collaboration, and providing platforms for EMS professionals to engage with emerging practices and technologies.</p>
					</div>
              </div>
              <div className="whatwedo-item" data-aos="flip-up">
			  	<div>
					<img src='/assets/about/mentorship.png' alt="" />
				</div>
				<div>
					<h3>Career Guidance and Mentorship</h3>
					<p>Our commitment goes beyond training; we support paramedics in achieving fulfilling careers within EMS. Through career guidance, mentorship, and continuous educational content on platforms like YouTube and Instagram, we provide paramedics with the tools they need to advance professionally and navigate their paths with confidence.</p>
				</div>
              </div>
			</div>
			</div>
		</div>

		<div className="community-container">
			<div className="community">
				<h2>The Need for <span style={{color:'var(--orange)'}}>Community Training</span></h2>
				<p>India’s rapid population growth and diverse geography pose unique challenges to EMS. The average ambulance response time is approximately 20 minutes in urban areas and can extend to 40 minutes in rural regions. In response, we focus on first responder training at an affordable cost, enabling community members to step in and administer initial care before EMS arrival. This “bridging care” approach ensures that essential help is available, regardless of location, and underscores our belief that empowered communities play a vital role in emergency response.</p>
			</div>
		</div>

		<div className="commitment-container">
			<div className="commitment">
				<h2>Our <span style={{color:'var(--orange)'}}>Commitment</span></h2>
				<p>India’s rapid population growth and diverse geography pose unique challenges to EMS. The average ambulance response time is approximately 20 minutes in urban areas and can extend to 40 minutes in rural regions. In response, we focus on first responder training at an affordable cost, enabling community members to step in and administer initial care before EMS arrival. This “bridging care” approach ensures that essential help is available, regardless of location, and underscores our belief that empowered communities play a vital role in emergency response.</p>
			</div>
		</div>

		<div className="leadership-container">
			<div className="leadership">
				<h2>Our <span style={{color:'var(--orange)'}}>Leadership</span></h2>
				<div className='leader'>
					<img src='/assets/faculties/Jabez.png' alt="" />
					<div className="leader-content"  data-aos="zoom-in">
						<h3>Jabez - Founder & CEO</h3>
						<p>Medicmode was founded in 2018 by Jabez during the first year of his undergraduate studies, marking the start of his commitment to advancing paramedic education and professional standards in India. Currently a lecturer, course coordinator, and paramedic at AJ Institute of Medical Sciences in Mangalore, Jabez holds an M.Sc. in Trauma Care Management from Sriher and a B.Sc. in Accident and Emergency Care Technology from Sundaram Medical Foundation, blending strong academic and hands-on expertise. His contributions have been recognized through numerous awards, including Best Poster at EMCON 2018, Winner for Poster Presentation at EMCON 2022, and Runner-Up awards at SEPICON 2018, SAPCON 2018, FORUM 2020, and the Resuscitation Summit 2023.
						</p>
						<p>As Medicmode’s Founder and CEO, Jabez has led innovative projects, including a prehospital care reporting (PCR) app prototype and a prone-position CPR mannequin. He is also known for his dedication to simulation-based training, prehospital care workshops, and layperson CPR and first aid training. His extensive experience organizing paramedic conferences, coupled with substantial involvement in media and research, aligns with Medicmode’s mission to advance EMS in India through quality training, research, and professional support.</p>
					</div>
				</div>
				<div className='leader'>
					<img src='/assets/faculties/Praisy Abigail.jpg' alt="" />
					<div className="leader-content" data-aos="zoom-in">
						<h3>Praisy Abigail - COO</h3>
						<p>Ms. Praisy Abigail, COO of Medicmode, is a skilled professional in trauma and disaster management. She completed her undergraduate and postgraduate degrees in Trauma Care Management at Sri Ramachandra Institute of Higher Education and Research, where she received the prestigious Shri Arjun Singh Gold Medal for outstanding academic performance. Additionally, she holds a postgraduate diploma in Disaster Management from Indira Gandhi Open University and is currently pursuing an MBA in Hospital Management. She serves as an Assistant Professor at Malla Reddy University in Hyderabad and previously worked as a lecturer and paramedic at Panimalar Medical College and Hospital.</p>
						<p>Ms. Praisy’s accomplishments include winning first prize in the Bright Young Speaker competition at SAPCON 2019, presenting at various conferences, and participating as faculty in numerous workshops. Her extensive experience training laypersons in CPR and first aid, coupled with her involvement in organizing paramedic conferences, supports Medicmode’s mission to advance EMS education and practice in India. Her expertise and dedication are instrumental in driving the organization’s goals.</p>
					</div>
				</div>
				<div className='leader'>
					<img src='/assets/faculties/Sivanesh E.jpg' alt="" />
					<div className="leader-content" data-aos="zoom-in" >
						<h3>Sivanesh - CFO</h3>
						<p>Mr. Sivanesh, CFO of Medicmode, is a licensed paramedic with the Dubai Corporation of Ambulance Service (DCAS) and brings exceptional dedication to his role. After completing his B.Sc. in Accident and Emergency Care at Sundaram Medical Foundation, where he gained around three years of clinical experience, he advanced his career internationally, first working with Response Plus Medic in Dubai and now contributing his expertise to DCAS.</p>
						<p>Passionate about EMS research, training, and development, Mr. Sivanesh has actively contributed to the EMS field through conference presentations and poster sessions. His notable contributions include developing the “CLAP” mnemonic for dispatchers at Sundaram Medical Foundation, enhancing emergency response procedures. He has trained numerous people with CPR and First Aid skills. His unwavering dedication to Medicmode’s growth since its inception has been invaluable, reflecting his commitment to elevating EMS education and practice.</p>
					</div>
				</div> 
			</div> 
		</div>
		
	</div>
  )
}

export default About