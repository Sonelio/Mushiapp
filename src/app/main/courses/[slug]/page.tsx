// Remove all imports and type definitions
// Test change for git detection

// Static page without dynamic parameters
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // Await the params Promise to get the actual values
  const { slug } = await params;
  
  return (
    <div className="min-h-screen bg-[#0B0F0F] text-white">
      <h1 className="text-2xl font-bold p-8">Course: {slug}</h1>
      <p className="p-8">This is a placeholder for the course content.</p>
    </div>
  );
} 