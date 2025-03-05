'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Send } from "lucide-react";
import { Metadata } from "next";
import { ProtectedRoute } from "@/components/protected-route";

export const metadata: Metadata = {
  title: "Create Blog Post",
  description: "Create a new blog post",
};

export default function CreateBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Check authentication on page load
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }

      // Redirect to the blog list or new post
      router.push('/blog');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating the post';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // If not authenticated, don't render the form
  if (!isAuthenticated) {
    return null; // This prevents flash of content before redirect
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <Card className="bg-white dark:bg-gray-900 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold">Create New Blog Post</CardTitle>
            <CardDescription>
              Share your thoughts, ideas, and knowledge with the world
            </CardDescription>
          </CardHeader>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 px-6">
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter a catchy title for your article"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium"
                  required
                />
              </div>

              <Separator className="my-6" />

              <div className="space-y-3">
                <Label htmlFor="content" className="text-sm font-medium">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Start writing your article here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[300px] resize-y"
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between px-6 py-6">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
                <Send className="h-4 w-4" />
                {isLoading ? "Creating..." : "Create Post"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
