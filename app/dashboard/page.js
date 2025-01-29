"use client"

import { useAuth } from "@/components/AuthContext";
import UserTable from "@/components/dashboard/users/UserTable";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GridLoader } from "react-spinners";

  

 const Page = () => {

	const {loading, logged, setLoading, userEmail} = useAuth()
  	
	const router = useRouter();

  console.log(userEmail)

  useEffect(() => {
    setLoading(false)

    // Only redirect if not logged and loading is false
    if (!loading && (!logged || userEmail !== 'admin@medicmode.com')) {
      console.log("Redirecting to homepage");
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