import { redirect } from 'next/navigation';

export default function HomePage() {
  // This will redirect on the server side
  redirect('/auth/login');
  
  // This fallback will never be rendered
  return null;
} 