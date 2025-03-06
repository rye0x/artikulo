'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { getPostById, updatePost } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { toast } from 'sonner';

interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author_name: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
}

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const postId = unwrappedParams.id;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching post with ID:', postId);
        const data = await getPostById(postId);
        console.log('Fetched post data:', data);

        setPost(data);
        setTitle(data.title);
        setContent(data.content);
        setImageUrl(data.image_url || '');
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    // Check if user is authorized to edit this post
    if (!loading && post && user && post.author_id !== user.id) {
      setError('You are not authorized to edit this post');
      toast.error("Access denied", {
        description: "You can only edit your own posts"
      });

      // Redirect back to the post view after a short delay
      setTimeout(() => {
        router.push(`/blog/${postId}`);
      }, 2000);
    }
  }, [loading, post, user, router, postId]);

  const handleBack = () => {
    router.push(`/blog/${postId}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast.error("Authentication required", {
        description: "You must be logged in to update a post"
      });
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Authentication token not found');

      const postData = {
        title,
        content,
        image_url: imageUrl || undefined
      };

      await updatePost(token, postId, postData);

      toast.success("Post updated", {
        description: "Your post has been successfully updated"
      });

      router.push(`/blog/${postId}`);
    } catch (err) {
      console.error('Error updating post:', err);
      toast.error("Error", {
        description: err instanceof Error ? err.message : 'Failed to update post'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={handleBack} className="rounded-full px-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Post
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-4 flex justify-between items-center">
        <Button variant="outline" onClick={handleBack} className="rounded-full px-4 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Post
        </Button>
        <h1 className="text-2xl font-bold dark:text-white">Edit Post</h1>
      </div>

      <Card className="border border-gray-200 dark:border-gray-700 shadow-md rounded-lg overflow-hidden dark:bg-gray-800">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium dark:text-gray-300">Title</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium dark:text-gray-300">Content</label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                required
                className="min-h-[300px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="imageUrl" className="text-sm font-medium dark:text-gray-300">Image URL (optional)</label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="rounded-full px-4"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
