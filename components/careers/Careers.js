"use client"
import './Careers.css'
import Link from 'next/link'

const Careers = ({setLoading}) => {

  // setLoading (false)

  return (
   <div className='careers-container'>
    <div className='careers'>
        <h1>Careers</h1>
        <h2>We currently do not have any openings, but we will be recruiting soon. In the meantime, feel free to explore our other pages.</h2>
        <div >
            <Link href='/courses'><button>Courses</button></Link>
            <Link href='/blogs'><button>Blogs</button></Link>
        </div> 
    </div>
</div>

  )
}

export default Careers