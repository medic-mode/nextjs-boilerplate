"use client"

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GridLoader } from "react-spinners";

  

 const Page = () => {

	const {loading, logged} = useAuth()
  	
	const router = useRouter();


    useEffect(() => {
      if (logged === false) {
        router.push('/');
      }
    }, [logged, router]);



	return (
		<>
		{logged ? (<div className="welcome-dashboard" style={{display:'flex', alignItems:'center', justifyContent:'center', height:'70vh'}}>
            <h1 style={{color:'var(--orange)'}}>Welcome to Dashboard</h1>
        </div>) : (
			<div className="loading-container">
            <GridLoader color={"#0A4044"} loading={loading} size={10} />
          </div>
		)}
        </>
    )
}

export default Page