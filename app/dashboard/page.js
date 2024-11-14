"use client"

import { useAuth } from "@/components/AuthContext";
import UserTable from "@/components/dashboard/users/UserTable";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GridLoader } from "react-spinners";

  

 const Page = () => {

	const {loading, logged, setLoading} = useAuth()
  	
	const router = useRouter();


  useEffect(() => {
    setLoading(false)

    // Only redirect if not logged and loading is false
    if (!loading && !logged) {
      console.log("Redirecting to homepage");
      router.push('/');
    }
  }, [loading, logged, router]);

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
		{logged ? (
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