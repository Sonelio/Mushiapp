import LessonClient from './LessonClient';

interface PageParams {
  slug: string;
}

// Make the page component async to match Next.js App Router expectations
export default async function LessonPage({ params }: { params: PageParams }) {
  // Params may be a promise in Next.js App Router, so await it
  const slug = params.slug;
  
  return <LessonClient slug={slug} />;
} 