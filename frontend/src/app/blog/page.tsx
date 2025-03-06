'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookmarkIcon, MoreHorizontal, ThumbsDown } from "lucide-react";

interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();
  const categories = ["For You", "Following", "Featured"];

  useEffect(() => {
    fetch("http://localhost:5000/api/posts")
      .then((res) => res.json())
      .then((data) => {
        console.log("Posts data:", data);
        setPosts(data);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const handlePostClick = (postId: number) => {
    console.log("Navigating to post ID:", postId);
    router.push(`/blog/${postId}`);
  };

  return (
    <div className="container mx-auto py-6 flex">
      {/* Sidebar Categories */}
      <aside className="w-48 p-4 border-r border-gray-200 mt-20">
        <Tabs defaultValue="For You" orientation="vertical">
          <TabsList className="flex flex-col space-y-2">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-sm px-4 py-2 rounded-md data-[state=active]:bg-primary/80 text-left">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </aside>

      {/* Blog Posts Grid */}
      <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="border border-gray-200 dark:border-gray-700 shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition h-full flex flex-col dark:bg-gray-800"
            onClick={() => handlePostClick(post.id)}
          >
            {/* Featured Image */}
            <Image
              src={post.image_url || "/placeholder.svg"}
              alt={post.title}
              width={400}
              height={200}
              className="w-full h-40 object-cover"
            />

            <CardContent className="p-4 flex-1 flex flex-col">
              {/* Title */}
              <h2 className="text-sm font-semibold mb-1 line-clamp-2 dark:text-white">{post.title}</h2>

              {/* Description */}
              <p className="text-xs text-muted-foreground dark:text-gray-300 flex-1 line-clamp-3">
                {post.content}
              </p>
            </CardContent>

            <CardFooter className="p-3 border-t border-gray-200 dark:border-gray-700 flex justify-between bg-muted/10 dark:bg-gray-900 text-xs">
              <span className="text-muted-foreground dark:text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 dark:hover:bg-gray-700" onClick={(e) => e.stopPropagation()}>
                  <ThumbsDown className="h-4 w-4 dark:text-gray-300" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 dark:hover:bg-gray-700" onClick={(e) => e.stopPropagation()}>
                  <BookmarkIcon className="h-4 w-4 dark:text-gray-300" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 dark:hover:bg-gray-700" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="h-4 w-4 dark:text-gray-300" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </main>
    </div>
  );
}
