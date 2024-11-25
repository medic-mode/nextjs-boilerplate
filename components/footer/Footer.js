"use client"
import './Footer.css'
import Image from 'next/image';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import Link from 'next/link';

const Footer = () => {

  return (
    <div className="footer-container">
        <div className='footer'>
            <div className="footer-logo">
                <Image src='/assets/logos/medicmode-logo-white-slogan.png' alt="" width={300} height={130}/>
            </div>
            <div className="quick-links">
                <h3>QUICK LINKS</h3>
                    <ul>
                        <li><Link href="/blogs">Blogs</Link></li>
                        <li><Link href="/courses">Courses</Link></li>
                        <li><Link href="/careers">Careers</Link></li>
                        <li><Link href="/contact">Contact Us</Link></li>
                        
                    </ul>
            </div>
            <div className="footer-courses">
                <h3>TRENDING COURSES</h3>
                    <ul>
                        <li><Link href="/courses/rjgImlEWz8M6XC5YFBBA">CPR, AED, and First Aid Course</Link></li>
                        <li><Link href="/courses/XeUaPbTF3tDhGyGwWGGF">DCAS Exam Preparatory Crash Course</Link></li>
                        <li><Link href="/courses/z0sGkATVpmoOfu3wg50S">Essentials of ECG - Crash Course</Link></li>
                    </ul>
            </div>
            <div className="policies">
                <h3>POLICIES</h3>
                    <ul>
                        <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link href="/terms-and-conditions">Terms and conditions</Link></li>
                        <li><Link href="/refund-cancellation">Refund and Cancellation Policy</Link></li>
                        
                    </ul>
            </div>
            <div className="address">
                <h3>GET IN TOUCH</h3>
                <div className="footer-address">
                    <p><span style={{marginRight: '8px'}}><MailOutlineIcon /></span><a href="mailto:contact@medicmode.com">contact@medicmode.com</a></p>
                    <p><span style={{marginRight: '8px'}}><PhoneIcon/></span>+91 95519 43040</p>
                </div>
            </div>
            
        </div>
        <div className="copyrights">
            <p>© 2024 Medic Mode. All rights reserved.</p>
            <p>Designed by <a href="https://www.instagram.com/kingz_digital_solutions/" target="_blank">Kingz Digital Solutions</a></p>
        </div>
    </div>
  )
}

export default Footer