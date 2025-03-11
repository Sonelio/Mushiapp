import LessonClient from './LessonClient';

export default function LessonPage({ params }: { params: { slug: string } }) {
  return <LessonClient slug={params.slug} />;
} 