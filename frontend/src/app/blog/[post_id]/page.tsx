import { notFound } from "next/navigation";
import Image from "next/image";

async function getPost(post_id?: string) {
  if (!post_id) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post_id}`, { cache: "no-store" });

    if (!res.ok) {
      console.error(`Error: Received status ${res.status}`);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
}

export default async function PostPage({ params }: { params: { post_id?: string } }) {
  const post = await getPost(params.post_id);

  if (!post) return notFound();

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="text-sm text-muted-foreground mb-2">{new Date(post.created_at).toLocaleDateString()}</p>
      {post.image_url && <Image src={post.image_url} alt={post.title} width={800} height={400} className="w-full h-auto rounded-lg mb-4" />}
      <div className="text-base text-gray-800">{post.content}</div>
    </div>
  );
}
