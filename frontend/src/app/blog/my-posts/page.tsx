'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyPosts, deletePost } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Clock, Edit, Trash2, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

import { useAuth } from '@/context/auth-context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';


// Define Post interface based from backend
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

export default function MyPostsPage() {
    // TODO: Use redux or zustand for state management
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      toast.error("Authentication required", {
        description: "You must be logged in to view your posts"
      });
      router.push('/login');
      return;
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('auth_token');
        if (!token) throw new Error('Authentication token not found');

        const data = await getMyPosts(token);
        console.log('Fetched posts data:', data);
        setPosts(data.posts || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [isAuthenticated, authLoading, router]);

  const handleBack = () => {
    router.push('/blog');
  };

  const confirmDelete = (post: Post) => {
    setPostToDelete(post);
    setShowDeleteDialog(true);
  };

  // Delete post
  const handleDelete = async () => {
    if (!postToDelete) return;

    try {
      setDeletingPostId(postToDelete.id);
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Authentication token not found');

      await deletePost(token, postToDelete.id.toString());

      toast.success("Post deleted", {
        description: "The post has been successfully deleted"
      });

      // Remove the deleted post from the list
      setPosts(posts.filter(post => post.id !== postToDelete.id));
    } catch (err) {
      console.error('Error deleting post:', err);
      toast.error("Error", {
        description: err instanceof Error ? err.message : 'Failed to delete post'
      });
    } finally {
      setDeletingPostId(null);
      setShowDeleteDialog(false);
      setPostToDelete(null);
    }
  };

  // Function to truncate content for preview
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">My Posts</h1>
        </div>
        <Button
          onClick={() => router.push('/blog/create')}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Create New Post
        </Button>
      </div>

      <Separator className="my-4" />

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading your posts...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">You havent created any posts yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Start sharing your thoughts with the world!</p>
          <Button
            onClick={() => router.push('/blog/create')}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Create Your First Post
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(post => (
            <Card key={post.id} className="border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden dark:bg-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold hover:text-primary cursor-pointer" onClick={() => router.push(`/blog/${post.id}`)}>
                  {post.title}
                </CardTitle>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-2">
                <div className="text-gray-600 dark:text-gray-300 mb-4">
                  {truncateContent(post.content)}
                </div>

                {post.image_url && (
                  <div className="relative h-40 w-full mb-4 overflow-hidden rounded-md">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-end space-x-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/blog/edit/${post.id}`)}
                  className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-950"
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => confirmDelete(post)}
                  className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-950"
                  disabled={deletingPostId === post.id}
                >
                  {deletingPostId === post.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deletingPostId ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
