"use client"; 
import { useAuth } from '@/components/AuthContext';
import CreatePost from '@/components/dashboard/createpost/CreatePost';

export default function page() {




  return (
    <div className="user-create-blog">
      <CreatePost />
    </div>
  );
}