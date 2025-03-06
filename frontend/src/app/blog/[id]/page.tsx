'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { getPostById, deletePost } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Clock, Edit, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

// Define Post interface
interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author_name: string;
  created_at: string;
  updated_at?: string;
  image_url?: string;
}

export default function PostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const postId = unwrappedParams.id;

  const isAuthor = user && post && user.id === post.author_id;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching post with ID:', postId);
        const data = await getPostById(postId);
        console.log('Fetched post data:', data);
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleBack = () => {
    router.push('/blog');
  };

  const handleDelete = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Authentication required", {
        description: "You must be logged in to delete a post"
      });
      return;
    }
    
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Authentication token not found');
      
      await deletePost(token, postId);
      
      toast.success("Post deleted", {
        description: "The post has been successfully deleted"
      });
      
      router.push('/blog');
    } catch (err) {
      console.error('Error deleting post:', err);
      toast.error("Error", {
        description: err instanceof Error ? err.message : 'Failed to delete post'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/blog/edit/${postId}`);
  };

  // Calculate estimated read time (1 min per 200 words)
  const calculateReadTime = (content: string) => {
    const words = content.split(/\s+/).length;
    const readTime = Math.ceil(words / 200);
    return readTime === 1 ? '1 min' : `${readTime} mins`;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 max-w-3xl flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading post...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 max-w-3xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Posts
          </Button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-12 max-w-3xl">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Post not found</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Posts
          </Button>
        </div>
      </div>
    );
  }

  // Format date
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const readTime = calculateReadTime(post.content);

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-4">
        <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          DESIGN
        </Link>
      </div>

      {/* Post Header - Similar to the reference image */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">{post.title}</h1>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto dark:text-gray-300">
          {post.content.substring(0, 120)}...
        </p>

        <div className="flex justify-center items-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex flex-col items-center">
            <span className="uppercase mb-1 dark:text-gray-300">DATE</span>
            <span>{formattedDate}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="uppercase mb-1 dark:text-gray-300">AUTHOR</span>
            <span>{post.author_name}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="uppercase mb-1 dark:text-gray-300">READ</span>
            <span>{readTime}</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.image_url && (
        <div className="rounded-lg overflow-hidden mb-12 dark:bg-gray-700">
          <Image
            src={post.image_url}
            alt={post.title}
            className="w-full h-auto object-cover"
            style={{ maxHeight: '500px', width: '100%' }}
            width={1000}
            height={500}
          />
        </div>
      )}

      {/* Post Content */}
      <div className="grid grid-cols-12 gap-8">
        {/* Social sharing icons column */}
        <div className="col-span-1 flex flex-col items-center space-y-4">
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-600 text-xs dark:text-gray-300">X</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-600 text-xs dark:text-gray-300">in</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-600 text-xs dark:text-gray-300">f</span>
          </div>
        </div>

        {/* Main content column */}
        <div className="col-span-11 prose prose-lg max-w-none dark:prose-invert">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-6 text-gray-800 leading-relaxed dark:text-gray-200">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <Separator className="my-12 dark:bg-gray-700" />

      {/* Post Footer */}
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <Button variant="outline" onClick={handleBack} className="rounded-full px-4 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Posts
        </Button>

        {isAuthor && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleEdit}
              className="rounded-full px-4 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="rounded-full px-4"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your post.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        <div>
          {post?.updated_at && post.updated_at !== post.created_at && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Last updated: {new Date(post.updated_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
