
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GridLoader } from 'react-spinners';
import { useAuth } from '@/components/AuthContext';

const Custom404 = () => {

  const {loading} = useAuth() 

  const router = useRouter();

  useEffect(() => {
    // Redirect to the homepage when a 404 is triggered
    router.push('/dashboard');
  }, [router]);

   return (
    <div className="loading-container">
      <GridLoader color={"#0A4044"} loading={loading} size={10} />
    </div>
  );
};

export default Custom404;
  