"use client"

import { useAuth } from "../context/AuthContext";
import UserTable from "@/components/dashboard/users/UserTable";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GridLoader } from "react-spinners";

  

 const Page = () => {

	const {loading, logged, userEmail} = useAuth()
  	
	const router = useRouter();

  useEffect(() => {
    if (!loading && (!logged || userEmail !== 'admin@medicmode.com')) {
      router.push('/');
    }
  }, [loading, logged, userEmail, router]);

  if (loading) {
    // Show the loader if loading is true
    return (
      <div className="loading-container">
        <GridLoader color={"#0A4044"} loading={loading} size={10} />
      </div>
    );
  }



	return (
		<>
		{(loading || userEmail === 'admin@medicmode.com') ? (
      <UserTable />
    ) :(
			<div className="loading-container">
            <GridLoader color={"#0A4044"} loading={loading} size={10} />
          </div>
		)}
    </>
    )
}

export default Page
