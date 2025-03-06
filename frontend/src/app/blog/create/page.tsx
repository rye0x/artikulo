'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Image as ImageIcon, Bold, Italic, Link as LinkIcon, List, ListOrdered, Quote } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createPost } from '@/lib/api';
import  ProtectedRoute  from "@/components/protected-route";

export default function CreateBlogPage() {
// TODO: Implment Zustand state management
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  // Check authentication on page load
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      console.log('Not authenticated, redirecting to login');
      router.push('/login');
    } else if (isAuthenticated) {
      console.log('Authenticated as:', user);
    }
  }, [isAuthenticated, loading, router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Check if user is authenticated
      if (!isAuthenticated) {
        console.error('User not authenticated');
        setError('You must be logged in to create a post');
        router.push('/login');
        return;
      }

      // Get token from localStorage
      const token = localStorage.getItem('auth_token');

      if (!token) {
        console.error('No auth token found in localStorage');
        setError('Authentication required. Please log in again.');
        router.push('/login');
        return;
      }

      console.log('Creating post with token:', token.substring(0, 10) + '...');

      const postData = {
        title,
        content,
        ...(imageUrl && { image_url: imageUrl }),
      };

      console.log('Post data:', postData);

      const result = await createPost(token, postData);
      console.log('Post created successfully:', result);
      router.push('/blog');
    } catch (error: unknown) {
      console.error('Error creating post:', error);

      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        if (
          errorMessage.includes('token') ||
          errorMessage.includes('auth') ||
          errorMessage.includes('unauthorized')
        ) {
          setError('Authentication error. Please log in again.');
          localStorage.removeItem('auth_token'); // Clear invalid token
          setTimeout(() => router.push('/login'), 2000);
        } else {
          setError(error.message || 'Failed to create post. Please try again.');
        }
      } else {
        setError('An unknown error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  // If not authenticated, don't render the form
  if (!isAuthenticated && !loading) {
    return null; // This prevents flash of content before redirect
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto py-10 px-4">
        {/* Medium-like Editor Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </Button>
          </div>
          <div>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !title || !content}
              className="rounded-full px-4"
            >
              {isLoading ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title Input - Medium Style */}
          <div>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="text-3xl font-bold border-none px-0 focus-visible:ring-0 placeholder:text-gray-400"
              required
            />
          </div>

          {/* Optional Featured Image */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-gray-500" />
              <Label htmlFor="imageUrl" className="text-sm font-medium">
                Featured Image URL (optional)
              </Label>
            </div>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="text-sm"
            />
            {imageUrl && (
              <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                <img
                  src={imageUrl}
                  alt="Featured"
                  className="h-full w-full object-cover"
                  onError={() => setError('Invalid image URL')}
                />
              </div>
            )}
          </div>

          {/* Formatting Toolbar - Medium Style */}
          <div className="flex items-center space-x-1 border-t border-b py-2">
            <Button variant="ghost" size="sm" type="button" className="rounded-full h-8 w-8 p-0">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" type="button" className="rounded-full h-8 w-8 p-0">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" type="button" className="rounded-full h-8 w-8 p-0">
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button variant="ghost" size="sm" type="button" className="rounded-full h-8 w-8 p-0">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" type="button" className="rounded-full h-8 w-8 p-0">
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" type="button" className="rounded-full h-8 w-8 p-0">
              <Quote className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" type="button" className="rounded-full h-8 w-8 p-0">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Content Textarea - Medium Style */}
          <Textarea
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell your story..."
            className="min-h-[400px] resize-none text-lg border-none px-0 focus-visible:ring-0 placeholder:text-gray-400"
            required
          />
        </form>
      </div>
    </ProtectedRoute>
  );
}
